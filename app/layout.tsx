import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import VideoEditorProvider from "@/contexts/videoContext";
import ToastProvider from "@/contexts/toastContext";
import Toast from "@/components/Toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Video Highlight Editor",
  description: "Video Highlight Editor",
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
        <ToastProvider>
          <VideoEditorProvider>{children}</VideoEditorProvider>
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
