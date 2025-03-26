import {
  BarChart3,
  Send,
  Info as InfoIcon,
  Clock,
  Mic,
  MessageSquare,
  Settings,
  Users,
  Calendar,
  UserCircle,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-6 bg-whatsapp-gray">
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
              <p className="text-3xl font-bold text-whatsapp-darkgreen">0</p>
              <p className="text-xs text-whatsapp-darkgray mt-2">
                Last 30 days
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
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

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-green-700 font-medium">
                  Voice Notes Transcribed
                </h3>
                <Mic className="h-5 w-5 text-green-700 opacity-70" />
              </div>
              <p className="text-3xl font-bold text-green-700">0</p>
              <p className="text-xs text-whatsapp-darkgray mt-2">
                Last 30 days
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-700 font-medium">Events Created</h3>
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
                <p className="text-whatsapp-darkgray">No data available yet</p>
                <p className="text-sm text-whatsapp-darkgray mt-1">
                  Connect your WhatsApp account to start collecting statistics
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-whatsapp-text mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-whatsapp-darkgreen" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/accounts"
              className="bg-whatsapp-gray hover:bg-gray-200 p-4 rounded-lg flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-whatsapp-green text-white">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-medium text-whatsapp-text">
                  Manage Accounts
                </h4>
                <p className="text-xs text-whatsapp-darkgray">
                  Connect WhatsApp accounts
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/ai-config"
              className="bg-whatsapp-gray hover:bg-gray-200 p-4 rounded-lg flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-whatsapp-blue text-white">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="font-medium text-whatsapp-text">
                  AI Configuration
                </h4>
                <p className="text-xs text-whatsapp-darkgray">
                  Customize AI behavior
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/chat-baileys"
              className="bg-whatsapp-gray hover:bg-gray-200 p-4 rounded-lg flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-whatsapp-teal text-white">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-medium text-whatsapp-text">Live Chat</h4>
                <p className="text-xs text-whatsapp-darkgray">
                  AI-powered conversations
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/calendar"
              className="bg-whatsapp-gray hover:bg-gray-200 p-4 rounded-lg flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-green-600 text-white">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-medium text-whatsapp-text">Calendar</h4>
                <p className="text-xs text-whatsapp-darkgray">
                  Manage events & appointments
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
