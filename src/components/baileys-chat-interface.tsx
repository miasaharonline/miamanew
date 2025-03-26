"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip, Mic, SmilePlus } from "lucide-react";
import { createClient } from "@/lib/utils";

interface Message {
  id: string;
  body: string;
  timestamp: number;
  isFromMe: boolean;
  chatName?: string;
}

interface ChatInterfaceProps {
  selectedChat: string;
  aiActive?: boolean;
}

export default function BaileysChatInterface({
  selectedChat,
  aiActive = true,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [isTyping, setIsTyping] = useState(false);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/whatsapp/messages?chatId=${selectedChat}`,
        );
        const data = await response.json();

        if (data.messages) {
          setMessages(
            data.messages.map((msg: any) => ({
              id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
              body:
                typeof msg.body === "string"
                  ? msg.body
                  : msg.body === null || msg.body === undefined
                    ? ""
                    : typeof msg.body === "object"
                      ? JSON.stringify(msg.body)
                      : String(msg.body),
              timestamp: new Date(msg.timestamp).getTime() / 1000,
              isFromMe: Boolean(msg.is_from_me),
              chatName: msg.chat_name || "",
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${selectedChat}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: newMessage.message_id || `msg-${Date.now()}-${Math.random()}`,
              body:
                typeof newMessage.body === "string"
                  ? newMessage.body
                  : newMessage.body === null || newMessage.body === undefined
                    ? ""
                    : typeof newMessage.body === "object"
                      ? JSON.stringify(newMessage.body)
                      : String(newMessage.body),
              timestamp: new Date(newMessage.timestamp).getTime() / 1000,
              isFromMe: Boolean(newMessage.is_from_me),
              chatName: newMessage.chat_name || "",
            },
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.channel("messages-channel").unsubscribe();
    };
  }, [selectedChat, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    setLoading(true);

    try {
      // Optimistically add message to UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        body: inputMessage,
        timestamp: Date.now() / 1000,
        isFromMe: true,
      };

      setMessages((prev) => [...prev, tempMessage]);
      setInputMessage("");

      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedChat,
          message: inputMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Simulate AI response
      if (aiActive) {
        setIsTyping(true);
        setTimeout(() => {
          const aiResponse = {
            id: `ai-${Date.now()}`,
            body: "I've received your message and I'm processing it. How can I assist you further?",
            timestamp: Date.now() / 1000,
            isFromMe: false,
          };
          setMessages((prev) => [...prev, aiResponse]);
          setIsTyping(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-whatsapp-darkgreen text-white py-3 px-4 flex items-center">
          <div className="flex-1">
            <h2 className="font-medium">No chat selected</h2>
            <p className="text-xs opacity-80">
              Select a conversation to start chatting
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-16 w-16 text-whatsapp-darkgray opacity-10"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="mt-4 text-whatsapp-darkgray">
              Select a conversation to view messages
            </p>
          </div>
        </div>

        <div className="bg-white p-3 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message"
            className="flex-1 py-2 px-4 bg-whatsapp-gray rounded-lg text-sm focus:outline-none"
            disabled
          />
          <Button
            className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white rounded-full p-2 h-10 w-10"
            disabled
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat header */}
      <div className="bg-whatsapp-darkgreen text-white py-3 px-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="font-medium">
            {messages[0]?.chatName || selectedChat}
          </h2>
          <p className="text-xs opacity-80">
            {isTyping ? "typing..." : `${messages.length} messages`}
          </p>
        </div>
        {aiActive && (
          <div className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
            AI Active
          </div>
        )}
        {!aiActive && (
          <div className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
            Human Mode
          </div>
        )}
      </div>

      {/* Messages area */}
      <div
        className="flex-1 p-4 overflow-y-auto bg-[url('/whatsapp-bg.png')] bg-repeat bg-contain"
        style={{ backgroundSize: "400px" }}
      >
        <div className="flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-whatsapp-darkgray">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                    message.isFromMe
                      ? "bg-whatsapp-lightgreen text-whatsapp-text"
                      : "bg-white text-whatsapp-text"
                  }`}
                >
                  <p className="break-words">
                    {typeof message.body === "string"
                      ? message.body
                      : message.body === null || message.body === undefined
                        ? ""
                        : typeof message.body === "object"
                          ? JSON.stringify(message.body)
                          : String(message.body || "")}
                  </p>
                  <p className="text-xs text-whatsapp-darkgray mt-1 text-right">
                    {new Date(message.timestamp * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-white text-whatsapp-text">
                <div className="flex space-x-1 items-center h-6">
                  <div className="h-2 w-2 bg-whatsapp-darkgray rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-whatsapp-darkgray rounded-full animate-bounce delay-100"></div>
                  <div className="h-2 w-2 bg-whatsapp-darkgray rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="bg-white p-3 flex items-center gap-2">
        <Button
          variant="ghost"
          className="text-whatsapp-darkgray rounded-full p-2 h-10 w-10"
        >
          <SmilePlus size={24} />
        </Button>
        <Button
          variant="ghost"
          className="text-whatsapp-darkgray rounded-full p-2 h-10 w-10"
        >
          <Paperclip size={24} />
        </Button>
        <Input
          type="text"
          placeholder={
            aiActive ? "AI is responding automatically" : "Type a message"
          }
          className="flex-1 py-2 px-4 bg-whatsapp-gray rounded-lg text-sm focus:outline-none"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={aiActive}
        />
        <Button
          variant="ghost"
          className="text-whatsapp-darkgray rounded-full p-2 h-10 w-10"
          disabled={aiActive}
        >
          <Mic size={24} />
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || loading || aiActive}
          className={`${aiActive ? "bg-gray-300" : "bg-whatsapp-green hover:bg-whatsapp-darkgreen"} text-white rounded-full p-2 h-10 w-10`}
        >
          <Send size={18} />
        </Button>
      </div>
      {aiActive && (
        <div className="bg-whatsapp-lightgreen py-1 px-3 text-xs text-center text-whatsapp-darkgreen">
          AI Assistant is actively responding to messages. Click "Take Over
          Chat" to respond manually.
        </div>
      )}
    </div>
  );
}
