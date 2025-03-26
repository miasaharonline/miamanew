"use client";
import { UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-whatsapp-green"
        >
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white border border-gray-200"
      >
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            router.refresh();
          }}
          className="hover:bg-whatsapp-gray"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
