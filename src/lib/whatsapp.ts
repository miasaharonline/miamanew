// Import whatsapp-web.js with dynamic import to avoid build issues
let Client, LocalAuth;

// Use dynamic import for server-side, mock for client-side
if (typeof window === "undefined") {
  try {
    // Server-side import with proper ffmpeg handling
    const ffmpegPath = require("ffmpeg-static");
    // Ensure ffmpeg is properly handled before importing whatsapp-web.js
    try {
      // Import and set up ffmpeg mock before importing whatsapp-web.js
      const ffmpegMock = require("./ffmpeg-setup");
      global.ffmpeg = ffmpegMock;
    } catch (ffmpegError) {
      console.error("Failed to set up ffmpeg mock:", ffmpegError);
    }

    const WhatsAppWeb = require("whatsapp-web.js");
    Client = WhatsAppWeb.Client;
    LocalAuth = WhatsAppWeb.LocalAuth;
    console.log("WhatsApp Web.js loaded successfully on server");
  } catch (error) {
    console.error("Failed to import whatsapp-web.js on server:", error);
    // Fallback mock implementation for server
    Client = class MockClient {
      constructor() {
        this.events = {};
      }
      initialize() {
        return Promise.resolve();
      }
      on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return this;
      }
      // Add mock methods for all the functions we're using
      sendMessage(to, body) {
        console.log(`Mock sending message to ${to}: ${body}`);
        return Promise.resolve({
          id: { _serialized: `mock-message-${Date.now()}` },
          from: "mock-sender",
          body: body,
          timestamp: Math.floor(Date.now() / 1000),
        });
      }
      getChats() {
        return Promise.resolve([
          {
            id: { _serialized: "mock-chat-1" },
            name: "Mock Chat 1",
            timestamp: Math.floor(Date.now() / 1000),
            unreadCount: 0,
          },
        ]);
      }
      getChatById() {
        return Promise.resolve({
          id: { _serialized: "mock-chat-1" },
          name: "Mock Chat 1",
          timestamp: Math.floor(Date.now() / 1000),
          unreadCount: 0,
          isGroup: false,
          participants: [],
          fetchMessages: () => Promise.resolve([]),
        });
      }
      getContacts() {
        return Promise.resolve([
          {
            id: { _serialized: "mock-contact-1" },
            name: "Mock Contact 1",
            number: "1234567890",
            isGroup: false,
            isWAContact: true,
            pushname: "Mock User",
          },
        ]);
      }
      getContactById() {
        return Promise.resolve({
          id: { _serialized: "mock-contact-1" },
          name: "Mock Contact 1",
          number: "1234567890",
          isGroup: false,
          isWAContact: true,
        });
      }
      createGroup() {
        return Promise.resolve({
          gid: { _serialized: "mock-group-1" },
          participants: [],
        });
      }
      getProfilePicUrl() {
        return Promise.resolve("https://via.placeholder.com/150");
      }
      getBatteryStatus() {
        return Promise.resolve({ battery: 100, plugged: true });
      }
      getState() {
        return Promise.resolve("CONNECTED");
      }
      getWWebVersion() {
        return Promise.resolve("1.0.0");
      }
      acceptInvite() {
        return Promise.resolve({ _serialized: "mock-group-1" });
      }
      logout() {
        return Promise.resolve();
      }
    };
    LocalAuth = class MockLocalAuth {
      constructor() {}
    };
  }
} else {
  // Client-side will use the mock from webpack alias
  console.log("Using WhatsApp Web.js mock on client");
  const WhatsAppWeb = require("whatsapp-web.js");
  Client = WhatsAppWeb.Client;
  LocalAuth = WhatsAppWeb.LocalAuth;
}
import type { Message } from "whatsapp-web.js";
import { createClient } from "../../supabase/client";

let client: Client | null = null;
let qrCode: string | null = null;
let connectionStatus: "disconnected" | "connecting" | "connected" =
  "disconnected";
let connectionError: string | null = null;
let initializationPromise: Promise<any> | null = null;

// Initialize WhatsApp client
export const initWhatsApp = async () => {
  // If client already exists, return it
  if (client) return client;

  // If initialization is already in progress, return the promise
  if (initializationPromise) return initializationPromise;

  // Create a new initialization promise
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      // Use mock ffmpeg implementation
      console.log("Using mock ffmpeg implementation");

      client = new Client({
        authStrategy: new LocalAuth({ clientId: "whatsapp-ai-assistant" }),
        puppeteer: {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        ffmpegPath: null, // Disable ffmpeg by setting to null
      });

      client.on("qr", (qr) => {
        qrCode = qr;
        connectionStatus = "connecting";
        console.log("QR Code received", qr);
      });

      client.on("ready", () => {
        connectionStatus = "connected";
        qrCode = null;
        console.log("Client is ready!");
      });

      client.on("disconnected", (reason) => {
        connectionStatus = "disconnected";
        connectionError = reason;
        client = null;
        initializationPromise = null;
        console.log("Client was disconnected", reason);
      });

      client.on("message", async (message) => {
        try {
          await handleIncomingMessage(message);
        } catch (error) {
          console.error("Error handling message:", error);
        }
      });

      await client.initialize();
      resolve(client);
    } catch (error) {
      connectionError = error.message;
      connectionStatus = "disconnected";
      client = null;
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
async function handleIncomingMessage(message: Message) {
  // Skip messages from self
  if (message.fromMe) return;

  const supabase = createClient();

  try {
    // Store message in database
    const { error } = await supabase.from("messages").insert({
      chat_id: message.from,
      message_id: message.id._serialized,
      from_number: message.from,
      body: message.body,
      timestamp: new Date(message.timestamp * 1000).toISOString(),
      is_from_me: false,
      media_type: message.hasMedia ? await message.type : null,
      chat_name: (await message.getContact()).name || message.from,
    });

    if (error) throw error;

    // Process with AI and send response
    // This will be implemented in the AI processing function
    await processMessageWithAI(message);
  } catch (error) {
    console.error("Error storing message:", error);
  }
}

// Process message with AI
async function processMessageWithAI(message: Message) {
  // Skip processing voice notes for now
  if (message.hasMedia) {
    console.log("Skipping media message - voice note processing disabled");
    return;
  }

  // This is a placeholder for the AI processing logic
  // Will be implemented with OpenAI integration
  const response = `This is an automated response to: "${message.body}"`;

  try {
    // Send response
    await sendMessage(message.from, response);
  } catch (error) {
    console.error("Error sending AI response:", error);
  }
}

// Send message
export async function sendMessage(to: string, body: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const supabase = createClient();
    const message = await whatsappClient.sendMessage(to, body);

    // Store outgoing message
    await supabase.from("messages").insert({
      chat_id: to,
      message_id: message.id._serialized,
      from_number: message.from,
      body: message.body,
      timestamp: new Date().toISOString(),
      is_from_me: true,
      chat_name: (await whatsappClient.getContactById(to))?.name || to,
    });

    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Get all chats
export async function getChats() {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const chats = await whatsappClient.getChats();
    return chats.map((chat) => ({
      id: chat.id._serialized,
      name: chat.name,
      timestamp: chat.timestamp,
      unreadCount: chat.unreadCount,
    }));
  } catch (error) {
    console.error("Error getting chats:", error);
    throw error;
  }
}

// Get chat by ID
export async function getChatById(chatId: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const chat = await whatsappClient.getChatById(chatId);
    return {
      id: chat.id._serialized,
      name: chat.name,
      timestamp: chat.timestamp,
      unreadCount: chat.unreadCount,
      isGroup: chat.isGroup,
      participants: chat.isGroup
        ? await chat.participants.map((p) => ({ id: p.id._serialized }))
        : [],
    };
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    throw error;
  }
}

// Get chat messages
export async function getChatMessages(chatId: string, limit = 50) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const chat = await whatsappClient.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit });
    return messages.map((msg) => ({
      id: msg.id._serialized,
      body: msg.body,
      timestamp: msg.timestamp,
      from: msg.from,
      fromMe: msg.fromMe,
      hasMedia: msg.hasMedia,
      type: msg.type,
    }));
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
}

// Get contacts
export async function getContacts() {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const contacts = await whatsappClient.getContacts();
    return contacts.map((contact) => ({
      id: contact.id._serialized,
      name: contact.name || contact.pushname || contact.number,
      number: contact.number,
      isGroup: contact.isGroup,
      isWAContact: contact.isWAContact,
    }));
  } catch (error) {
    console.error("Error getting contacts:", error);
    throw error;
  }
}

// Get contact by ID
export async function getContactById(contactId: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const contact = await whatsappClient.getContactById(contactId);
    return {
      id: contact.id._serialized,
      name: contact.name || contact.pushname || contact.number,
      number: contact.number,
      isGroup: contact.isGroup,
      isWAContact: contact.isWAContact,
    };
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
}

// Create group
export async function createGroup(name: string, participants: string[]) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const group = await whatsappClient.createGroup(name, participants);
    return {
      id: group.gid._serialized,
      participants: group.participants,
    };
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

// Get profile picture URL
export async function getProfilePictureUrl(contactId: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const url = await whatsappClient.getProfilePicUrl(contactId);
    return { url };
  } catch (error) {
    console.error("Error getting profile picture URL:", error);
    throw error;
  }
}

// Archive chat
export async function archiveChat(chatId: string, archive = true) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const chat = await whatsappClient.getChatById(chatId);
    await chat.archive(archive);
    return { success: true, archived: archive };
  } catch (error) {
    console.error("Error archiving chat:", error);
    throw error;
  }
}

// Mark chat as read
export async function markChatAsRead(chatId: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const chat = await whatsappClient.getChatById(chatId);
    await chat.sendSeen();
    return { success: true };
  } catch (error) {
    console.error("Error marking chat as read:", error);
    throw error;
  }
}

// Get battery level
export async function getBatteryLevel() {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const batteryInfo = await whatsappClient.getBatteryStatus();
    return batteryInfo;
  } catch (error) {
    console.error("Error getting battery level:", error);
    throw error;
  }
}

// Get connection state
export async function getState() {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const state = await whatsappClient.getState();
    return { state };
  } catch (error) {
    console.error("Error getting state:", error);
    throw error;
  }
}

// Get WhatsApp Web version
export async function getWAVersion() {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const version = await whatsappClient.getWWebVersion();
    return { version };
  } catch (error) {
    console.error("Error getting WhatsApp Web version:", error);
    throw error;
  }
}

// Accept invitation to group
export async function acceptInvite(inviteCode: string) {
  // Ensure client is initialized
  const whatsappClient = await initWhatsApp();

  try {
    const result = await whatsappClient.acceptInvite(inviteCode);
    return { success: true, groupId: result._serialized };
  } catch (error) {
    console.error("Error accepting invite:", error);
    throw error;
  }
}

// Logout and destroy session
export async function logout() {
  if (!client) return;

  try {
    await client.logout();
    client = null;
    connectionStatus = "disconnected";
    qrCode = null;
    initializationPromise = null;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
