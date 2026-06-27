import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Geist,
  JetBrains_Mono
} from "next/font/google";
import "./generated.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "./analytics";

const sansFont = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--geist-sans"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--jetbrains-mono"
});

const siteUrl = "https://www.diffviewr.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DiffViewr | Config File Diff Tool for Developers",
    template: "%s | DiffViewr"
  },
  description:
    "Compare JSON, YAML, and .env config files in your browser. Align Target B to Template A and review real changes without key-order noise.",
  applicationName: "DiffViewr",
  authors: [{ name: "DiffViewr" }],
  creator: "DiffViewr",
  publisher: "DiffViewr",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "DiffViewr | Config File Diff Tool for Developers",
    description:
      "Compare JSON, YAML, and .env config files in your browser. Align Target B to Template A and review real changes without key-order noise.",
    url: "/",
    siteName: "DiffViewr",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hero-technical-bg-1823.jpg",
        width: 1823,
        height: 863,
        alt: "DiffViewr config comparison preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DiffViewr | Config File Diff Tool for Developers",
    description:
      "Compare JSON, YAML, and .env config files in your browser. Align Target B to Template A and review real changes without key-order noise.",
    images: ["/hero-technical-bg-1823.jpg"]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.svg", type: "image/svg+xml", sizes: "32x32" },
      { url: "/favicon-16.svg", type: "image/svg+xml", sizes: "16x16" }
    ]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable}`}
      data-theme="dark"
      data-theme-pref="dark"
      data-scroll-behavior="smooth"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;d.setAttribute('data-theme','dark');d.setAttribute('data-theme-pref','dark');d.style.colorScheme='dark';}catch(e){}})();"
          }}
        />
      </head>
      <body
        className="flex min-h-screen w-full flex-col bg-[var(--bg)] text-[var(--text)]"
        suppressHydrationWarning
      >
        <SiteHeader />
        <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-[var(--bg)]">
          <div className="relative z-10 mx-auto flex w-full flex-1 flex-col px-4 sm:px-6 lg:px-10">
            {children}
            <SiteFooter />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
