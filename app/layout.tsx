import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth";
import Analytics from "@/components/Analytics";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ReactScan } from "@/components/react-scan";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appily - Build and publish apps with AI",
  description:
    "A revolutionary no-code platform to create fully functional web applications through natural language prompts.",
  metadataBase: new URL("https://appily.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://appily.dev",
    title: "Appily - Build and publish apps with AI",
    description:
      "What do you want to build today? Prompt, run, edit, and publish your app on the Appily Store.",
    siteName: "Appily",
    images: [
      {
        url: "/api/og?title=What%20do%20you%20want%20to%20build%20today%3F&subtitle=Prompt%2C%20run%2C%20edit%2C%20and%20publish%20your%20app%20on%20the%20Appily%20Store.",
        width: 1200,
        height: 630,
        alt: "Appily - What do you want to build today?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Appily - Build and publish apps with AI",
    description:
      "What do you want to build today? Prompt, run, edit, and publish your app on the Appily Store.",
    creator: "@appily",
    images: [
      "/api/og?title=What%20do%20you%20want%20to%20build%20today%3F&subtitle=Prompt%2C%20run%2C%20edit%2C%20and%20publish%20your%20app%20on%20the%20Appily%20Store.",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-icon" />
        </head>
        <ReactScan />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Analytics />
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
