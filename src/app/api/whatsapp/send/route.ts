import { NextRequest, NextResponse } from "next/server";

// Dynamic import to avoid build-time errors - disabled temporarily
// const getWhatsAppLib = async () => {
//   return await import("@/lib/whatsapp");
// };

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

    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 },
      );
    }

    // WhatsApp integration temporarily disabled
    // try {
    //   const lib = await getWhatsAppLib();
    //   // Initialize WhatsApp client before sending message
    //   await lib.initWhatsApp();
    //   const result = await lib.sendMessage(to, message);
    //   return NextResponse.json({
    //     success: true,
    //     messageId: result.id._serialized,
    //   });
    // } catch (whatsappError) {
    //   console.error("WhatsApp library error:", whatsappError);
    // }

    // Return a mock response instead
    return NextResponse.json({
      success: true,
      messageId: `mock-${Date.now()}`,
      note: "Using mock data - WhatsApp integration temporarily disabled",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
