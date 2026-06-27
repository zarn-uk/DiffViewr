import type { Metadata } from "next";
import { FormatDiffPage } from "@/components/landing/format-diff-page";
import { formatLandingPages } from "@/lib/formatLandingContent";

const page = formatLandingPages.env;
const canonical = "https://www.diffviewr.com/env-diff/";

export const metadata: Metadata = {
  title: {
    absolute: ".env Diff Tool | Compare Dotenv Files | DiffViewr"
  },
  description: page.description,
  alternates: {
    canonical
  },
  openGraph: {
    title: ".env Diff Tool | DiffViewr",
    description: page.description,
    url: canonical,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: ".env Diff Tool | DiffViewr",
    description: page.description
  }
};

export default function EnvDiffPage() {
  return <FormatDiffPage page={page} />;
}
