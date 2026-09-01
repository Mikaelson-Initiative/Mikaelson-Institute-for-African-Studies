// The "Living Canvas" content model: an ordered array of typed blocks stored
// in ModuleStep.contentBlocks, rendered by src/components/learn/step-blocks.tsx
// instead of a plain markdown wall of text. New block types get added here
// and to that renderer's switch — nowhere else.

export type ProseBlock = {
  type: "prose";
  markdown: string;
};

// A proverb's equivalent in another African language — shown under the main
// quote to make the point that the idea, not just the phrase, spans the
// continent.
export type QuoteEcho = {
  language: string;
  text: string;
};

export type QuoteBlock = {
  type: "quote";
  quote: string;
  translation?: string;
  attribution?: string;
  echoes?: QuoteEcho[];
};

// Kept to the site's approved brand tokens (teal-deep, turquoise, yellow) —
// no new colors, see globals.css's "do not introduce colors outside this
// set." Omitted, a card cycles through these three by position.
export type PillarAccent = "teal" | "turquoise" | "yellow";

export type PillarItem = {
  title: string;
  eyebrow?: string;
  // A short standalone lead line above the bullets/description — e.g. "The
  // Insight: ...", set off visually rather than folded into the first bullet.
  lead?: string;
  // `bullets` (a short list of concrete commitments) takes priority over
  // `description` (a single paragraph) when both are present — most pillars
  // authored so far use one or the other, not both.
  description?: string;
  bullets?: string[];
  accent?: PillarAccent;
};

export type PillarsBlock = {
  type: "pillars";
  heading?: string;
  intro?: string;
  items: PillarItem[];
};

// A saved, per-student reflection: free text plus a checklist of pledges —
// persisted via submitReflection in
// app/ubuntu/(protected)/modules/[id]/actions.ts. Saving it marks the whole
// step complete, the same way a quiz submission does. `requireText: false`
// turns this into a plain single-statement pledge/affirmation (no textarea,
// e.g. "sign this manifesto") — pledgeItems still needs at least one entry.
export type ReflectionBlock = {
  type: "reflection";
  heading?: string;
  prompt?: string;
  placeholder?: string;
  pledgeItems: string[];
  requireText?: boolean;
  submitLabel?: string;
};

export type ReflectionAnswers = {
  text: string;
  pledge: boolean[];
};

// A highlighted callout — a short claim, then an optional list of labeled
// points (e.g. the three reasons African history gets sidelined in
// mainstream curricula). Left-border-accented, not a full card.
export type CalloutPoint = {
  label: string;
  description: string;
};

export type CalloutBlock = {
  type: "callout";
  heading: string;
  intro?: string;
  points?: CalloutPoint[];
};

// A single ✗-vs-✓ paired row in a ComparisonBlock — "the conventional
// approach" against "the Ubuntu Program's approach" to the same question.
export type ComparisonRow = {
  before: string;
  after: string;
};

export type ComparisonBlock = {
  type: "comparison";
  heading?: string;
  beforeLabel?: string;
  afterLabel?: string;
  rows: ComparisonRow[];
};

// A single-select, ungraded self-check — persisted (via submitPoll) so a
// revisit shows the student's prior answer, but there's no right answer and
// no score. Distinct from ReflectionBlock (free text + pledges) and from a
// ModuleStep of type "quiz" (graded, multi-question).
export type PollBlock = {
  type: "poll";
  prompt: string;
  options: string[];
};

export type PollAnswers = {
  selected: string;
};

// A short highlighted info strip — dates, format, a one-line takeaway. Not a
// proverb (see QuoteBlock) — just a compact banner of a few lines.
export type BannerBlock = {
  type: "banner";
  heading?: string;
  lines: string[];
};

// One module's row in a program roadmap — a vertical stacked list (not a
// card grid, see PillarsBlock), since each entry carries more fields than a
// pillar card comfortably holds.
export type RoadmapItem = {
  title: string;
  dates: string;
  focus: string;
  milestone?: string;
};

export type RoadmapBlock = {
  type: "roadmap";
  items: RoadmapItem[];
};

// One numbered principle in a ManifestoBlock — a short title (often roman
// numerals, authored directly into `title`) plus its body paragraph.
export type ManifestoItem = {
  title: string;
  body: string;
};

export type ManifestoBlock = {
  type: "manifesto";
  heading?: string;
  items: ManifestoItem[];
};

// A monospace, copy-to-clipboard snippet — e.g. the WhatsApp intro-message
// template a student fills in and pastes. Purely presentational, no
// persistence.
export type TemplateBlock = {
  type: "template";
  heading?: string;
  body: string;
};

// A highlighted call-to-action box: a short pitch plus a button. `url` is
// deliberately optional and never guessed — when a real destination isn't
// known yet, the button renders as an inert "coming soon" placeholder
// instead of a fabricated link (see the "Note for staff" convention already
// used in this step's plain-markdown content elsewhere).
export type ActionCardBlock = {
  type: "actionCard";
  heading: string;
  bullets?: string[];
  buttonLabel: string;
  url?: string;
};

// One question in a FaqBlock, rendered as a native <details>/<summary>
// accordion — no client JS needed for the expand/collapse itself.
export type FaqItem = {
  question: string;
  answer: string;
  bullets?: string[];
};

export type FaqBlock = {
  type: "faq";
  heading?: string;
  items: FaqItem[];
};

// One channel in a LinksBlock (social/media gateway grid). Same "never
// fabricate a URL" rule as ActionCardBlock — `url` absent renders the
// button as a placeholder, not a guessed link.
export type LinkItem = {
  icon?: string;
  label: string;
  handle?: string;
  description: string;
  buttonLabel?: string;
  url?: string;
};

export type LinksBlock = {
  type: "links";
  heading?: string;
  intro?: string;
  items: LinkItem[];
};

export type StepBlock =
  | ProseBlock
  | QuoteBlock
  | PillarsBlock
  | ReflectionBlock
  | CalloutBlock
  | ComparisonBlock
  | PollBlock
  | BannerBlock
  | RoadmapBlock
  | ManifestoBlock
  | TemplateBlock
  | ActionCardBlock
  | FaqBlock
  | LinksBlock;
