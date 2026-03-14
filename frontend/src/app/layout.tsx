import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "../../components/Providers";
import { AuthProvider } from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "UniConfess | College Confessions & Q&A",
  description:
    "Anonymous college confessions, doubts, gossips, and placement discussions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${display.variable} min-h-screen antialiased flex flex-col relative`}
      >
        <div className="fixed inset-0 -z-10 bg-[hsl(var(--background))]">
          <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,rgba(255,69,0,0.06),transparent_55%),radial-gradient(700px_circle_at_80%_0%,rgba(250,204,21,0.04),transparent_50%)]" />
        </div>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className:
                  "dark:bg-[hsl(var(--card))] dark:text-[hsl(var(--foreground))] border border-white/10",
              }}
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
