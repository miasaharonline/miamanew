import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function LiveChat() {
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
            <MessageSquare className="h-6 w-6 text-whatsapp-darkgreen" />
            <h2 className="text-xl font-semibold text-whatsapp-text">
              Live Chat
            </h2>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 rounded-lg">
            <div className="text-center p-8">
              <MessageSquare className="mx-auto h-16 w-16 text-whatsapp-darkgray opacity-20" />
              <h3 className="mt-4 text-lg font-medium text-whatsapp-text">
                Chat functionality temporarily disabled
              </h3>
              <p className="mt-2 text-sm text-whatsapp-darkgray">
                We're working on fixing the WhatsApp integration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
