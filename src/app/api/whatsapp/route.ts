import { NextRequest, NextResponse } from "next/server";

// Import from the new Baileys implementation
let whatsappLib;
const getWhatsAppLib = async () => {
  if (!whatsappLib) {
    try {
      // Try to load the Baileys WhatsApp library
      try {
        whatsappLib = await import("@/lib/baileys");
        console.log("Baileys WhatsApp library loaded successfully");
      } catch (importError) {
        console.error(
          "Error importing Baileys WhatsApp library, using mock implementation",
          importError,
        );
        // Create a mock implementation that returns empty data
        whatsappLib = {
          initWhatsApp: async () => ({}),
          getConnectionStatus: () => ({
            status: "disconnected",
            qrCode: null,
            error: "Baileys WhatsApp library not available",
          }),
          logout: async () => ({}),
          getChats: async () => [],
          getChatById: async () => ({}),
          getChatMessages: async () => [],
          sendMessage: async () => ({ id: { _serialized: "mock-message-id" } }),
          getContacts: async () => [],
          getContactById: async () => ({}),
          createGroup: async () => ({}),
          getProfilePictureUrl: async () => ({ url: "" }),
          archiveChat: async () => ({ success: false }),
          markChatAsRead: async () => ({ success: false }),
          getBatteryLevel: async () => ({ battery: 0, plugged: false }),
          getState: async () => ({ state: "DISCONNECTED" }),
          getWAVersion: async () => ({ version: "0.0.0" }),
          acceptInvite: async () => ({ success: false }),
        };
      }
    } catch (error) {
      console.error("Failed to create WhatsApp library:", error);
      throw error;
    }
  }
  return whatsappLib;
};

// Initialize WhatsApp client
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

    const { action } = body;
    const lib = await getWhatsAppLib();

    switch (action) {
      case "init":
        await lib.initWhatsApp();
        return NextResponse.json(lib.getConnectionStatus());

      case "status":
        return NextResponse.json(lib.getConnectionStatus());

      case "logout":
        await lib.logout();
        return NextResponse.json({
          success: true,
          message: "Logged out successfully",
        });

      case "getChats":
        const chats = await lib.getChats();
        return NextResponse.json({ chats });

      case "getChatById":
        const { chatId } = body;
        if (!chatId) {
          return NextResponse.json(
            { error: "Chat ID is required" },
            { status: 400 },
          );
        }
        const chat = await lib.getChatById(chatId);
        return NextResponse.json({ chat });

      case "getChatMessages":
        const { chatId: msgChatId, limit } = body;
        if (!msgChatId) {
          return NextResponse.json(
            { error: "Chat ID is required" },
            { status: 400 },
          );
        }
        const messages = await lib.getChatMessages(msgChatId, limit);
        return NextResponse.json({ messages });

      case "sendMessage":
        const { to, message } = body;
        if (!to || !message) {
          return NextResponse.json(
            { error: "To and message are required" },
            { status: 400 },
          );
        }
        const sentMessage = await lib.sendMessage(to, message);
        return NextResponse.json({ success: true, message: sentMessage });

      case "getContacts":
        const contacts = await lib.getContacts();
        return NextResponse.json({ contacts });

      case "getContactById":
        const { contactId } = body;
        if (!contactId) {
          return NextResponse.json(
            { error: "Contact ID is required" },
            { status: 400 },
          );
        }
        const contact = await lib.getContactById(contactId);
        return NextResponse.json({ contact });

      case "createGroup":
        const { name, participants } = body;
        if (!name || !participants) {
          return NextResponse.json(
            { error: "Name and participants are required" },
            { status: 400 },
          );
        }
        const group = await lib.createGroup(name, participants);
        return NextResponse.json({ group });

      case "getProfilePicture":
        const { id: profileId } = body;
        if (!profileId) {
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 },
          );
        }
        const profilePic = await lib.getProfilePictureUrl(profileId);
        return NextResponse.json(profilePic);

      case "archiveChat":
        const { chatId: archiveChatId, archive } = body;
        if (!archiveChatId) {
          return NextResponse.json(
            { error: "Chat ID is required" },
            { status: 400 },
          );
        }
        const archiveResult = await lib.archiveChat(archiveChatId, archive);
        return NextResponse.json(archiveResult);

      case "markChatAsRead":
        const { chatId: readChatId } = body;
        if (!readChatId) {
          return NextResponse.json(
            { error: "Chat ID is required" },
            { status: 400 },
          );
        }
        const readResult = await lib.markChatAsRead(readChatId);
        return NextResponse.json(readResult);

      case "getBatteryLevel":
        const battery = await lib.getBatteryLevel();
        return NextResponse.json({ battery });

      case "getState":
        const state = await lib.getState();
        return NextResponse.json(state);

      case "getWAVersion":
        const version = await lib.getWAVersion();
        return NextResponse.json(version);

      case "acceptInvite":
        const { inviteCode } = body;
        if (!inviteCode) {
          return NextResponse.json(
            { error: "Invite code is required" },
            { status: 400 },
          );
        }
        const inviteResult = await lib.acceptInvite(inviteCode);
        return NextResponse.json(inviteResult);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("WhatsApp API error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
