// components/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TooltipProvider } from "./ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </NextUIProvider>
  );
}
