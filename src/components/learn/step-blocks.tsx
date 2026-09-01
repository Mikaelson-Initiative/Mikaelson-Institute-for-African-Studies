"use client";

import { Fragment, useActionState, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, Copy, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markdownComponents } from "@/components/learn/markdown-components";
import { submitPoll, submitReflection } from "@/app/ubuntu/(protected)/modules/[id]/actions";
import type {
  ActionCardBlock,
  BannerBlock,
  CalloutBlock,
  ComparisonBlock,
  FaqBlock,
  ImageBlock,
  LinksBlock,
  MapBlock,
  ManifestoBlock,
  PillarAccent,
  PillarItem,
  PollAnswers,
  PollBlock,
  QuoteEcho,
  ReflectionAnswers,
  RoadmapBlock,
  StepBlock,
  TableBlock,
  TemplateBlock,
} from "@/lib/step-blocks";

const PILLAR_ACCENT_CLASSES: Record<PillarAccent, string> = {
  teal: "bg-teal-deep",
  turquoise: "bg-turquoise",
  yellow: "bg-yellow",
};
const PILLAR_ACCENT_CYCLE: PillarAccent[] = ["teal", "turquoise", "yellow"];

// A quiet geometric rhythm between blocks — deliberately abstract (not a
// specific cultural symbol), just enough to keep the page from reading like
// a plain document as it moves from one block to the next.
function SectionDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3">
      <span className="h-px w-12 bg-ink/10" />
      <span className="text-sm tracking-[0.3em] text-turquoise/70">◆ ◆ ◆</span>
      <span className="h-px w-12 bg-ink/10" />
    </div>
  );
}

function ProseBlockView({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-ink">
      <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
    </div>
  );
}

// A full-bleed hero blockquote, styled like an illuminated manuscript page
// rather than an inline markdown quote — the reader's centerpiece. `echoes`
// (the same idea in other African languages) reinforces that this is a
// continent-wide idea, not one culture's isolated saying.
function QuoteBlockView({
  quote,
  translation,
  attribution,
  echoes,
}: {
  quote: string;
  translation?: string;
  attribution?: string;
  echoes?: QuoteEcho[];
}) {
  return (
    <div className="step-quote-pattern relative overflow-hidden rounded-2xl bg-teal-deep px-8 py-12 text-center sm:px-12 sm:py-16">
      <blockquote className="relative z-10 font-display text-3xl leading-tight text-paper sm:text-4xl">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {translation && (
        <p className="relative z-10 mt-4 text-sm font-medium uppercase tracking-wide text-turquoise sm:text-base">
          {translation}
        </p>
      )}
      {attribution && <p className="relative z-10 mt-2 text-xs uppercase tracking-widest text-paper/60">{attribution}</p>}

      {echoes && echoes.length > 0 && (
        <div className="relative z-10 mx-auto mt-8 max-w-xl border-t border-paper/15 pt-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-turquoise/80">
            Echoed Across the Continent
          </p>
          <ul className="mt-4 space-y-2">
            {echoes.map((echo) => (
              <li
                key={echo.language}
                className="flex flex-col items-center gap-0.5 text-sm text-paper/90 sm:flex-row sm:justify-between"
              >
                <span className="italic">&ldquo;{echo.text}&rdquo;</span>
                <span className="shrink-0 text-xs uppercase tracking-wide text-turquoise/70">{echo.language}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PillarCard({ item, index }: { item: PillarItem; index: number }) {
  const accent = item.accent ?? PILLAR_ACCENT_CYCLE[index % PILLAR_ACCENT_CYCLE.length];

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-beige-panel">
      <div className={`h-1.5 ${PILLAR_ACCENT_CLASSES[accent]}`} />
      <div className="p-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-deep font-mono-ledger text-sm font-semibold text-paper">
          {index + 1}
        </div>
        {item.eyebrow && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-deep">{item.eyebrow}</p>
        )}
        <h4 className="mt-1 font-display text-lg font-semibold text-ink">{item.title}</h4>
        {item.lead && <p className="mt-2 text-sm font-medium text-ink">{item.lead}</p>}
        {item.bullets && item.bullets.length > 0 ? (
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-muted">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          item.description && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
        )}
      </div>
    </div>
  );
}

function PillarsBlockView({ heading, intro, items }: { heading?: string; intro?: string; items: PillarItem[] }) {
  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      {intro && <p className={`max-w-3xl text-ink-muted ${heading ? "mt-2" : ""}`}>{intro}</p>}
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading || intro ? "mt-6" : ""}`}>
        {items.map((item, index) => (
          <PillarCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

// The one block type with real persistence: a free-text commitment plus a
// pledge checklist, saved per student via submitReflection. Saving marks the
// whole step complete — same mechanism a quiz submission uses (onGraded).
function ReflectionBlockView({
  stepId,
  heading,
  prompt,
  placeholder,
  pledgeItems,
  requireText = true,
  submitLabel,
  previousAnswers,
  onGraded,
}: {
  stepId: string;
  heading?: string;
  prompt?: string;
  placeholder?: string;
  pledgeItems: string[];
  requireText?: boolean;
  submitLabel?: string;
  previousAnswers: ReflectionAnswers | null;
  onGraded?: (result?: { score: number; total: number }) => void;
}) {
  const boundAction = submitReflection.bind(null, stepId);
  const [state, formAction, isPending] = useActionState(boundAction, previousAnswers);
  const [text, setText] = useState(previousAnswers?.text ?? "");
  const [pledgeChecked, setPledgeChecked] = useState<boolean[]>(
    () => previousAnswers?.pledge ?? pledgeItems.map(() => false),
  );

  const savedRef = useRef(false);
  useEffect(() => {
    if (state && !savedRef.current) {
      savedRef.current = true;
      onGraded?.();
    }
  }, [state, onGraded]);

  const canSubmit = (!requireText || text.trim().length > 0) && pledgeChecked.every(Boolean);

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-teal-deep/30 bg-beige-panel p-6 sm:p-8">
      <p className="font-display text-lg font-semibold text-ink">{heading ?? "Self-Audit: Setting Your Intention"}</p>
      {prompt && <p className="mt-2 max-w-2xl text-ink-muted">{prompt}</p>}

      <form action={formAction} className="mt-5 space-y-5">
        <input type="hidden" name="pledgeCount" value={pledgeItems.length} />
        {requireText && (
          <textarea
            name="reflectionText"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholder ?? "Type your 1-2 sentence personal commitment here…"}
            rows={3}
            className="w-full rounded-xl border border-ink/15 bg-paper p-4 text-ink placeholder:text-ink-muted/70 focus-visible:outline-none"
          />
        )}

        <div className="space-y-2.5">
          {pledgeItems.map((item, index) => (
            <label key={item} className="flex items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                name={`pledge-${index}`}
                checked={pledgeChecked[index]}
                onChange={(event) =>
                  setPledgeChecked((prev) => prev.map((value, i) => (i === index ? event.target.checked : value)))
                }
                className="mt-0.5 h-4 w-4 accent-teal-deep"
              />
              <span className={pledgeItems.length === 1 ? "font-medium italic text-ink" : undefined}>{item}</span>
            </label>
          ))}
        </div>

        {state && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-teal-deep">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            {requireText ? "Commitment saved." : "Signed."}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={isPending || !canSubmit}>
          {isPending ? "Saving…" : state ? "Update" : submitLabel ?? "Save Commitment"}
        </Button>
      </form>
    </div>
  );
}

function CalloutBlockView({ heading, intro, points }: CalloutBlock) {
  return (
    <div className="rounded-2xl border-l-4 border-teal-deep bg-beige-panel py-5 pl-6 pr-6 sm:py-6">
      <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>
      {intro && <p className="mt-2 max-w-3xl text-ink-muted">{intro}</p>}
      {points && points.length > 0 && (
        <ol className="mt-4 space-y-3">
          {points.map((point, index) => (
            <li key={point.label} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
              <span className="mt-0.5 shrink-0 font-mono-ledger text-xs font-semibold text-teal-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-semibold text-ink">{point.label}: </span>
                {point.description}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ComparisonBlockView({ heading, beforeLabel, afterLabel, rows }: ComparisonBlock) {
  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      <div className={`grid gap-px overflow-hidden rounded-2xl border border-ink/10 sm:grid-cols-2 ${heading ? "mt-6" : ""}`}>
        <div className="bg-beige-panel p-4">
          <p className="font-mono-ledger text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {beforeLabel ?? "Conventional Approach"}
          </p>
        </div>
        <div className="bg-teal-deep/5 p-4">
          <p className="font-mono-ledger text-xs font-semibold uppercase tracking-wide text-teal-deep">
            {afterLabel ?? "Ubuntu Program Framework"}
          </p>
        </div>
        {rows.map((row) => (
          <Fragment key={row.before}>
            <div className="flex gap-2 border-t border-ink/10 bg-beige-panel/60 p-4 text-sm text-ink-muted">
              <span aria-hidden="true" className="shrink-0 text-ink/40">
                ✕
              </span>
              <span>{row.before}</span>
            </div>
            <div className="flex gap-2 border-t border-ink/10 bg-teal-deep/5 p-4 text-sm text-ink">
              <span aria-hidden="true" className="shrink-0 text-teal-deep">
                ✓
              </span>
              <span>{row.after}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// An ungraded single-select self-check, persisted via submitPoll — a revisit
// shows the prior selection, but nothing here is scored.
function PollBlockView({
  stepId,
  prompt,
  options,
  previousAnswers,
  onGraded,
}: PollBlock & {
  stepId: string;
  previousAnswers: PollAnswers | null;
  onGraded?: (result?: { score: number; total: number }) => void;
}) {
  const boundAction = submitPoll.bind(null, stepId);
  const [state, formAction, isPending] = useActionState(boundAction, previousAnswers);
  const [selected, setSelected] = useState(previousAnswers?.selected ?? "");

  const savedRef = useRef(false);
  useEffect(() => {
    if (state && !savedRef.current) {
      savedRef.current = true;
      onGraded?.();
    }
  }, [state, onGraded]);

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
      <p className="font-display text-lg font-semibold text-ink">Quick Reflection Check</p>
      <p className="mt-2 text-ink-muted">{prompt}</p>

      <form action={formAction} className="mt-5 space-y-4">
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-start gap-3 rounded-xl border border-ink/10 bg-beige-panel/50 p-3 text-sm text-ink transition-colors hover:bg-beige-panel"
            >
              <input
                type="radio"
                name="selected"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="mt-0.5 h-4 w-4 accent-teal-deep"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        {state && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-teal-deep">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Response saved.
          </p>
        )}

        <Button type="submit" variant="primary" disabled={isPending || !selected}>
          {isPending ? "Saving…" : state ? "Update Response" : "Save Response"}
        </Button>
      </form>
    </div>
  );
}

function BannerBlockView({ heading, lines }: BannerBlock) {
  return (
    <div className="step-quote-pattern relative overflow-hidden rounded-2xl bg-teal-deep px-8 py-8 text-center sm:py-10">
      {heading && <p className="relative z-10 font-display text-xl font-semibold text-paper sm:text-2xl">{heading}</p>}
      <div className={`relative z-10 space-y-1.5 ${heading ? "mt-3" : ""}`}>
        {lines.map((line) => (
          <p key={line} className="text-sm text-turquoise sm:text-base">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function RoadmapBlockView({ items }: RoadmapBlock) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.title} className="overflow-hidden rounded-2xl border border-ink/10 bg-beige-panel">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 bg-teal-deep/5 px-5 py-3">
            <p className="font-display text-base font-semibold text-ink">
              <span className="mr-2 font-mono-ledger text-xs text-teal-deep">{String(index + 1).padStart(2, "0")}</span>
              {item.title}
            </p>
            <p className="font-mono-ledger text-xs text-ink-muted">{item.dates}</p>
          </div>
          <div className="space-y-1.5 px-5 py-4">
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">Focus: </span>
              {item.focus}
            </p>
            {item.milestone && (
              <p className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">Milestone: </span>
                {item.milestone}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ManifestoBlockView({ heading, items }: ManifestoBlock) {
  return (
    <div className="rounded-2xl border-2 border-teal-deep/20 bg-paper p-6 sm:p-10">
      {heading && <h3 className="text-center font-display text-2xl font-semibold text-ink">{heading}</h3>}
      <div className={`space-y-6 ${heading ? "mt-6" : ""}`}>
        {items.map((item) => (
          <div key={item.title}>
            <p className="font-display text-lg font-semibold text-teal-deep">{item.title}</p>
            <p className="mt-1.5 leading-relaxed text-ink-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateBlockView({ heading, body }: TemplateBlock) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl border border-ink/10 bg-beige-panel p-5">
      <div className="flex items-center justify-between gap-3">
        {heading && <p className="text-sm font-semibold text-ink">{heading}</p>}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(body).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-teal-deep/30 px-3 py-1 text-xs font-semibold text-teal-deep transition-colors hover:bg-teal-deep/10"
        >
          <Copy aria-hidden="true" className="h-3 w-3" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-4 font-mono-ledger text-sm leading-relaxed text-ink">
        {body}
      </pre>
    </div>
  );
}

// `url` absent renders an inert placeholder rather than a fabricated link —
// see the type's comment in step-blocks.ts.
function ActionCardButton({ label, url }: { label: string; url?: string }) {
  if (url) {
    return (
      <Button href={url} variant="primary">
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink-muted">
      {label} — link coming soon
    </span>
  );
}

function ActionCardBlockView({ heading, bullets, buttonLabel, url }: ActionCardBlock) {
  return (
    <div className="rounded-2xl border-2 border-teal-deep/30 bg-paper p-6 sm:p-8">
      <h3 className="font-display text-lg font-semibold text-ink">{heading}</h3>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink-muted">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5">
        <ActionCardButton label={buttonLabel} url={url} />
      </div>
    </div>
  );
}

function FaqBlockView({ heading, items }: FaqBlock) {
  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      <div className={`space-y-2 ${heading ? "mt-6" : ""}`}>
        {items.map((item) => (
          <details key={item.question} className="group rounded-xl border border-ink/10 bg-paper open:bg-beige-panel/40">
            <summary className="cursor-pointer list-none p-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span className="mr-2 inline-block text-teal-deep transition-transform group-open:rotate-90">▸</span>
              {item.question}
            </summary>
            <div className="px-4 pb-4 pl-10 text-sm leading-relaxed text-ink-muted">
              <p>{item.answer}</p>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function LinksBlockView({ heading, intro, items }: LinksBlock) {
  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      {intro && <p className={`max-w-3xl text-ink-muted ${heading ? "mt-2" : ""}`}>{intro}</p>}
      <div className={`grid gap-4 sm:grid-cols-2 ${heading || intro ? "mt-6" : ""}`}>
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-ink/10 bg-beige-panel p-5">
            <p className="font-display text-base font-semibold text-ink">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
              {item.handle && <span className="ml-1.5 text-sm font-normal text-ink-muted">{item.handle}</span>}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            <div className="mt-4">
              <ActionCardButton label={item.buttonLabel ?? "Follow"} url={item.url} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// `src` absent (artwork not generated yet) renders a clearly-labeled
// placeholder instead of a broken image or a guessed URL.
function ImageBlockView({ alt, caption, src }: ImageBlock) {
  return (
    <figure>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- variable-source generated illustrations; next/image would need every domain pre-registered
        <img src={src} alt={alt} className="w-full rounded-2xl border border-ink/10 object-cover" loading="lazy" />
      ) : (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 bg-beige-panel/60 p-6 text-center">
          <ImageIcon aria-hidden="true" className="h-6 w-6 text-ink-muted" />
          <p className="text-sm font-medium text-ink-muted">Illustration coming soon</p>
          <p className="max-w-md text-xs text-ink-muted/80">{alt}</p>
        </div>
      )}
      {caption && <figcaption className="mt-2 text-center text-sm italic text-ink-muted/80">{caption}</figcaption>}
    </figure>
  );
}

function TableBlockView({ heading, columns, rows }: TableBlock) {
  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      <div className={`overflow-x-auto rounded-2xl border border-ink/10 ${heading ? "mt-6" : ""}`}>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-teal-deep/5">
              {columns.map((column) => (
                <th key={column} className="border-b border-ink/10 p-4 font-semibold text-ink">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-beige-panel/40" : undefined}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-ink/10 p-4 align-top leading-relaxed text-ink-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A simplified, illustrative continent outline (not a survey-accurate
// projection) used purely as a backdrop for tappable pins — pin.x/y are
// percentages within this same 100x110 viewBox, not real coordinates.
const AFRICA_OUTLINE_PATH =
  "M20,8 C35,3 55,3 65,8 C78,10 88,20 90,32 C93,38 93,45 88,42 C80,38 78,45 82,52 C86,60 84,68 78,72 C74,80 72,90 68,98 C64,105 58,108 52,107 C47,106 46,100 44,94 C40,85 36,80 32,72 C26,62 20,55 15,48 C8,40 4,32 6,25 C8,18 12,10 20,8 Z";

function MapBlockView({ heading, pins }: MapBlock) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? pins[activeIndex] : null;

  return (
    <div>
      {heading && <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>}
      <div className={`grid gap-4 sm:grid-cols-[1fr_260px] ${heading ? "mt-6" : ""}`}>
        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-beige-panel" style={{ aspectRatio: "100 / 110" }}>
          <svg viewBox="0 0 100 110" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d={AFRICA_OUTLINE_PATH} className="fill-teal-deep/10 stroke-teal-deep/40" strokeWidth={1} />
          </svg>
          {pins.map((pin, index) => (
            <button
              key={pin.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              style={{ left: `${pin.x}%`, top: `${(pin.y / 110) * 100}%` }}
              aria-label={pin.label}
              aria-pressed={activeIndex === index}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper shadow-sm transition-transform hover:scale-125 ${
                activeIndex === index ? "h-5 w-5 scale-110 bg-yellow" : "h-4 w-4 bg-teal-deep"
              }`}
            />
          ))}
        </div>
        <div className="rounded-2xl border border-ink/10 bg-paper p-4">
          {active ? (
            <>
              <p className="font-semibold text-ink">{active.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{active.detail}</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted">Tap a pin to see the fossil discovery.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// The "Living Canvas" reader: renders a step's contentBlocks in order, with
// a quiet divider between them. Each block type owns its own layout and
// never breaks out of this component's switch — callers just hand it the
// array from ModuleStep.contentBlocks.
export function StepBlocks({
  blocks,
  stepId,
  answers,
  onGraded,
}: {
  blocks: StepBlock[];
  stepId: string;
  answers?: unknown;
  onGraded?: (result?: { score: number; total: number }) => void;
}) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => (
        <div key={index} className="space-y-8">
          {index > 0 && <SectionDivider />}
          {block.type === "prose" && <ProseBlockView markdown={block.markdown} />}
          {block.type === "quote" && <QuoteBlockView {...block} />}
          {block.type === "pillars" && <PillarsBlockView {...block} />}
          {block.type === "callout" && <CalloutBlockView {...block} />}
          {block.type === "comparison" && <ComparisonBlockView {...block} />}
          {block.type === "banner" && <BannerBlockView {...block} />}
          {block.type === "roadmap" && <RoadmapBlockView {...block} />}
          {block.type === "manifesto" && <ManifestoBlockView {...block} />}
          {block.type === "template" && <TemplateBlockView {...block} />}
          {block.type === "actionCard" && <ActionCardBlockView {...block} />}
          {block.type === "faq" && <FaqBlockView {...block} />}
          {block.type === "links" && <LinksBlockView {...block} />}
          {block.type === "image" && <ImageBlockView {...block} />}
          {block.type === "table" && <TableBlockView {...block} />}
          {block.type === "map" && <MapBlockView {...block} />}
          {block.type === "reflection" && (
            <ReflectionBlockView
              {...block}
              stepId={stepId}
              previousAnswers={answers as ReflectionAnswers | null}
              onGraded={onGraded}
            />
          )}
          {block.type === "poll" && (
            <PollBlockView
              {...block}
              stepId={stepId}
              previousAnswers={answers as PollAnswers | null}
              onGraded={onGraded}
            />
          )}
        </div>
      ))}
    </div>
  );
}
