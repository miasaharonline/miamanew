import { Button } from "@/components/ui/button";
import {
  InfoIcon,
  History,
  Search,
  Download,
  Filter,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Link from "next/link";

export default async function ChatHistory() {
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
            className="p-3 rounded-full bg-whatsapp-darkgreen text-white"
          >
            <History size={24} />
          </Link>
          <Link
            href="/dashboard/chat-baileys"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <MessageSquare size={24} />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-whatsapp-darkgreen text-white py-3 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Conversation History</h1>
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

        {/* History Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-whatsapp-darkgreen" />
                <h2 className="text-xl font-semibold text-whatsapp-text">
                  Conversation History
                </h2>
              </div>

              <div className="bg-whatsapp-lightgreen text-sm p-3 px-4 rounded-lg text-whatsapp-darkgreen flex gap-2 items-center mb-6">
                <InfoIcon size="14" />
                <span>
                  View and search through past conversations handled by your AI
                  assistant
                </span>
              </div>

              {/* Search and filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-whatsapp-darkgray" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} />
                    Export
                  </Button>
                </div>
              </div>

              {/* No history state */}
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                <History className="mx-auto h-12 w-12 text-whatsapp-darkgray opacity-30" />
                <h3 className="mt-4 text-lg font-medium text-whatsapp-text">
                  No conversation history yet
                </h3>
                <p className="mt-1 text-sm text-whatsapp-darkgray">
                  Connect a WhatsApp account and start conversations to see
                  history
                </p>
                <Button className="mt-6 bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white mx-auto">
                  Go to Accounts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
