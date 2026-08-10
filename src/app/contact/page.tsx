import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Mikaelson Institute for African Studies.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ContactForm />
      </div>
    </>
  );
}
