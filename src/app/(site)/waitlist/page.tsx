import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Join the waitlist for the Mikaelson Institute for African Studies Call for Papers.",
};

export default function WaitlistPage() {
  return (
    <div className="bg-beige min-h-screen">
      <div className="relative overflow-hidden bg-teal-deep text-paper">
        <Image
          src="/images/submit/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-teal-deep via-teal-deep/85 to-teal-deep/60"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal>
            <p className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
              Call for Papers
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Join the Waitlist
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/80">
              We are currently preparing our next submission window. Join the waitlist to be notified the moment the Call for Papers officially opens.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Waitlist Form
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Leave your details below and we&rsquo;ll email you when submissions open.
            </p>
            <form className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-ink">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-2 block w-full rounded-md border border-ink/20 bg-transparent px-4 py-3 text-ink placeholder:text-ink/40 focus:border-teal-deep focus:outline-none focus:ring-1 focus:ring-teal-deep"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 block w-full rounded-md border border-ink/20 bg-transparent px-4 py-3 text-ink placeholder:text-ink/40 focus:border-teal-deep focus:outline-none focus:ring-1 focus:ring-teal-deep"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full bg-teal-deep px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-deep/90 focus:outline-none focus:ring-2 focus:ring-teal-deep focus:ring-offset-2 focus:ring-offset-paper"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
