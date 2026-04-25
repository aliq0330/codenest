import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: {
    default: "CodeNest — Social Code Platform",
    template: "%s | CodeNest",
  },
  description: "Write, share, and discover code. A social platform for developers.",
  keywords: ["code sharing", "developer community", "snippets", "projects", "social coding"],
  authors: [{ name: "CodeNest" }],
  creator: "CodeNest",
  metadataBase: new URL("https://codenest.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codenest.dev",
    siteName: "CodeNest",
    title: "CodeNest — Social Code Platform",
    description: "Write, share, and discover code. A social platform for developers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeNest — Social Code Platform",
    description: "Write, share, and discover code. A social platform for developers.",
    creator: "@codenest",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
