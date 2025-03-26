import { NextRequest, NextResponse } from "next/server";

// Dynamic import to avoid build-time errors - disabled temporarily
// const getWhatsAppLib = async () => {
//   return await import("@/lib/whatsapp");
// };

export async function GET() {
  try {
    // WhatsApp integration temporarily disabled
    // try {
    //   const lib = await getWhatsAppLib();
    //   // Initialize WhatsApp client before getting chats
    //   await lib.initWhatsApp();
    //   const chats = await lib.getChats();
    //   return NextResponse.json({ chats });
    // } catch (whatsappError) {
    //   console.error("WhatsApp library error:", whatsappError);
    // }

    // Return mock chats instead of using WhatsApp library
    return NextResponse.json({
      chats: [
        {
          id: "mock-chat-1",
          name: "John Doe",
          timestamp: Math.floor(Date.now() / 1000),
          unreadCount: 0,
          lastMessage: "Hello, how can I help you today?",
        },
        {
          id: "mock-chat-2",
          name: "Jane Smith",
          timestamp: Math.floor(Date.now() / 1000) - 3600,
          unreadCount: 2,
          lastMessage: "I have a question about my order",
        },
      ],
      note: "Using mock data - WhatsApp integration temporarily disabled",
    });
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
    return NextResponse.json({
      success: false,
      error: "WhatsApp integration temporarily disabled",
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
