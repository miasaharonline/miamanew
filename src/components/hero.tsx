import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  MessageSquare,
  Mic,
  Calendar,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-whatsapp-lightgreen via-white to-whatsapp-sent opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <img
                src="/logo.svg"
                alt="WhatsApp AI Logo"
                className="h-24 w-24"
              />
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-darkgreen to-whatsapp-green">
                Autonomous
              </span>{" "}
              WhatsApp Assistant
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Deploy intelligent AI chatbots powered by GPT models that handle
              conversations, transcribe voice notes, and manage your
              calendar—all through WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-whatsapp-darkgreen rounded-lg hover:bg-whatsapp-green transition-colors text-lg font-medium"
              >
                Launch Dashboard
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-whatsapp-darkgreen" />
                <span>Smart Conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-whatsapp-darkgreen" />
                <span>Voice Transcription</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-whatsapp-darkgreen" />
                <span>Calendar Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
