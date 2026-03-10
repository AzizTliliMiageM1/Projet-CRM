"use client";

import { ThemeProvider } from "next-themes";
import React from "react";
import { PageTransition } from "./PageTransition";

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PageTransition variant="fadeSlide">
        {children}
      </PageTransition>
    </ThemeProvider>
  );
}
