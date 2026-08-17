import type { Components } from "react-markdown";

// Shared ReactMarkdown component overrides for step "text" content — hoisted
// out of the module viewer so a second consumer (the step accordion) doesn't
// have to duplicate it.
export const markdownComponents: Components = {
  h1: ({ node: _node, ...props }) => <h2 className="font-display text-2xl font-semibold text-ink" {...props} />,
  h2: ({ node: _node, ...props }) => <h3 className="font-display text-xl font-semibold text-ink" {...props} />,
  h3: ({ node: _node, ...props }) => <h4 className="font-display text-lg font-semibold text-ink" {...props} />,
  p: ({ node: _node, ...props }) => <p className="text-ink-muted" {...props} />,
  ul: ({ node: _node, ...props }) => <ul className="list-disc space-y-1 pl-5 text-ink-muted" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="list-decimal space-y-1 pl-5 text-ink-muted" {...props} />,
  a: ({ node: _node, ...props }) => <a className="text-teal-deep underline hover:no-underline" {...props} />,
  strong: ({ node: _node, ...props }) => <strong className="font-semibold text-ink" {...props} />,
};
