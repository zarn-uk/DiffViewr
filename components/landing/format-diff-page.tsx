import Link from "next/link";
import {
  formatLandingOrder,
  formatLandingPages,
  type FormatLandingContent
} from "@/lib/formatLandingContent";

type FormatDiffPageProps = {
  page: FormatLandingContent;
};

export function FormatDiffPage({ page }: FormatDiffPageProps) {
  const relatedPages = formatLandingOrder
    .map((key) => formatLandingPages[key])
    .filter((item) => item.key !== page.key);
  const previewLines = page.referenceSample.trim().split(/\r?\n/).slice(0, 12);

  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${page.title} by DiffViewr`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: `https://www.diffviewr.com${page.route}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      `${page.formatLabel} configuration comparison`,
      "Template A to Target B key-order alignment",
      "Duplicate key validation",
      "Client-side processing"
    ]
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd)
        }}
      />

      <section className="hero-glow relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-10">
        <picture className="hero-art-bg absolute inset-0">
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet="/hero-technical-bg-960.avif"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet="/hero-technical-bg-960.webp"
          />
          <source type="image/avif" srcSet="/hero-technical-bg-1823.avif" />
          <source type="image/webp" srcSet="/hero-technical-bg-1823.webp" />
          <img
            src="/hero-technical-bg-1823.jpg"
            alt=""
            width={1823}
            height={863}
            decoding="async"
          />
        </picture>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 items-center gap-6 px-4 pb-8 pt-6 sm:gap-10 sm:px-6 sm:pb-12 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-10 lg:pt-16">
          <div className="flex min-w-0 max-w-[520px] flex-col gap-4 sm:gap-5">
            <div className="inline-flex max-w-full items-center gap-2 self-start rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 font-mono text-[10px] leading-4 text-cyan-400 min-[390px]:text-[11px] sm:text-[12px]">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-cyan-400" />
              <span className="truncate">{page.eyebrow} for config reviews</span>
            </div>

            <h1 className="font-sans text-[clamp(2.1rem,10.5vw,3.65rem)] font-normal leading-[1.02] tracking-tight text-[var(--text)] lg:leading-none">
              {page.title}
              <br />
              <em className="not-italic text-cyan-400">without reorder noise.</em>
            </h1>

            <div className="max-w-[460px] space-y-3 font-sans text-[15px] leading-relaxed text-[var(--muted)] sm:text-[17px]">
            {page.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            </div>

            <div className="flex flex-col items-stretch gap-3 min-[390px]:flex-row min-[390px]:items-center">
              <Link
                href={`/tool/?sample=${page.key}`}
                className="cyberpunk-button cta inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-sans text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:translate-y-px min-[390px]:w-auto"
              >
                {page.sampleCtaLabel}
                <i className="ti ti-arrow-right text-[15px]" aria-hidden="true" />
              </Link>
              <Link
                href="/tool/"
                className="cyberpunk-button inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 py-3 font-sans text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:translate-y-px min-[390px]:w-auto"
              >
                Open Tool
              </Link>
            </div>

            <p className="hidden items-center gap-2 font-mono text-[13px] text-[var(--muted)] sm:flex">
              <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 opacity-50" />
              Client-side compare. No upload. Duplicate keys blocked before review.
            </p>
          </div>

          <div className="hero-preview-stage mx-auto w-full min-w-0 max-w-[560px] lg:mx-0">
            <div className="hero-preview-backplate" aria-hidden="true" />
            <div className="hero-preview-float relative z-10 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] bg-[color-mix(in_srgb,var(--panel)_88%,transparent)] shadow-[0_20px_55px_rgba(0,8,13,0.36)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 font-mono">
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-cyan-400">
                    {page.referenceLabel}
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-[var(--text)]">
                    Template A
                  </span>
                </div>
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] text-cyan-300">
                  {page.formatLabel}
                </span>
              </div>

              <div className="grid min-h-[280px] grid-cols-[3rem_1fr] bg-[color-mix(in_srgb,var(--bg)_52%,transparent)] font-mono text-[12px] leading-6 sm:min-h-[340px] sm:text-[13px]">
                <div className="border-r border-[var(--border)] px-2 py-4 text-right text-[var(--muted)] opacity-70">
                  {previewLines.map((line, index) => (
                    <div key={`${line}-${index}`}>{index + 1}</div>
                  ))}
                </div>
                <pre className="overflow-hidden px-4 py-4 text-[var(--text)]">
                  <code>
                    {previewLines.map((line, index) => (
                      <span key={`${line}-${index}`} className="block whitespace-pre">
                        {line || " "}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>

              <div className="grid gap-0 border-t border-[var(--border)] sm:grid-cols-3">
                {page.benefits.map((benefit) => (
                  <div
                    key={benefit.label}
                    className="border-b border-[var(--border)] px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400">
                      {benefit.label}
                    </div>
                    <p className="mt-1 font-sans text-[12px] leading-5 text-[var(--muted)]">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-8 border-t border-[var(--border)] pt-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[1.8px] text-cyan-400">
              FAQ
            </p>
            <h2 className="mt-3 font-sans text-[2rem] font-normal leading-tight tracking-tight text-[var(--text)]">
              {page.formatLabel} comparison details
            </h2>
          </div>
          <div className="grid gap-3">
            {page.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_68%,transparent)] p-4"
              >
                <summary className="cursor-pointer list-none font-sans text-[15px] font-medium text-[var(--text)]">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <i className="ti ti-chevron-down shrink-0 text-[16px] text-cyan-400 transition group-open:rotate-180" aria-hidden="true" />
                  </span>
                </summary>
                <p className="mt-3 font-sans text-[14px] leading-6 text-[var(--muted)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
        <div className="border-t border-[var(--border)] pt-8">
          <p className="font-mono text-[12px] uppercase tracking-[1.8px] text-cyan-400">
            Compare another format
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedPages.map((related) => (
              <Link
                key={related.route}
                href={related.route}
                className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_68%,transparent)] p-4 transition hover:border-cyan-400/45"
              >
                <span className="font-sans text-[17px] text-[var(--text)]">{related.title}</span>
                <span className="mt-2 block font-sans text-[14px] leading-6 text-[var(--muted)]">
                  {related.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
