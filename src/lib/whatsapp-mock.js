// Mock implementation for whatsapp-web.js
module.exports = {
  Client: class MockClient {
    constructor(options = {}) {
      this.events = {};
      this.options = options;
      // Mock the Util class to avoid ffmpeg errors
      this.util = {
        setFfmpegPath: () => {},
      };
    }

    initialize() {
      // Simulate QR code generation
      setTimeout(() => {
        if (this.events.qr) {
          this.events.qr.forEach((callback) =>
            callback("mock-qr-code-for-testing"),
          );
        }

        // Simulate connection after 3 seconds (reduced from 10 for testing)
        setTimeout(() => {
          if (this.events.ready) {
            this.events.ready.forEach((callback) => callback());
          }
        }, 3000);
      }, 1000);

      return Promise.resolve();
    }

    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
      return this;
    }

    getChats() {
      return Promise.resolve([
        {
          id: { _serialized: "mock-chat-1" },
          name: "Mock Chat 1",
          timestamp: Math.floor(Date.now() / 1000),
          unreadCount: 0,
        },
        {
          id: { _serialized: "mock-chat-2" },
          name: "Mock Chat 2",
          timestamp: Math.floor(Date.now() / 1000) - 3600,
          unreadCount: 2,
        },
      ]);
    }

    getChatById() {
      return Promise.resolve({
        id: { _serialized: "mock-chat-id" },
        name: "Mock Chat",
        timestamp: Date.now() / 1000,
        unreadCount: 0,
        isGroup: false,
        participants: [],
        fetchMessages: () =>
          Promise.resolve([
            {
              id: { _serialized: "mock-message-1" },
              body: "Hello there!",
              timestamp: Math.floor(Date.now() / 1000) - 3600,
              from: "mock-sender-1",
              to: "mock-receiver-1",
              fromMe: false,
              hasMedia: false,
              toString: function () {
                return this.body;
              },
            },
            {
              id: { _serialized: "mock-message-2" },
              body: "How are you?",
              timestamp: Math.floor(Date.now() / 1000) - 1800,
              from: "mock-sender-2",
              to: "mock-receiver-2",
              fromMe: true,
              hasMedia: false,
              toString: function () {
                return this.body;
              },
            },
          ]),
        sendMessage: (text) =>
          Promise.resolve({
            id: { _serialized: `mock-reply-${Date.now()}` },
            body: text,
            timestamp: Math.floor(Date.now() / 1000),
            fromMe: true,
            toString: function () {
              return this.body;
            },
          }),
      });
    }

    getContacts() {
      return Promise.resolve([
        {
          id: { _serialized: "mock-contact-1" },
          name: "Mock Contact 1",
          number: "+1234567890",
          isGroup: false,
          isWAContact: true,
          pushname: "Mock User 1",
        },
        {
          id: { _serialized: "mock-contact-2" },
          name: "Mock Contact 2",
          number: "+0987654321",
          isGroup: false,
          isWAContact: true,
          pushname: "Mock User 2",
        },
      ]);
    }

    getContactById() {
      return Promise.resolve({
        id: { _serialized: "mock-contact-id" },
        name: "Mock Contact",
        number: "+1234567890",
        isGroup: false,
        isWAContact: true,
      });
    }

    createGroup() {
      return Promise.resolve({
        gid: { _serialized: "mock-group-id" },
        participants: [],
      });
    }

    getProfilePicUrl() {
      return Promise.resolve("https://example.com/profile.jpg");
    }

    getBatteryStatus() {
      return Promise.resolve({
        battery: 75,
        plugged: false,
      });
    }

    getState() {
      return Promise.resolve("CONNECTED");
    }

    getWWebVersion() {
      return Promise.resolve("2.2345.6");
    }

    acceptInvite() {
      return Promise.resolve({ _serialized: "mock-group-id" });
    }

    logout() {
      if (this.events.disconnected) {
        this.events.disconnected.forEach((callback) => callback("Logged out"));
      }
      return Promise.resolve();
    }

    sendMessage() {
      return Promise.resolve({
        id: { _serialized: "mock-message-id" },
        from: "mock-from",
        body: "Mock message",
        timestamp: Date.now() / 1000,
        toString: function () {
          return this.body;
        },
      });
    }
  },

  LocalAuth: class MockLocalAuth {
    constructor(options = {}) {
      this.clientId = options.clientId || "default";
    }
  },

  // Add missing exports that might be used
  MessageMedia: class MockMessageMedia {
    constructor(mimetype, data, filename) {
      this.mimetype = mimetype;
      this.data = data;
      this.filename = filename;
    }
  },
};
