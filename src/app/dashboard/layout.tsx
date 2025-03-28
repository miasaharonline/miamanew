import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import {
  UserCircle,
  MessageSquare,
  Settings,
  Users,
  History,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { TempoInit } from "../tempo-init";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <html lang="en">
      <body>
        <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
        <TempoInit />
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
                href="/dashboard/calendar"
                className="p-3 rounded-full bg-gray-100 text-whatsapp-darkgray hover:bg-gray-200"
              >
                <Calendar size={24} />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Navigation */}
            <div className="bg-whatsapp-darkgreen text-white py-3 px-6 flex justify-between items-center">
              <h1 className="text-xl font-semibold">WhatsApp AI Assistant</h1>
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

            {/* Dashboard Content */}
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
