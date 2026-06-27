import type { Metadata } from "next";
import { FormatDiffPage } from "@/components/landing/format-diff-page";
import { formatLandingPages } from "@/lib/formatLandingContent";

const page = formatLandingPages.json;
const canonical = "https://www.diffviewr.com/json-diff/";

export const metadata: Metadata = {
  title: {
    absolute: "JSON Diff Tool | Compare JSON Config Files | DiffViewr"
  },
  description: page.description,
  alternates: {
    canonical
  },
  openGraph: {
    title: "JSON Diff Tool | DiffViewr",
    description: page.description,
    url: canonical,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Diff Tool | DiffViewr",
    description: page.description
  }
};

export default function JsonDiffPage() {
  return <FormatDiffPage page={page} />;
}
