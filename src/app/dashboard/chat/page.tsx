import { Button } from "@/components/ui/button";
import {
  UserCircle,
  MessageSquare,
  Settings,
  Users,
  History,
  BarChart3,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Link from "next/link";
import ChatList from "@/components/chat-list";
import ChatInterface from "@/components/chat-interface";

export default async function Chat() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-whatsapp-gray overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <div className="flex flex-col items-center space-y-6">
          <Link
            href="/dashboard"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
              <path d="M9 15h.01" />
              <path d="M15 15h.01" />
            </svg>
          </Link>
          <Link
            href="/dashboard/accounts"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <Users size={24} />
          </Link>
          <Link
            href="/dashboard/ai-config"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <Settings size={24} />
          </Link>
          <Link
            href="/dashboard/history"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <History size={24} />
          </Link>
          <Link
            href="/dashboard/chat"
            className="p-3 rounded-full bg-whatsapp-darkgreen text-white"
          >
            <MessageSquare size={24} />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-whatsapp-darkgreen text-white py-3 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Live Chat</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-whatsapp-green"
            >
              <UserCircle className="h-6 w-6" />
              <span className="ml-2">{user.email}</span>
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat list - hidden on mobile */}
          <div className="w-1/3 border-r border-gray-200 hidden md:block">
            <ChatList />
          </div>

          {/* Chat messages */}
          <div className="flex-1">
            <ChatInterface selectedChat={null} aiActive={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
