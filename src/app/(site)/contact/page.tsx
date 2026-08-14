import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Mikaelson Institute for African Studies.",
  keywords: ["contact African studies institute", "African studies research inquiries"],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-semibold text-ink">
                We&rsquo;d like to hear from you.
              </h2>
              <p className="mt-3 max-w-sm text-ink-muted">
                Questions about research, partnerships, submissions, or anything else: send a
                message and the Institute will respond directly.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="mailto:institute@mikaelsoninitiative.org"
                  className="flex items-center gap-3 text-sm font-medium text-ink transition-colors hover:text-teal-deep"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep">
                    <Mail aria-hidden="true" className="h-4 w-4" />
                  </span>
                  institute@mikaelsoninitiative.org
                </a>
                <a
                  href="tel:+2348107400687"
                  className="flex items-center gap-3 text-sm font-medium text-ink transition-colors hover:text-teal-deep"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep">
                    <Phone aria-hidden="true" className="h-4 w-4" />
                  </span>
                  +234 8107400687
                </a>
                <div className="flex items-center gap-3 text-sm font-medium text-ink-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep">
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  </span>
                  Ikeja GRA, Lagos, Nigeria
                </div>
                <div className="flex items-center gap-3 pl-12 text-sm font-medium text-ink-muted">
                  Part of the Mikaelson Community Development and Tech Initiative
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
