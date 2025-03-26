import { Button } from "@/components/ui/button";
import { InfoIcon, History, Search, Download, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function ChatHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-whatsapp-gray">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <History className="h-5 w-5 sm:h-6 sm:w-6 text-whatsapp-darkgreen" />
            <h2 className="text-lg sm:text-xl font-semibold text-whatsapp-text">
              Conversation History
            </h2>
          </div>

          <div className="bg-whatsapp-lightgreen text-xs sm:text-sm p-2 sm:p-3 px-3 sm:px-4 rounded-lg text-whatsapp-darkgreen flex gap-2 items-center mb-4 sm:mb-6">
            <InfoIcon size={12} className="sm:hidden" />
            <InfoIcon size={14} className="hidden sm:block" />
            <span>
              View and search through past conversations handled by your AI
              assistant
            </span>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-whatsapp-darkgray" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3"
              >
                <Filter size={14} className="sm:hidden" />
                <Filter size={16} className="hidden sm:block" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3"
              >
                <Download size={14} className="sm:hidden" />
                <Download size={16} className="hidden sm:block" />
                Export
              </Button>
            </div>
          </div>

          {/* No history state */}
          <div className="text-center py-8 sm:py-12 md:py-16 border-2 border-dashed border-gray-200 rounded-lg">
            <History className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-whatsapp-darkgray opacity-30" />
            <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-whatsapp-text">
              No conversation history yet
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-whatsapp-darkgray px-4">
              Connect a WhatsApp account and start conversations to see history
            </p>
            <Button className="mt-4 sm:mt-6 bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white mx-auto text-xs sm:text-sm py-1 sm:py-2">
              Go to Accounts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
