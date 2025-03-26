import { Button } from "@/components/ui/button";
import {
  InfoIcon,
  Users,
  Plus,
  Smartphone,
  QrCode,
  MessageSquare,
  Settings,
  History,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import QRCodeScanner from "@/components/qr-code-scanner";
import Link from "next/link";

export default async function Accounts() {
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
            className="p-3 rounded-full bg-whatsapp-darkgreen text-white"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-whatsapp-darkgreen text-white py-3 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">WhatsApp Accounts</h1>
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

        {/* Accounts Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-whatsapp-darkgreen" />
                <h2 className="text-xl font-semibold text-whatsapp-text">
                  WhatsApp Accounts
                </h2>
              </div>

              <div className="bg-whatsapp-lightgreen text-sm p-3 px-4 rounded-lg text-whatsapp-darkgreen flex gap-2 items-center mb-6">
                <InfoIcon size="14" />
                <span>
                  Connect WhatsApp accounts to enable your AI assistant
                </span>
              </div>

              {/* QR Code Scanner */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-whatsapp-text mb-4">
                  Connect WhatsApp Account
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-whatsapp-darkgray mb-4">
                    Scan the QR code with your WhatsApp app to connect your
                    account
                  </p>
                  <QRCodeScanner />
                </div>
              </div>

              {/* Connection instructions */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-whatsapp-text mb-4">
                  How to connect your WhatsApp account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-whatsapp-lightgreen text-whatsapp-darkgreen mb-4 mx-auto">
                      <span className="font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-center mb-2">
                      Scan QR Code
                    </h4>
                    <p className="text-sm text-whatsapp-darkgray text-center">
                      Use your phone to scan the WhatsApp QR code
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-whatsapp-lightgreen text-whatsapp-darkgreen mb-4 mx-auto">
                      <span className="font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-center mb-2">
                      Authorize Access
                    </h4>
                    <p className="text-sm text-whatsapp-darkgray text-center">
                      Confirm connection on your WhatsApp application
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-whatsapp-lightgreen text-whatsapp-darkgreen mb-4 mx-auto">
                      <span className="font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-center mb-2">
                      Start Using AI
                    </h4>
                    <p className="text-sm text-whatsapp-darkgray text-center">
                      Your AI assistant is now ready to handle conversations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
