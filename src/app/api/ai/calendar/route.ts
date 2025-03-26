import { NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import { extractEventDetails } from "@/lib/openai";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Extract event details from the message
    const eventDetails = await extractEventDetails(message);

    if (!eventDetails.hasEvent) {
      return NextResponse.json({ hasEvent: false });
    }

    // Create the event in the database
    const startDateTime = `${eventDetails.date}T${eventDetails.time}:00`;

    // Calculate end time (1 hour after start by default)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    const endDateTime = endDate.toISOString();

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: eventDetails.title,
          description: eventDetails.description,
          start_time: startDateTime,
          end_time: endDateTime,
          location: eventDetails.location,
          user_id: session.session.user.id,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update the events_created count in conversation_stats
    const today = new Date().toISOString().split("T")[0];

    // Check if there's a stats record for today
    const { data: statsData } = await supabase
      .from("conversation_stats")
      .select("*")
      .eq("date", today)
      .eq("user_id", session.session.user.id)
      .single();

    if (statsData) {
      // Update existing record
      await supabase
        .from("conversation_stats")
        .update({
          events_created: statsData.events_created + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", statsData.id);
    } else {
      // Create new record
      await supabase.from("conversation_stats").insert([
        {
          date: today,
          user_id: session.session.user.id,
          events_created: 1,
          messages_processed: 0,
          total_conversations: 0,
          voice_notes_transcribed: 0,
        },
      ]);
    }

    return NextResponse.json({
      hasEvent: true,
      event: data[0],
      message: `Event "${eventDetails.title}" has been added to your calendar for ${eventDetails.date} at ${eventDetails.time}.`,
    });
  } catch (error) {
    console.error("Error processing calendar event:", error);
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 },
    );
  }
}
