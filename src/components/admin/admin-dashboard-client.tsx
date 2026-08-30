"use client";

import type { ContactMessage, Submission, CohortApplication, TeamMember, Partner, BookRecommendation, GalleryItem, LibraryContribution, TeamApplication, Cohort, Module, Week, ModuleStep } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { FileText, Mail, Users, LogOut, ExternalLink, Check, Book, Handshake, UsersRound, Plus, Pencil, Trash2, Camera, LayoutDashboard, HeartHandshake, UserPlus, AlertCircle, Loader2, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

type ApplicationWithUser = CohortApplication & { user: { name: string | null; email: string | null } };
type WeekWithSteps = Week & { steps: ModuleStep[] };
type ModuleWithWeeks = Module & { weeks: WeekWithSteps[] };
type CohortWithModules = Cohort & { modules: ModuleWithWeeks[] };

type Section = "overview" | "messages" | "submissions" | "applications" | "team" | "partners" | "books" | "gallery" | "library-support" | "team-applications" | "lms";

const SUBMISSION_STATUSES = ["submitted", "in_review", "revisions_requested", "accepted", "rejected", "published"] as const;
const CONTRIBUTION_STATUSES = ["pending", "completed", "failed"] as const;
const APPLICATION_STATUSES = ["pending", "admitted", "rejected", "waitlisted"] as const;

const ROLE_INTEREST_LABELS: Record<string, string> = {
  "research-editorial": "Research & Editorial",
  "design-technology": "Design & Technology",
  "community-outreach": "Community & Outreach",
  "operations-admin": "Operations & Administration",
  other: "Other",
};

export function AdminDashboardClient({
  contactMessages,
  submissions,
  applications,
  teamMembers,
  partners,
  books,
  galleryItems,
  libraryContributions,
  teamApplications,
  cohorts,
}: {
  contactMessages: ContactMessage[];
  submissions: Submission[];
  applications: ApplicationWithUser[];
  teamMembers: TeamMember[];
  partners: Partner[];
  books: BookRecommendation[];
  galleryItems: GalleryItem[];
  libraryContributions: LibraryContribution[];
  teamApplications: TeamApplication[];
  cohorts: CohortWithModules[];
}) {
  const [section, setSection] = useState<Section>("overview");
  const [messages, setMessages] = useState(contactMessages);
  const [subs, setSubs] = useState(submissions);
  const [apps, setApps] = useState(applications);

  const [team, setTeam] = useState(teamMembers);
  const [partnerList, setPartnerList] = useState(partners);
  const [bookList, setBookList] = useState(books);
  const [gallery, setGallery] = useState(galleryItems);
  const [contributions, setContributions] = useState(libraryContributions);
  const [teamApps, setTeamApps] = useState(teamApplications);
  const [cohortTree, setCohortTree] = useState(cohorts);
  const [lmsModuleId, setLmsModuleId] = useState<string>(cohortTree[0]?.modules[0]?.id ?? "");
  const [lmsWeekId, setLmsWeekId] = useState<string>("");
  const [lmsStepId, setLmsStepId] = useState<string>("");
  const [removePdf, setRemovePdf] = useState(false);

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  const [editTeam, setEditTeam] = useState<TeamMember | null>(null);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [editBook, setEditBook] = useState<BookRecommendation | null>(null);
  const [editGalleryItem, setEditGalleryItem] = useState<GalleryItem | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crudError, setCrudError] = useState<string | null>(null);

  // --- Inbox / Forms ---

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

  const changeContributionStatus = async (id: string, status: string) => {
    const previous = contributions.find((c) => c.id === id)?.status;
    setContributions((prev) => prev.map((c) => (c.id === id ? { ...c, status: status as LibraryContribution["status"] } : c)));
    const response = await fetch(`/api/admin/library-contributions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok && previous) {
      setContributions((prev) => prev.map((c) => (c.id === id ? { ...c, status: previous } : c)));
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

  const changeApplicationStatus = async (id: string, status: string) => {
    const previous = apps.find((a) => a.id === id)?.status;
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as CohortApplication["status"] } : a)));
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok && previous) {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: previous } : a)));
    }
  };

  const changeApplicationCohort = async (id: string, cohortId: string) => {
    const previous = apps.find((a) => a.id === id)?.cohortId;
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, cohortId } : a)));
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cohortId }),
    });
    if (!response.ok) {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, cohortId: previous ?? null } : a)));
    }
  };

  const toggleTeamAppReviewed = async (id: string, reviewed: boolean) => {
    setTeamApps((prev) => prev.map((a) => (a.id === id ? { ...a, reviewed } : a)));
    await fetch(`/api/admin/team-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed }),
    }).catch(() => setTeamApps((prev) => prev.map((a) => (a.id === id ? { ...a, reviewed: !reviewed } : a))));
  };

  // --- Team CRUD ---

  const handleTeamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCrudError(null);
    const fd = new FormData(e.currentTarget);
    const isEditing = !!editTeam;
    if (isEditing) fd.append("id", editTeam.id);

    try {
      const res = await fetch("/api/admin/team", { method: isEditing ? "PATCH" : "POST", body: fd });
      if (res.ok) {
        const saved = await res.json();
        setTeam((prev) => isEditing ? prev.map(t => t.id === saved.id ? saved : t) : [...prev, saved]);
        setShowTeamForm(false);
        setEditTeam(null);
      } else {
        const error = await res.json().catch(() => null);
        setCrudError(error?.error || "Couldn't save this team member, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
    if (res.ok) setTeam((prev) => prev.filter(t => t.id !== id));
  };

  // --- Partners CRUD ---

  const handlePartnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCrudError(null);
    const fd = new FormData(e.currentTarget);
    const isEditing = !!editPartner;
    if (isEditing) fd.append("id", editPartner.id);

    try {
      const res = await fetch("/api/admin/partners", { method: isEditing ? "PATCH" : "POST", body: fd });
      if (res.ok) {
        const saved = await res.json();
        setPartnerList((prev) => isEditing ? prev.map(p => p.id === saved.id ? saved : p) : [...prev, saved]);
        setShowPartnerForm(false);
        setEditPartner(null);
      } else {
        const error = await res.json().catch(() => null);
        setCrudError(error?.error || "Couldn't save this partner, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnerDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
    if (res.ok) setPartnerList((prev) => prev.filter(p => p.id !== id));
  };

  // --- Books CRUD ---

  const handleBookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCrudError(null);
    const fd = new FormData(e.currentTarget);
    const isEditing = !!editBook;
    if (isEditing) fd.append("id", editBook.id);

    try {
      const res = await fetch("/api/admin/books", { method: isEditing ? "PATCH" : "POST", body: fd });
      if (res.ok) {
        const saved = await res.json();
        setBookList((prev) => isEditing ? prev.map(b => b.id === saved.id ? saved : b) : [...prev, saved]);
        setShowBookForm(false);
        setEditBook(null);
      } else {
        const error = await res.json().catch(() => null);
        setCrudError(error?.error || "Couldn't save this book, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    const res = await fetch(`/api/admin/books?id=${id}`, { method: "DELETE" });
    if (res.ok) setBookList((prev) => prev.filter(b => b.id !== id));
  };

  // --- Gallery CRUD ---

  const handleGallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCrudError(null);
    const fd = new FormData(e.currentTarget);
    const isEditing = !!editGalleryItem;
    if (isEditing) fd.append("id", editGalleryItem.id);

    try {
      const res = await fetch("/api/admin/gallery", { method: isEditing ? "PATCH" : "POST", body: fd });
      if (res.ok) {
        const saved = await res.json();
        setGallery((prev) => isEditing ? prev.map(g => g.id === saved.id ? saved : g) : [...prev, saved]);
        setShowGalleryForm(false);
        setEditGalleryItem(null);
      } else {
        const error = await res.json().catch(() => null);
        setCrudError(error?.error || "Couldn't save this gallery item, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) setGallery((prev) => prev.filter(g => g.id !== id));
  };

  // --- LMS step intro/PDF ---

  const selectedModule = cohortTree.flatMap((c) => c.modules).find((m) => m.id === lmsModuleId) ?? null;
  const selectedWeek = selectedModule?.weeks.find((w) => w.id === lmsWeekId) ?? null;
  const selectedStep = selectedWeek?.steps.find((s) => s.id === lmsStepId) ?? null;

  const handleModuleStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStep) return;
    setIsSubmitting(true);
    setCrudError(null);
    const fd = new FormData(e.currentTarget);
    if (removePdf) fd.set("removePdf", "true");

    try {
      const res = await fetch(`/api/admin/module-steps/${selectedStep.id}`, { method: "PATCH", body: fd });
      if (res.ok) {
        const saved = await res.json();
        setCohortTree((prev) =>
          prev.map((c) => ({
            ...c,
            modules: c.modules.map((m) => ({
              ...m,
              weeks: m.weeks.map((w) => ({
                ...w,
                steps: w.steps.map((s) => (s.id === saved.id ? saved : s)),
              })),
            })),
          })),
        );
        setRemovePdf(false);
      } else {
        const error = await res.json().catch(() => null);
        setCrudError(error?.error || "Couldn't save this step, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
          
          {section === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Overview</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <MetricCard title="Messages" value={messages.length} subtitle={`${messages.filter(m => !m.resolved).length} unresolved`} icon={<Mail className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("messages")} />
                <MetricCard title="Submissions" value={subs.length} subtitle={`${subs.filter(s => s.status === "submitted").length} pending`} icon={<FileText className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("submissions")} />
                <MetricCard title="Applications" value={apps.length} subtitle={`${apps.filter(a => !a.reviewed).length} unreviewed`} icon={<Users className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("applications")} />
                <MetricCard title="Team Members" value={team.length} icon={<UsersRound className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("team")} />
                <MetricCard title="Partners" value={partnerList.length} icon={<Handshake className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("partners")} />
                <MetricCard title="Library Books" value={bookList.length} icon={<Book className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("books")} />
                <MetricCard title="Art Gallery" value={gallery.length} icon={<Camera className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("gallery")} />
                <MetricCard title="Library Support" value={contributions.length} subtitle={`${contributions.filter(c => c.status === "pending").length} pending`} icon={<HeartHandshake className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("library-support")} />
                <MetricCard title="Team Applications" value={teamApps.length} subtitle={`${teamApps.filter(a => !a.reviewed).length} unreviewed`} icon={<UserPlus className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("team-applications")} />
                <MetricCard title="LMS Content" value={cohortTree.flatMap(c => c.modules).flatMap(m => m.weeks).flatMap(w => w.steps).length} subtitle="steps" icon={<GraduationCap className="h-5 w-5 text-ink-muted group-hover:text-teal-deep transition-colors" />} onClick={() => setSection("lms")} />
              </div>
            </motion.div>
          )}

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
                        <p className="font-semibold text-ink">{m.name} <span className="font-normal text-ink-muted">, {m.email}</span></p>
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
                        <p className="text-sm text-ink-muted">{s.authorName} - {s.authorEmail} · {s.focusArea}</p>
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
                        <p className="font-semibold text-ink">{a.user.name ?? "Unnamed"} <span className="font-normal text-ink-muted">, {a.user.email}</span></p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          First time: {a.firstTimeStudying} · Goal: {a.primaryGoal}
                        </p>
                        {(a.phoneNumber || a.gender || a.nationality || a.stateOfOrigin) && (
                          <p className="mt-1 text-xs text-ink-muted">
                            {a.phoneNumber && <>{a.phoneNumber} · </>}
                            {a.gender && <>{a.gender} · </>}
                            {a.nationality && <>{a.nationality}</>}
                            {a.stateOfOrigin && <>, {a.stateOfOrigin}</>}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-ink"><strong>About:</strong> {a.about}</p>
                        <p className="mt-1 text-sm text-ink"><strong>Motivation:</strong> {a.motivation}</p>
                        {a.additionalInfo && (
                          <p className="mt-1 text-sm text-ink"><strong>Additional info:</strong> {a.additionalInfo}</p>
                        )}
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <select
                          value={a.status}
                          onChange={(e) => changeApplicationStatus(a.id, e.target.value)}
                          className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-teal-deep focus:outline-none"
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <select
                          value={a.cohortId ?? ""}
                          onChange={(e) => changeApplicationCohort(a.id, e.target.value)}
                          className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-teal-deep focus:outline-none"
                        >
                          <option value="">No cohort</option>
                          {cohorts.map((cohort) => (
                            <option key={cohort.id} value={cohort.id}>{cohort.title}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => toggleReviewed(a.id, !a.reviewed)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${a.reviewed ? "border-teal-deep bg-teal-deep/10 text-teal-deep" : "border-ink/20 text-ink-muted hover:border-teal-deep hover:text-teal-deep"}`}
                        >
                          <Check aria-hidden="true" className="h-3.5 w-3.5" />
                          {a.reviewed ? "Reviewed" : "Mark reviewed"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "team" && (
            <motion.div key="team" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Team Roster <span className="text-ink-muted">({team.length})</span>
                </h2>
                <button 
                  onClick={() => { setShowTeamForm(!showTeamForm); setEditTeam(null); setCrudError(null); }} 
                  className="flex items-center gap-1 text-sm font-semibold text-teal-deep hover:underline"
                >
                  <Plus className="h-4 w-4" /> {showTeamForm && !editTeam ? "Cancel" : "Add New"}
                </button>
              </div>

              {showTeamForm && (
                <form onSubmit={handleTeamSubmit} className="mb-6 rounded-xl border border-ink/20 bg-white p-5 space-y-4">
                  {editTeam && <input type="hidden" name="image" value={editTeam.image || ""} />}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Name</label><input required defaultValue={editTeam?.name} name="name" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Role</label><input required defaultValue={editTeam?.role} name="role" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Category</label><select required defaultValue={editTeam?.category} name="category" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none"><option value="Executive Leadership">Executive Leadership</option><option value="Research Fellows">Research Fellows</option><option value="Research Associates">Research Associates</option><option value="Editorial Team">Editorial Team</option><option value="Library & Archives">Library &amp; Archives</option><option value="Advisory Council">Advisory Council</option></select></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Display Index (e.g. 01)</label><input required defaultValue={editTeam?.displayIndex} name="displayIndex" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  </div>
                  <div><label className="text-xs font-semibold uppercase text-ink-muted">Affiliation (Optional)</label><input defaultValue={editTeam?.affiliation || ""} name="affiliation" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-ink-muted">Image Upload (Optional)</label>
                    <input name="file" type="file" accept="image/*" className="mt-1 w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-deep/10 file:text-teal-deep hover:file:bg-teal-deep/20" />
                    {editTeam?.image && <p className="mt-2 text-xs text-ink/50">Current: {editTeam.image.split("/").pop()}</p>}
                  </div>
                  {crudError && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {crudError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowTeamForm(false); setEditTeam(null); setCrudError(null); }} className="rounded px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-black/5">Cancel</button>
                    <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded bg-teal-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving…" : editTeam ? "Update Team Member" : "Save Team Member"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {team.length === 0 && <EmptyState label="No team members yet." />}
                {team.map((member) => (
                  <div key={member.id} className="rounded-xl border border-ink/10 bg-paper p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {member.image && <img src={member.image} alt={member.name || "Team member"} className="w-10 h-10 rounded-full object-cover bg-ink/5" />}
                      <div>
                        <p className="font-semibold text-ink">{member.name} <span className="text-ink-muted font-normal">, {member.role}</span></p>
                        <p className="text-xs text-ink-muted uppercase tracking-wide mt-1">Category: {member.category} | Index: {member.displayIndex}</p>
                        {member.affiliation && <p className="text-sm text-ink/70 mt-1">{member.affiliation}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditTeam(member); setShowTeamForm(true); }} className="rounded-md p-2 text-ink-muted hover:bg-black/5 hover:text-ink transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleTeamDelete(member.id)} className="rounded-md p-2 text-ink-muted hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "partners" && (
            <motion.div key="partners" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Partners <span className="text-ink-muted">({partnerList.length})</span>
                </h2>
                <button 
                  onClick={() => { setShowPartnerForm(!showPartnerForm); setEditPartner(null); setCrudError(null); }} 
                  className="flex items-center gap-1 text-sm font-semibold text-teal-deep hover:underline"
                >
                  <Plus className="h-4 w-4" /> {showPartnerForm && !editPartner ? "Cancel" : "Add New"}
                </button>
              </div>

              {showPartnerForm && (
                <form onSubmit={handlePartnerSubmit} className="mb-6 rounded-xl border border-ink/20 bg-white p-5 space-y-4">
                  {editPartner && <input type="hidden" name="logo" value={editPartner.logo || ""} />}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Name</label><input required defaultValue={editPartner?.name} name="name" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Type</label><input required defaultValue={editPartner?.type || ""} name="type" placeholder="e.g. Funding Partner" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-ink-muted">Logo Upload (Optional)</label>
                    <input name="file" type="file" accept="image/*" className="mt-1 w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-deep/10 file:text-teal-deep hover:file:bg-teal-deep/20" />
                    {editPartner?.logo && <p className="mt-2 text-xs text-ink/50">Current: {editPartner.logo.split("/").pop()}</p>}
                  </div>
                  {crudError && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {crudError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowPartnerForm(false); setEditPartner(null); setCrudError(null); }} className="rounded px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-black/5">Cancel</button>
                    <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded bg-teal-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving…" : editPartner ? "Update Partner" : "Save Partner"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {partnerList.length === 0 && <EmptyState label="No partners yet." />}
                {partnerList.map((partner) => (
                  <div key={partner.id} className="rounded-xl border border-ink/10 bg-paper p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {partner.logo && <img src={partner.logo} alt={partner.name || "Partner logo"} className="w-12 h-12 rounded object-contain bg-white" />}
                      <div>
                        <p className="font-semibold text-ink">{partner.name}</p>
                        {partner.type && <p className="text-sm text-ink-muted mt-1">{partner.type}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditPartner(partner); setShowPartnerForm(true); }} className="rounded-md p-2 text-ink-muted hover:bg-black/5 hover:text-ink transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handlePartnerDelete(partner.id)} className="rounded-md p-2 text-ink-muted hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "books" && (
            <motion.div key="books" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Library Books <span className="text-ink-muted">({bookList.length})</span>
                </h2>
                <button 
                  onClick={() => { setShowBookForm(!showBookForm); setEditBook(null); setCrudError(null); }} 
                  className="flex items-center gap-1 text-sm font-semibold text-teal-deep hover:underline"
                >
                  <Plus className="h-4 w-4" /> {showBookForm && !editBook ? "Cancel" : "Add New"}
                </button>
              </div>

              {showBookForm && (
                <form onSubmit={handleBookSubmit} className="mb-6 rounded-xl border border-ink/20 bg-white p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Title</label><input required defaultValue={editBook?.title} name="title" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Category</label><select required defaultValue={(editBook as any)?.category || "Book"} name="category" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none"><option value="Book">Book</option><option value="Archive">Archive</option></select></div>
                    <div><label className="text-xs font-semibold uppercase text-ink-muted">Genre</label><input required defaultValue={editBook?.genre} name="genre" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  </div>
                  <div><label className="text-xs font-semibold uppercase text-ink-muted">Open Library Image URL</label><input required defaultValue={editBook?.imgUrl} name="imgUrl" type="url" placeholder="https://covers.openlibrary.org/b/isbn/..." className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  <div><label className="text-xs font-semibold uppercase text-ink-muted">Source Link URL</label><input required defaultValue={editBook?.linkUrl} name="linkUrl" type="url" placeholder="https://openlibrary.org/..." className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  {crudError && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {crudError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowBookForm(false); setEditBook(null); setCrudError(null); }} className="rounded px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-black/5">Cancel</button>
                    <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded bg-teal-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving…" : editBook ? "Update Book" : "Save Book"}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {bookList.length === 0 && <EmptyState label="No books yet." />}
                
                {["Book", "Archive"].map((cat) => {
                  const filtered = bookList.filter(b => (b as any).category === cat || (!("category" in b) && cat === "Book"));
                  if (filtered.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-ink-muted">{cat}s</h3>
                      <div className="space-y-3">
                        {filtered.map((book) => (
                          <div key={book.id} className="rounded-xl border border-ink/10 bg-paper p-4 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {book.imgUrl && (
                                <img src={book.imgUrl} alt={book.title} className="w-12 h-16 object-cover rounded bg-ink/10" />
                              )}
                              <div>
                                <p className="font-semibold text-ink">{book.title}</p>
                                <p className="text-xs text-ink-muted uppercase tracking-wide mt-1">Genre: {book.genre}</p>
                                <a href={book.linkUrl} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline">
                                  View Source <ExternalLink aria-hidden="true" className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditBook(book); setShowBookForm(true); }} className="rounded-md p-2 text-ink-muted hover:bg-black/5 hover:text-ink transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => handleBookDelete(book.id)} className="rounded-md p-2 text-ink-muted hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {section === "gallery" && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Art Gallery <span className="text-ink-muted">({gallery.length})</span>
                </h2>
                <button 
                  onClick={() => { setShowGalleryForm(!showGalleryForm); setEditGalleryItem(null); setCrudError(null); }} 
                  className="flex items-center gap-1 text-sm font-semibold text-teal-deep hover:underline"
                >
                  <Plus className="h-4 w-4" /> {showGalleryForm && !editGalleryItem ? "Cancel" : "Add New"}
                </button>
              </div>

              {showGalleryForm && (
                <form onSubmit={handleGallerySubmit} className="mb-6 rounded-xl border border-ink/20 bg-white p-5 space-y-4">
                  {editGalleryItem && <input type="hidden" name="imageUrl" value={editGalleryItem.imageUrl || ""} />}
                  <div><label className="text-xs font-semibold uppercase text-ink-muted">Title</label><input required defaultValue={editGalleryItem?.title} name="title" type="text" className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  <div><label className="text-xs font-semibold uppercase text-ink-muted">Description (Optional)</label><textarea defaultValue={editGalleryItem?.description || ""} name="description" rows={3} className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none" /></div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-ink-muted">Art Upload {editGalleryItem ? "(Optional)" : ""}</label>
                    <input required={!editGalleryItem} name="file" type="file" accept="image/*" className="mt-1 w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-deep/10 file:text-teal-deep hover:file:bg-teal-deep/20" />
                    {editGalleryItem?.imageUrl && <p className="mt-2 text-xs text-ink/50">Current: {editGalleryItem.imageUrl.split("/").pop()}</p>}
                  </div>
                  {crudError && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {crudError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowGalleryForm(false); setEditGalleryItem(null); setCrudError(null); }} className="rounded px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-black/5">Cancel</button>
                    <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded bg-teal-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving…" : editGalleryItem ? "Update Artwork" : "Save Artwork"}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.length === 0 && <div className="col-span-full"><EmptyState label="No art in gallery yet." /></div>}
                {gallery.map((item) => (
                  <div key={item.id} className="group relative rounded-xl border border-ink/10 bg-paper overflow-hidden">
                    <div className="aspect-square w-full bg-ink/5 relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-semibold text-white text-sm truncate">{item.title}</p>
                          {item.description && <p className="text-xs text-white/80 line-clamp-2 mt-0.5">{item.description}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditGalleryItem(item); setShowGalleryForm(true); }} className="rounded-full bg-white/90 p-1.5 text-ink hover:text-teal-deep shadow-sm transition-colors" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleGalleryDelete(item.id)} className="rounded-full bg-white/90 p-1.5 text-ink hover:text-red-500 shadow-sm transition-colors" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "lms" && (
            <motion.div key="lms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">LMS Content</h2>
              <p className="mb-4 text-sm text-ink-muted">
                Pick a step to edit its intro text or attach/replace/remove its inline PDF material.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-ink-muted">Module</label>
                  <select
                    value={lmsModuleId}
                    onChange={(e) => { setLmsModuleId(e.target.value); setLmsWeekId(""); setLmsStepId(""); setCrudError(null); }}
                    className="mt-1 w-full rounded border border-ink/10 bg-white px-3 py-2 text-sm focus:border-teal-deep focus:outline-none"
                  >
                    <option value="">Select a module</option>
                    {cohortTree.flatMap((c) => c.modules).map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-ink-muted">Week</label>
                  <select
                    value={lmsWeekId}
                    onChange={(e) => { setLmsWeekId(e.target.value); setLmsStepId(""); setCrudError(null); }}
                    disabled={!selectedModule}
                    className="mt-1 w-full rounded border border-ink/10 bg-white px-3 py-2 text-sm focus:border-teal-deep focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Select a week</option>
                    {selectedModule?.weeks.map((w) => (
                      <option key={w.id} value={w.id}>{w.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-ink-muted">Step</label>
                  <select
                    value={lmsStepId}
                    onChange={(e) => { setLmsStepId(e.target.value); setRemovePdf(false); setCrudError(null); }}
                    disabled={!selectedWeek}
                    className="mt-1 w-full rounded border border-ink/10 bg-white px-3 py-2 text-sm focus:border-teal-deep focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Select a step</option>
                    {selectedWeek?.steps.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} ({s.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedStep && (
                <form key={selectedStep.id} onSubmit={handleModuleStepSubmit} className="mt-6 rounded-xl border border-ink/20 bg-white p-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-ink-muted">Intro (shown above the PDF, always kept)</label>
                    <textarea
                      defaultValue={selectedStep.introMarkdown || ""}
                      name="introMarkdown"
                      rows={3}
                      className="mt-1 w-full rounded border border-ink/10 px-3 py-2 text-sm focus:border-teal-deep focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-ink-muted">PDF Material</label>
                    {selectedStep.pdfUrl ? (
                      <p className="mt-1 flex items-center gap-2 text-sm text-ink">
                        <FileText aria-hidden="true" className="h-4 w-4 text-ink-muted" />
                        {selectedStep.pdfName || "Current PDF"}
                        <a href={selectedStep.pdfUrl} target="_blank" rel="noreferrer" className="text-teal-deep hover:underline">View</a>
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-ink-muted">No PDF attached.</p>
                    )}
                    <input
                      name="file"
                      type="file"
                      accept="application/pdf"
                      disabled={removePdf}
                      className="mt-2 w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-deep/10 file:text-teal-deep hover:file:bg-teal-deep/20 disabled:opacity-50"
                    />
                    {selectedStep.pdfUrl && (
                      <label className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                        <input type="checkbox" checked={removePdf} onChange={(e) => setRemovePdf(e.target.checked)} />
                        Remove the current PDF
                      </label>
                    )}
                  </div>

                  {crudError && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {crudError}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded bg-teal-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                      {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Saving…" : "Save Step"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {section === "library-support" && (
            <motion.div key="library-support" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Library Support <span className="text-ink-muted">({contributions.length})</span>
              </h2>
              <p className="mb-4 text-sm text-ink-muted">
                Pledges land here as &ldquo;pending.&rdquo; Mark a pledge &ldquo;completed&rdquo; once payment is confirmed, only completed pledges count toward the public progress tracker and leaderboard.
              </p>
              <div className="space-y-3">
                {contributions.length === 0 && <EmptyState label="No library contributions yet." />}
                {contributions.map((c) => (
                  <div key={c.id} className="rounded-xl border border-ink/10 bg-paper p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{c.name} <span className="font-normal text-ink-muted">, {c.email}</span></p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          ₦{c.amount.toLocaleString()}{c.tier ? ` · ${c.tier}` : ""}
                        </p>
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(c.createdAt).toLocaleString()}</p>
                      </div>
                      <select
                        value={c.status}
                        onChange={(e) => changeContributionStatus(c.id, e.target.value)}
                        className="shrink-0 rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-teal-deep focus:outline-none"
                      >
                        {CONTRIBUTION_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "team-applications" && (
            <motion.div key="team-applications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Team Applications <span className="text-ink-muted">({teamApps.length})</span>
              </h2>
              <div className="space-y-3">
                {teamApps.length === 0 && <EmptyState label="No team applications yet." />}
                {teamApps.map((a) => (
                  <div key={a.id} className={`rounded-xl border p-4 ${a.reviewed ? "border-ink/10 bg-paper/60 opacity-60" : "border-ink/10 bg-paper"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{a.name} <span className="font-normal text-ink-muted">, {a.email}</span></p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          {a.phoneNumber} · {a.location} · {a.roleInterest === "other" && a.customRole ? a.customRole : ROLE_INTEREST_LABELS[a.roleInterest] ?? a.roleInterest}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          {a.availability} · {a.hoursPerWeek} hrs/week · {a.volunteeredBefore ? "Volunteered before" : "First-time volunteer"}
                        </p>
                        <p className="mt-2 text-sm text-ink"><strong>Experience:</strong> {a.experience}</p>
                        <p className="mt-1 text-sm text-ink"><strong>Motivation:</strong> {a.motivation}</p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          <a href={a.linkedinUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline">
                            LinkedIn <ExternalLink aria-hidden="true" className="h-3 w-3" />
                          </a>
                          <a href={a.cvUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline">
                            {a.cvFileName} <ExternalLink aria-hidden="true" className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="mt-2 font-mono-ledger text-xs text-ink/40">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTeamAppReviewed(a.id, !a.reviewed)}
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
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("overview")} aria-pressed={section === "overview"}>
            <DockLabel>Overview</DockLabel>
            <DockIcon>
              <LayoutDashboard className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
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
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("team")} aria-pressed={section === "team"}>
            <DockLabel>Team ({team.length})</DockLabel>
            <DockIcon>
              <UsersRound className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("partners")} aria-pressed={section === "partners"}>
            <DockLabel>Partners ({partnerList.length})</DockLabel>
            <DockIcon>
              <Handshake className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("books")} aria-pressed={section === "books"}>
            <DockLabel>Library ({bookList.length})</DockLabel>
            <DockIcon>
              <Book className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("gallery")} aria-pressed={section === "gallery"}>
            <DockLabel>Gallery ({gallery.length})</DockLabel>
            <DockIcon>
              <Camera className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("library-support")} aria-pressed={section === "library-support"}>
            <DockLabel>Library Support{contributions.filter((c) => c.status === "pending").length > 0 ? ` (${contributions.filter((c) => c.status === "pending").length})` : ""}</DockLabel>
            <DockIcon>
              <HeartHandshake className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("team-applications")} aria-pressed={section === "team-applications"}>
            <DockLabel>Team Applications{teamApps.filter((a) => !a.reviewed).length > 0 ? ` (${teamApps.filter((a) => !a.reviewed).length})` : ""}</DockLabel>
            <DockIcon>
              <UserPlus className="h-full w-full text-ink-muted" />
            </DockIcon>
          </DockItem>
          <DockItem className="aspect-square rounded-full bg-white" onClick={() => setSection("lms")} aria-pressed={section === "lms"}>
            <DockLabel>LMS Content</DockLabel>
            <DockIcon>
              <GraduationCap className="h-full w-full text-ink-muted" />
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

function MetricCard({ title, value, subtitle, icon, onClick }: { title: string; value: number; subtitle?: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group cursor-pointer rounded-xl border border-ink/10 bg-paper p-5 transition-all hover:border-teal-deep/30 hover:bg-white hover:shadow-sm">
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-display font-semibold text-ink">{value}</p>
        <p className="text-sm font-medium text-ink-muted">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-ink/50">{subtitle}</p>}
      </div>
    </div>
  );
}
