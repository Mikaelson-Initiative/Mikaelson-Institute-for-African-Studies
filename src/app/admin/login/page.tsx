"use client";

import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige p-4 text-ink">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Admin Sign In</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Restricted to Institute staff. Sign in with the Google account on file.
        </p>
        <button
          type="button"
          onClick={() => signIn("google", { redirectTo: "/admin" })}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-black/5 focus:ring-2 focus:ring-teal-deep focus:outline-none"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path d="M21.805 12.23c0-.68-.061-1.333-.174-1.96H12v3.705h5.498a4.702 4.702 0 0 1-2.037 3.083v2.561h3.294c1.928-1.774 3.05-4.39 3.05-7.389Z" fill="#4285F4" />
            <path d="M12 22c2.76 0 5.077-.915 6.769-2.481l-3.294-2.561c-.914.613-2.083.975-3.475.975-2.67 0-4.931-1.803-5.739-4.225H2.855v2.642A9.997 9.997 0 0 0 12 22Z" fill="#34A853" />
            <path d="M6.261 13.708A5.996 5.996 0 0 1 5.94 11.999c0-.593.102-1.17.32-1.709V7.648H2.855a9.994 9.994 0 0 0 0 8.701l3.406-2.641Z" fill="#FBBC05" />
            <path d="M12 6.067c1.5 0 2.847.516 3.91 1.528l2.934-2.934C17.072 3.014 14.755 2 12 2a9.997 9.997 0 0 0-9.145 5.648l3.406 2.642C7.069 7.87 9.33 6.067 12 6.067Z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
