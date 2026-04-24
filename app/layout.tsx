import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import { getServerSession } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ResumeAI",
  description: "AI-powered resume analyzer built with Next.js 14",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthSessionProvider session={session}>
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  border: "0.5px solid var(--border)",
                  borderRadius: "6px",
                  background: "var(--surface)",
                  color: "var(--text1)",
                  boxShadow: "none",
                },
              }}
            />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
