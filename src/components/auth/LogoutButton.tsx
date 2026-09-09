"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-[16px] font-medium text-[#6B7280] transition hover:text-[#111928] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
