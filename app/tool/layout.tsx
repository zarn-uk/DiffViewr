import type { Metadata } from "next";

const toolDescription =
  "Paste your template config as A and your environment config as B. DiffViewr shows only what actually changed, ignoring key-order noise.";

export const metadata: Metadata = {
  title: {
    absolute: "Config File Diff Tool | DiffViewr"
  },
  description: toolDescription,
  alternates: {
    canonical: "/tool/"
  },
  openGraph: {
    title: "Config File Diff Tool | DiffViewr",
    description: toolDescription,
    url: "/tool/",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Config File Diff Tool | DiffViewr",
    description: toolDescription
  },
  robots: {
    index: false,
    follow: true
  }
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
