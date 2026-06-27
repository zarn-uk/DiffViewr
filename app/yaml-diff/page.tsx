import type { Metadata } from "next";
import { FormatDiffPage } from "@/components/landing/format-diff-page";
import { formatLandingPages } from "@/lib/formatLandingContent";

const page = formatLandingPages.yaml;
const canonical = "https://www.diffviewr.com/yaml-diff/";

export const metadata: Metadata = {
  title: {
    absolute: "YAML Diff Tool | Compare YAML Config Files | DiffViewr"
  },
  description: page.description,
  alternates: {
    canonical
  },
  openGraph: {
    title: "YAML Diff Tool | DiffViewr",
    description: page.description,
    url: canonical,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML Diff Tool | DiffViewr",
    description: page.description
  }
};

export default function YamlDiffPage() {
  return <FormatDiffPage page={page} />;
}
