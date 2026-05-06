"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { StreakModal } from "./StreakModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <StreakModal />
    </SessionProvider>
  );
}
