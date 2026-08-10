import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-mono-ledger text-sm tracking-widest text-teal-deep uppercase">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        This page isn&rsquo;t part of the record.
      </h1>
      <p className="mt-4 max-w-md text-ink-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <div className="mt-8">
        <Button href="/">Return Home</Button>
      </div>
    </div>
  );
}
