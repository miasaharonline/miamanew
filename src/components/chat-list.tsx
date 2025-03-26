"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

interface Chat {
  id: string;
  name: string;
  timestamp: number;
  unreadCount: number;
  lastMessage?: string;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/whatsapp/chats");
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setChats(data.chats || []);
      } catch (err) {
        setError("Failed to load chats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 text-whatsapp-darkgreen animate-spin" />
      </div>
    );
  }

  if (error || chats.length === 0) {
    return (
      <div className="py-10 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-whatsapp-darkgray opacity-20" />
        <p className="mt-2 text-whatsapp-darkgray">
          {error || "No conversations yet"}
        </p>
        <Link href="/dashboard/accounts">
          <Button className="mt-4 bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white">
            Connect WhatsApp
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-3 hover:bg-whatsapp-gray cursor-pointer ${selectedChat === chat.id ? "bg-whatsapp-lightgreen" : ""}`}
          onClick={() => setSelectedChat(chat.id)}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-whatsapp-green flex items-center justify-center text-white font-medium">
              {chat.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-whatsapp-text truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-whatsapp-darkgray">
                  {new Date(chat.timestamp * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-whatsapp-darkgray truncate">
                  {chat.lastMessage || "No messages yet"}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-whatsapp-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
