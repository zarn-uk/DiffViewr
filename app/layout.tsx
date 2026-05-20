import type { ReactNode } from "react";
import { Space_Grotesk, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata = {
  title: "DiffViewr",
  description:
    "Align config key order in B to match A (diff-friendly ordering).",
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
      className={`${displayFont.variable} ${monoFont.variable}`}
      data-theme="dark"
      data-theme-pref="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;d.setAttribute('data-theme','dark');d.setAttribute('data-theme-pref','dark');d.style.colorScheme='dark';}}catch(e){}})();"
          }}
        />
      </head>
      <body className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
        <SiteHeader />
        <div className="relative isolate overflow-hidden dark-circuit-wrapper">
          <div className="relative z-10 mx-auto w-full px-10">
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
