"use client";

import React from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import LandingPage from "@/app/components/LandingPage"; // Move your component to another file

export default function Page() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}
