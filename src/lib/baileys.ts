import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidUser,
  proto,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { join } from "path";
import { writeFile } from "fs/promises";
import { createClient } from "../../supabase/client";
import * as fs from "fs";
import pino from "pino";

// Global state
let sock: ReturnType<typeof makeWASocket> | null = null;
let qrCode: string | null = null;
let connectionStatus: "disconnected" | "connecting" | "connected" =
  "disconnected";
let connectionError: string | null = null;
let initializationPromise: Promise<any> | null = null;

// Create auth folder if it doesn't exist
const AUTH_FOLDER = join(process.cwd(), ".auth");
if (!fs.existsSync(AUTH_FOLDER)) {
  fs.mkdirSync(AUTH_FOLDER, { recursive: true });
}

// Initialize WhatsApp client
export const initWhatsApp = async () => {
  // If client already exists, return it
  if (sock) return sock;

  // If initialization is already in progress, return the promise
  if (initializationPromise) return initializationPromise;

  // Create a new initialization promise
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      // Logger
      const logger = pino({ level: "silent" });

      // Auth state
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

      // Fetch latest version
      const { version } = await fetchLatestBaileysVersion();
      console.log(`Using WA v${version.join(".")}`);

      // Create socket
      sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: true,
        browser: ["WhatsApp AI Assistant", "Chrome", "1.0.0"],
      });

      // Connection events
      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          qrCode = qr;
          connectionStatus = "connecting";
          console.log("QR Code received", qr);
        }

        if (connection === "close") {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
            "Connection closed due to ",
            lastDisconnect?.error,
            ", reconnecting ",
            shouldReconnect,
          );

          if (shouldReconnect) {
            connectionStatus = "disconnected";
            connectionError = "Connection closed. Reconnecting...";
            sock = null;
            initializationPromise = null;
            await initWhatsApp();
          } else {
            connectionStatus = "disconnected";
            connectionError = "Logged out";
            sock = null;
            initializationPromise = null;
          }
        } else if (connection === "open") {
          connectionStatus = "connected";
          qrCode = null;
          connectionError = null;
          console.log("Connection opened!");
        }
      });

      // Credentials update
      sock.ev.on("creds.update", saveCreds);

      // Message events
      sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const message of messages) {
          if (!message.key.fromMe && message.message) {
            try {
              await handleIncomingMessage(message);
            } catch (error) {
              console.error("Error handling message:", error);
            }
          }
        }
      });

      resolve(sock);
    } catch (error) {
      connectionError = error.message;
      connectionStatus = "disconnected";
      sock = null;
      initializationPromise = null;
      console.error("Failed to initialize WhatsApp client:", error);
      reject(error);
    }
  });

  return initializationPromise;
};

// Get connection status
export const getConnectionStatus = () => {
  return {
    status: connectionStatus,
    qrCode,
    error: connectionError,
  };
};

// Handle incoming messages
async function handleIncomingMessage(message: proto.IWebMessageInfo) {
  // Skip messages from self or non-user JIDs
  if (message.key.fromMe || !isJidUser(message.key.remoteJid)) return;

  const supabase = createClient();
  const remoteJid = message.key.remoteJid;
  const messageContent = message.message;

  // Extract text content
  let body = "";
  if (messageContent?.conversation) {
    body = messageContent.conversation;
  } else if (messageContent?.extendedTextMessage?.text) {
    body = messageContent.extendedTextMessage.text;
  } else {
    // Handle other message types (media, etc.)
    body = "[Media or unsupported message type]";
  }

  try {
    // Store message in database
    const { error } = await supabase.from("messages").insert({
      chat_id: remoteJid,
      message_id: message.key.id,
      from_number: remoteJid,
      body: body,
      timestamp: new Date(
        (message.messageTimestamp as number) * 1000,
      ).toISOString(),
      is_from_me: false,
      media_type: messageContent?.imageMessage
        ? "image"
        : messageContent?.videoMessage
          ? "video"
          : messageContent?.audioMessage
            ? "audio"
            : "text",
      chat_name: remoteJid.split("@")[0],
    });

    if (error) throw error;

    // Process with AI and send response
    await processMessageWithAI(message);
  } catch (error) {
    console.error("Error storing message:", error);
  }
}

// Process message with AI
async function processMessageWithAI(message: proto.IWebMessageInfo) {
  // Skip processing media messages for now
  if (!message.message?.conversation && !message.message?.extendedTextMessage) {
    console.log("Skipping media message - processing not implemented yet");
    return;
  }

  const text =
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    "";

  // This is a placeholder for the AI processing logic
  // Will be implemented with OpenAI integration
  const response = `This is an automated response to: "${text}"`;

  try {
    // Send response
    await sendMessage(message.key.remoteJid, response);
  } catch (error) {
    console.error("Error sending AI response:", error);
  }
}

// Send message
export async function sendMessage(to: string, body: string) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const supabase = createClient();
    const messageId = `${Date.now()}`;

    // Send message
    const sentMsg = await client.sendMessage(to, { text: body });

    // Store outgoing message
    await supabase.from("messages").insert({
      chat_id: to,
      message_id: sentMsg.key.id,
      from_number: to,
      body: body,
      timestamp: new Date().toISOString(),
      is_from_me: true,
      chat_name: to.split("@")[0],
    });

    return sentMsg;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Get all chats
export async function getChats() {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const chats = await client.groupFetchAllParticipating();
    const userChats = Object.entries(await client.fetchMessageReceipts()).map(
      ([id, chat]) => ({
        id,
        name: id.split("@")[0],
        timestamp: Date.now() / 1000,
        unreadCount: 0,
      }),
    );

    // Combine user and group chats
    return [
      ...userChats,
      ...Object.entries(chats).map(([id, chat]) => ({
        id,
        name: chat.subject || id.split("@")[0],
        timestamp: Date.now() / 1000,
        unreadCount: 0,
        isGroup: true,
      })),
    ];
  } catch (error) {
    console.error("Error getting chats:", error);
    return [];
  }
}

// Get chat by ID
export async function getChatById(chatId: string) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const isGroup = chatId.endsWith("@g.us");

    if (isGroup) {
      const groupInfo = await client.groupMetadata(chatId);
      return {
        id: chatId,
        name: groupInfo.subject,
        timestamp: Date.now() / 1000,
        unreadCount: 0,
        isGroup: true,
        participants: groupInfo.participants.map((p) => ({ id: p.id })),
      };
    } else {
      return {
        id: chatId,
        name: chatId.split("@")[0],
        timestamp: Date.now() / 1000,
        unreadCount: 0,
        isGroup: false,
        participants: [],
      };
    }
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    throw error;
  }
}

// Get chat messages
export async function getChatMessages(chatId: string, limit = 50) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    // For now, we'll return messages from the database
    // In a real implementation, you would fetch messages from the WhatsApp API
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((msg) => ({
      id: msg.message_id,
      body: msg.body,
      timestamp: new Date(msg.timestamp).getTime() / 1000,
      from: msg.from_number,
      fromMe: msg.is_from_me,
      hasMedia: msg.media_type !== "text",
      type: msg.media_type,
    }));
  } catch (error) {
    console.error("Error getting chat messages:", error);
    return [];
  }
}

// Get contacts
export async function getContacts() {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    // In Baileys, we need to build the contacts list from various sources
    const chats = await getChats();

    // Convert chats to contacts format
    return chats.map((chat) => ({
      id: chat.id,
      name: chat.name,
      number: chat.id.split("@")[0],
      isGroup: chat.isGroup || false,
      isWAContact: true,
    }));
  } catch (error) {
    console.error("Error getting contacts:", error);
    return [];
  }
}

// Get contact by ID
export async function getContactById(contactId: string) {
  // Ensure client is initialized
  await initWhatsApp();

  try {
    const isGroup = contactId.endsWith("@g.us");

    return {
      id: contactId,
      name: contactId.split("@")[0],
      number: contactId.split("@")[0],
      isGroup,
      isWAContact: true,
    };
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
}

// Create group
export async function createGroup(name: string, participants: string[]) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const group = await client.groupCreate(
      name,
      participants.map((p) => (p.includes("@") ? p : `${p}@s.whatsapp.net`)),
    );
    return {
      id: group.id,
      participants: group.participants.map((p) => ({ id: p.id })),
    };
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

// Get profile picture URL
export async function getProfilePictureUrl(contactId: string) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const url = await client.profilePictureUrl(contactId, "image");
    return { url };
  } catch (error) {
    console.error("Error getting profile picture URL:", error);
    return { url: "" };
  }
}

// Archive chat - not directly supported in Baileys, but we can simulate it
export async function archiveChat(chatId: string, archive = true) {
  // This is a placeholder - Baileys doesn't have a direct archive function
  return {
    success: false,
    archived: archive,
    message: "Archive functionality not supported in Baileys",
  };
}

// Mark chat as read
export async function markChatAsRead(chatId: string) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    await client.readMessages([
      { remoteJid: chatId, id: "placeholder", participant: undefined },
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error marking chat as read:", error);
    throw error;
  }
}

// Get battery level - not available in Baileys
export async function getBatteryLevel() {
  // Placeholder - Baileys doesn't provide battery info
  return { battery: 100, plugged: true };
}

// Get connection state
export async function getState() {
  return { state: connectionStatus.toUpperCase() };
}

// Get WhatsApp Web version
export async function getWAVersion() {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const { version } = await fetchLatestBaileysVersion();
    return { version: version.join(".") };
  } catch (error) {
    console.error("Error getting WhatsApp Web version:", error);
    return { version: "0.0.0" };
  }
}

// Accept invitation to group
export async function acceptInvite(inviteCode: string) {
  // Ensure client is initialized
  const client = await initWhatsApp();

  try {
    const groupId = await client.groupAcceptInvite(inviteCode);
    return { success: true, groupId };
  } catch (error) {
    console.error("Error accepting invite:", error);
    throw error;
  }
}

// Logout and destroy session
export async function logout() {
  if (!sock) return;

  try {
    await sock.logout();
    sock = null;
    connectionStatus = "disconnected";
    qrCode = null;
    initializationPromise = null;

    // Delete auth files
    try {
      fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
      fs.mkdirSync(AUTH_FOLDER, { recursive: true });
    } catch (err) {
      console.error("Error cleaning auth folder:", err);
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
