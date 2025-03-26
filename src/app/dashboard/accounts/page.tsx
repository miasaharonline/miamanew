import { Button } from "@/components/ui/button";
import { InfoIcon, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function Accounts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-6 bg-whatsapp-gray">
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
            <span>Connect WhatsApp accounts to enable your AI assistant</span>
          </div>

          {/* QR Code Scanner */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-whatsapp-text mb-4">
              Connect WhatsApp Account
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-whatsapp-darkgray mb-4">
                Scan the QR code with your WhatsApp app to connect your account
              </p>
              <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg">
                QR Scanner temporarily disabled
              </div>
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
                <h4 className="font-medium text-center mb-2">Scan QR Code</h4>
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
                <h4 className="font-medium text-center mb-2">Start Using AI</h4>
                <p className="text-sm text-whatsapp-darkgray text-center">
                  Your AI assistant is now ready to handle conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
