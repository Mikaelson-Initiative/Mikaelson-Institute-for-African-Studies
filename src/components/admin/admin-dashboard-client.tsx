"use client";

import type { ContactMessage, Submission, CohortApplication } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { FileText, Mail, Users, LogOut, ExternalLink, Check } from "lucide-react";
import { useState } from "react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

type ApplicationWithUser = CohortApplication & { user: { name: string | null; email: string | null } };

type Section = "messages" | "submissions" | "applications";

const SUBMISSION_STATUSES = ["submitted", "in_review", "revisions_requested", "accepted", "rejected", "published"] as const;

export function AdminDashboardClient({
  contactMessages,
  submissions,
  applications,
}: {
  contactMessages: ContactMessage[];
  submissions: Submission[];
  applications: ApplicationWithUser[];
}) {
  const [section, setSection] = useState<Section>("messages");
  const [messages, setMessages] = useState(contactMessages);
  const [subs, setSubs] = useState(submissions);
  const [apps, setApps] = useState(applications);

  const toggleResolved = async (id: string, resolved: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, resolved } : m)));
    await fetch(`/api/admin/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    }).catch(() => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, resolved: !resolved } : m))));
  };

  const changeStatus = async (id: string, status: string) => {
    const previous = subs.find((s) => s.id === id)?.status;
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status: status as Submission["status"] } : s)));
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok && previous) {
      setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status: previous } : s)));
    }
  };

  const toggleReviewed = async (id: string, reviewed: boolean) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, reviewed } : a)));
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed }),
    }).catch(() => setApps((prev) => prev.map((a) => (a.id === id ? { ...a, reviewed: !reviewed } : a))));
  };

  return (
    <div className="min-h-screen bg-beige pb-40">
      <header className="border-b border-ink/10 bg-paper px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="font-display text-xl font-semibold text-ink">Admin Dashboard</h1>
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/" })}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <AnimatePresence mode="wait">
          {section === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Contact Messages <span className="text-ink-muted">({messages.length})</span>
              </h2>
              <div className="space-y-3">
                {messages.length === 0 && <EmptyState label="No contact messages yet." />}
                {messages.map((m) => (
                  <div key={m.id} className={`rounded-xl border p-4 ${m.resolved ? "border-ink/10 bg-paper/60 opacity-60" : "border-ink/10 bg-paper"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-ink">{m.name} <span className="font-normal text-ink-muted">— {m.email}</span></p>
                        <p className="mt-1 text-sm text-ink">{m.message}</p>
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(m.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleResolved(m.id, !m.resolved)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${m.resolved ? "border-teal-deep bg-teal-deep/10 text-teal-deep" : "border-ink/20 text-ink-muted hover:border-teal-deep hover:text-teal-deep"}`}
                      >
                        <Check aria-hidden="true" className="h-3.5 w-3.5" />
                        {m.resolved ? "Resolved" : "Mark resolved"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "submissions" && (
            <motion.div key="submissions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Submissions <span className="text-ink-muted">({subs.length})</span>
              </h2>
              <div className="space-y-3">
                {subs.length === 0 && <EmptyState label="No paper submissions yet." />}
                {subs.map((s) => (
                  <div key={s.id} className="rounded-xl border border-ink/10 bg-paper p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{s.title}</p>
                        <p className="text-sm text-ink-muted">{s.authorName} — {s.authorEmail} · {s.focusArea}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-ink">{s.abstract}</p>
                        <a href={s.fileUrl} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline">
                          {s.fileName} <ExternalLink aria-hidden="true" className="h-3 w-3" />
                        </a>
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(s.createdAt).toLocaleString()}</p>
                      </div>
                      <select
                        value={s.status}
                        onChange={(e) => changeStatus(s.id, e.target.value)}
                        className="shrink-0 rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-teal-deep focus:outline-none"
                      >
                        {SUBMISSION_STATUSES.map((status) => (
                          <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "applications" && (
            <motion.div key="applications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Cohort Applications <span className="text-ink-muted">({apps.length})</span>
              </h2>
              <div className="space-y-3">
                {apps.length === 0 && <EmptyState label="No cohort applications yet." />}
                {apps.map((a) => (
                  <div key={a.id} className={`rounded-xl border p-4 ${a.reviewed ? "border-ink/10 bg-paper/60 opacity-60" : "border-ink/10 bg-paper"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-ink">{a.user.name ?? "Unnamed"} <span className="font-normal text-ink-muted">— {a.user.email}</span></p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          First time: {a.firstTimeStudying} · Goal: {a.primaryGoal}
                        </p>
                        <p className="mt-2 text-sm text-ink"><strong>About:</strong> {a.about}</p>
                        <p className="mt-1 text-sm text-ink"><strong>Motivation:</strong> {a.motivation}</p>
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleReviewed(a.id, !a.reviewed)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${a.reviewed ? "border-teal-deep bg-teal-deep/10 text-teal-deep" : "border-ink/20 text-ink-muted hover:border-teal-deep hover:text-teal-deep"}`}
                      >
                        <Check aria-hidden="true" className="h-3.5 w-3.5" />
                        {a.reviewed ? "Reviewed" : "Mark reviewed"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <Dock>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("messages")} aria-pressed={section === "messages"}>
            <DockLabel>Messages{messages.filter((m) => !m.resolved).length > 0 ? ` (${messages.filter((m) => !m.resolved).length})` : ""}</DockLabel>
            <DockIcon>
              <Mail className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("submissions")} aria-pressed={section === "submissions"}>
            <DockLabel>Submissions ({subs.length})</DockLabel>
            <DockIcon>
              <FileText className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("applications")} aria-pressed={section === "applications"}>
            <DockLabel>Applications{apps.filter((a) => !a.reviewed).length > 0 ? ` (${apps.filter((a) => !a.reviewed).length})` : ""}</DockLabel>
            <DockIcon>
              <Users className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
        </Dock>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-muted">
      {label}
    </div>
  );
}
