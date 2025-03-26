import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json(
      { error: "Missing required parameter: chatId" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    // Get user to verify authorization
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // WhatsApp integration temporarily disabled
    // try {
    //   // Get messages for the chat
    //   const { data: messages, error } = await supabase
    //     .from("messages")
    //     .select("*")
    //     .eq("chat_id", chatId)
    //     .order("timestamp", { ascending: true });

    //   if (error) {
    //     throw error;
    //   }

    //   return NextResponse.json({ messages: messages || [] });
    // } catch (dbError) {
    //   console.error("Database error:", dbError);
    // }

    // Return mock messages instead
    return NextResponse.json({
      messages: [
        {
          message_id: "mock-1",
          body: "Hello! How can I help you today?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          is_from_me: true,
          chat_id: chatId,
          chat_name: "Mock Chat",
        },
        {
          message_id: "mock-2",
          body: "I have a question about my order",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          is_from_me: false,
          chat_id: chatId,
          chat_name: "Mock Chat",
        },
      ],
      note: "Using mock data - WhatsApp integration temporarily disabled",
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
