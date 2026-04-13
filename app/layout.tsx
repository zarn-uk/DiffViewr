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
    "Reorder JSON arrays/objects at a path based on a reference JSON (diff-friendly ordering).",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=localStorage.getItem('theme');p=(p==='light'||p==='dark'||p==='system')?p:'dark';var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');var r=(p==='system')?(m&&m.matches?'dark':'light'):p;var d=document.documentElement;d.setAttribute('data-theme',r);d.setAttribute('data-theme-pref',p);d.style.colorScheme=r;if(p==='system'&&m){var f=function(){var rr=m.matches?'dark':'light';d.setAttribute('data-theme',rr);d.style.colorScheme=rr;};if(m.addEventListener)m.addEventListener('change',f);else if(m.addListener)m.addListener(f);}}catch(e){}})();"
          }}
        />
      </head>
      <body className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
        <SiteHeader />
        <div className="mx-auto w-full max-w-6xl px-6">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
