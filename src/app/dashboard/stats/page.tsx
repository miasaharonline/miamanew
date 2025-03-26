import { Button } from "@/components/ui/button";
import {
  InfoIcon,
  BarChart3,
  Calendar,
  MessageSquare,
  Mic,
  Clock,
  UserCircle,
  Settings,
  History,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Link from "next/link";

export default async function Stats() {
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
            href="/dashboard/chat-baileys"
            className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
          >
            <MessageSquare size={24} />
          </Link>
          <Link
            href="/dashboard/stats"
            className="p-3 rounded-full bg-whatsapp-darkgreen text-white"
          >
            <BarChart3 size={24} />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-whatsapp-darkgreen text-white py-3 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Analytics & Statistics</h1>
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

        {/* Stats Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-whatsapp-darkgreen" />
                <h2 className="text-xl font-semibold text-whatsapp-text">
                  AI Assistant Analytics
                </h2>
              </div>

              <div className="bg-whatsapp-lightgreen text-sm p-3 px-4 rounded-lg text-whatsapp-darkgreen flex gap-2 items-center mb-6">
                <InfoIcon size="14" />
                <span>
                  View detailed statistics about your WhatsApp AI assistant's
                  performance
                </span>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-whatsapp-lightgreen p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-whatsapp-darkgreen font-medium">
                      Total Conversations
                    </h3>
                    <MessageSquare className="h-5 w-5 text-whatsapp-darkgreen opacity-70" />
                  </div>
                  <p className="text-3xl font-bold text-whatsapp-darkgreen">
                    0
                  </p>
                  <p className="text-xs text-whatsapp-darkgray mt-2">
                    Last 30 days
                  </p>
                </div>

                <div className="bg-whatsapp-sent p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-whatsapp-blue font-medium">
                      Messages Processed
                    </h3>
                    <MessageSquare className="h-5 w-5 text-whatsapp-blue opacity-70" />
                  </div>
                  <p className="text-3xl font-bold text-whatsapp-blue">0</p>
                  <p className="text-xs text-whatsapp-darkgray mt-2">
                    Last 30 days
                  </p>
                </div>

                <div className="bg-whatsapp-lightpurple p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-whatsapp-purple font-medium">
                      Voice Notes Transcribed
                    </h3>
                    <Mic className="h-5 w-5 text-whatsapp-purple opacity-70" />
                  </div>
                  <p className="text-3xl font-bold text-whatsapp-purple">0</p>
                  <p className="text-xs text-whatsapp-darkgray mt-2">
                    Last 30 days
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-medium">
                      Events Created
                    </h3>
                    <Calendar className="h-5 w-5 text-gray-700 opacity-70" />
                  </div>
                  <p className="text-3xl font-bold text-gray-700">0</p>
                  <p className="text-xs text-whatsapp-darkgray mt-2">
                    Last 30 days
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-whatsapp-darkgreen" />
                  <h3 className="text-lg font-medium text-whatsapp-text">
                    Response Time
                  </h3>
                </div>
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <p className="text-whatsapp-darkgray">
                      No data available yet
                    </p>
                    <p className="text-sm text-whatsapp-darkgray mt-1">
                      Connect your WhatsApp account to start collecting
                      statistics
                    </p>
                  </div>
                </div>
              </div>

              {/* No data state */}
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <BarChart3 className="mx-auto h-12 w-12 text-whatsapp-darkgray opacity-30" />
                <h3 className="mt-4 text-lg font-medium text-whatsapp-text">
                  No analytics data available yet
                </h3>
                <p className="mt-1 text-sm text-whatsapp-darkgray">
                  Connect a WhatsApp account and start conversations to see
                  statistics
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
