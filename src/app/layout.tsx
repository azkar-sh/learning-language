import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your AI Playground | Learning Quiz & Interactive Storyteller",
  description:
    "A full-stack Next.js application for generating learning quizzes and interactive stories with real-time validation, animations, and multilingual support.",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Learning Quiz",
    "AI Storyteller",
    "Interactive Learning",
    "Multiple-choice Quiz",
    "Real-time Scoring",
    "Multilingual Quiz",
  ],
  authors: [
    {
      name: "Aziz Ashshiddiq",
      url: "https://www.linkedin.com/in/aziz-ashshiddiq/",
    },
  ],
  openGraph: {
    title: "Learning Quiz & Interactive Storyteller",
    description:
      "Create dynamic quizzes and interactive stories with real-time validation, AI-powered content, and stunning UI/UX.",
    url: "https://ai-playground-three.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Quiz & Interactive Storyteller",
    description:
      "An interactive learning platform with AI-powered quiz generation and storytelling.",
    site: "@AshDizir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
