import type { Components } from "react-markdown";
import { Reveal } from "@/components/motion/reveal";

// react-markdown's `node` prop is a hast node (an HTML-shaped AST, produced
// after remark-rehype converts the markdown tree) — an image is
// `{ type: "element", tagName: "img" }` there, not mdast's `{ type: "image" }`.
type HastNode = { children?: { type: string; tagName?: string }[] };

// Shared ReactMarkdown component overrides for step "text" content — hoisted
// out of the module viewer so a second consumer (the step accordion) doesn't
// have to duplicate it.
//
// Every block-level element reveals itself the first time it scrolls into
// view (Reveal already collapses to a plain fade under prefers-reduced-motion
// — see reveal.tsx) — this is what turns a long story-driven reading step
// into something that unfolds as a student scrolls, rather than a wall of
// text that's all visible at once.
export const markdownComponents: Components = {
  h1: ({ node: _node, ...props }) => (
    <Reveal>
      <h2 className="font-display text-2xl font-semibold text-ink" {...props} />
    </Reveal>
  ),
  h2: ({ node: _node, ...props }) => (
    <Reveal>
      <h3 className="font-display text-xl font-semibold text-ink" {...props} />
    </Reveal>
  ),
  h3: ({ node: _node, ...props }) => (
    <Reveal>
      <h4 className="font-display text-lg font-semibold text-ink" {...props} />
    </Reveal>
  ),
  // Markdown's inline image syntax ![]() still parses into a <p> wrapping an
  // <img> — rendering our <figure> (a block element) inside that <p> would
  // be invalid HTML, so a paragraph whose only child is an image renders
  // the figure directly, with no enclosing <p>. Checked against the mdast
  // node (the markdown AST), not the rendered children — by the time
  // children reach this function they're already the rendered <Reveal>
  // wrapper from the img override below, not a raw <img> we could type-check.
  p: ({ node, children, ...props }) => {
    const hastNode = node as HastNode | undefined;
    const isSoloImage =
      hastNode?.children?.length === 1 &&
      hastNode.children[0].type === "element" &&
      hastNode.children[0].tagName === "img";
    if (isSoloImage) return <>{children}</>;
    return (
      <Reveal>
        <p className="text-lg text-ink-muted" {...props}>
          {children}
        </p>
      </Reveal>
    );
  },
  ul: ({ node: _node, ...props }) => (
    <Reveal>
      <ul className="list-disc space-y-1 pl-5 text-lg text-ink-muted" {...props} />
    </Reveal>
  ),
  ol: ({ node: _node, ...props }) => (
    <Reveal>
      <ol className="list-decimal space-y-1 pl-5 text-lg text-ink-muted" {...props} />
    </Reveal>
  ),
  a: ({ node: _node, ...props }) => <a className="text-teal-deep underline hover:no-underline" {...props} />,
  strong: ({ node: _node, ...props }) => <strong className="font-semibold text-ink" {...props} />,
  // Markdown image syntax ![caption](url) — the alt text doubles as a
  // caption line under the image, since a plain <img> alone reads as a
  // stray graphic rather than part of the story.
  img: ({ node: _node, alt, ...props }) => (
    <Reveal>
      <figure className="my-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote, variable-source story images; next/image would need every domain pre-registered */}
        <img alt={alt ?? ""} className="w-full rounded-2xl border border-ink/10 object-cover" loading="lazy" {...props} />
        {alt && <figcaption className="mt-2 text-center text-sm text-ink-muted/80 italic">{alt}</figcaption>}
      </figure>
    </Reveal>
  ),
};
