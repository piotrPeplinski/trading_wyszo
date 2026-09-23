"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu użytkownika"
        className="shrink-0 rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-green/40"
      >
        {user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Discord CDN, not worth a remotePatterns entry
          <img
            src={user.avatar_url}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#191e2b] text-sm font-semibold text-[#f4f6fb]">
            {user?.username?.[0]?.toUpperCase()}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>{user?.username}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Wyloguj</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
