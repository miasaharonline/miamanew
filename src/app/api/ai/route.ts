import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse, extractEventDetails } from "@/lib/openai";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { message, systemPrompt } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get user to verify authorization
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get AI configuration for the user
    const { data: aiConfig } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Use default system prompt if not provided and not in config
    const finalSystemPrompt =
      systemPrompt ||
      aiConfig?.system_prompt ||
      "You are a helpful WhatsApp assistant that responds to user queries in a friendly, concise manner.";

    // Generate AI response
    const response = await generateAIResponse(message, finalSystemPrompt);

    // Check for event details
    const eventDetails = await extractEventDetails(message);

    // If event details found, store in database
    if (eventDetails.hasEvent) {
      // This would store the event in a calendar or events table
      // For now, just log it
      console.log("Event detected:", eventDetails);
    }

    return NextResponse.json({
      response,
      eventDetails: eventDetails.hasEvent ? eventDetails : null,
    });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
