import { Calendar as CalendarIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import CalendarComponent from "@/components/calendar/calendar";

export default async function CalendarPage() {
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
            <CalendarIcon className="h-6 w-6 text-whatsapp-darkgreen" />
            <h2 className="text-xl font-semibold text-whatsapp-text">
              Calendar
            </h2>
          </div>
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
}
