import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import MultiAccountChatInterface from "@/components/multi-account-chat-interface";

export default async function Chat() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-whatsapp-gray h-full">
      <div className="h-full">
        {/* Multi-Account Chat Interface with AI support */}
        <MultiAccountChatInterface userId={user.id} aiActive={true} />
      </div>
    </div>
  );
}
