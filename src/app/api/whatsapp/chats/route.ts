import { NextRequest, NextResponse } from "next/server";

// Dynamic import to avoid build-time errors
const getWhatsAppLib = async () => {
  return await import("@/lib/whatsapp");
};

export async function GET() {
  try {
    try {
      const lib = await getWhatsAppLib();
      // Initialize WhatsApp client before getting chats
      await lib.initWhatsApp();
      const chats = await lib.getChats();
      return NextResponse.json({ chats });
    } catch (whatsappError) {
      console.error("WhatsApp library error:", whatsappError);
      // Return mock chats if WhatsApp library fails
      return NextResponse.json({
        chats: [
          {
            id: { _serialized: "mock-chat-1" },
            name: "John Doe",
            timestamp: Math.floor(Date.now() / 1000),
            unreadCount: 0,
            lastMessage: {
              body: "Hello, how can I help you today?",
              timestamp: Math.floor(Date.now() / 1000) - 300,
            },
          },
          {
            id: { _serialized: "mock-chat-2" },
            name: "Jane Smith",
            timestamp: Math.floor(Date.now() / 1000) - 3600,
            unreadCount: 2,
            lastMessage: {
              body: "I have a question about my order",
              timestamp: Math.floor(Date.now() / 1000) - 3600,
            },
          },
        ],
        note: "Using mock data due to WhatsApp library error",
      });
    }
  } catch (error) {
    console.error("Error getting chats:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Process the request
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
