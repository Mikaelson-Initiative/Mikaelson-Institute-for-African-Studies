// Emails are opened by someone else, on their own device — unlike SITE_URL
// (used for Paystack callback URLs, sitemap, etc.), which deliberately
// resolves to http://localhost:3000 in local dev so those round-trips land
// back on your own machine, a value baked into an email must always be the
// real public domain. Reusing SITE_URL here previously leaked
// "localhost:3000" into real sent emails and left the logo image
// unreachable for recipients. Same domain Resend/Google OAuth are
// configured against — see .env.example.
const EMAIL_PUBLIC_ORIGIN = "https://institute.mikaelsoninitiative.org";

// Renders every transactional email through one branded shell — table-based
// layout with inline styles throughout, since email clients (Outlook, Gmail
// app) strip <style> blocks and don't support modern CSS layout. Content is
// built from typed sections rather than hand-written HTML strings so every
// email gets the same spacing/typography without copy-pasting markup at each
// call site.
export type EmailSection =
  | { type: "paragraph"; text: string }
  | { type: "code"; text: string }
  | { type: "button"; label: string; url: string }
  | { type: "details"; rows: { label: string; value: string }[] }
  | { type: "divider" };

const TEAL_DEEP = "#003e45";
const TURQUOISE = "#5ce1e6";
const BEIGE_PANEL = "#f2ece5";
const INK = "#201d16";
const INK_MUTED = "#4a4438";
const PAPER = "#ffffff";

const FONT_STACK =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Exported for call sites building sections from raw user input (form
// submissions, free-text fields) — paragraph/details text is inserted as-is
// to allow system-authored <strong>/<a> markup, so untrusted text must be
// escaped by the caller before being passed in.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// User-supplied "URL" fields (e.g. a LinkedIn link typed into a form) are
// rarely validated as real URLs — only that they're non-empty. Rendering an
// unchecked value as an href risks a javascript: URL or a value that breaks
// out of the attribute. Restricts to http(s) and HTML-escapes what's left;
// callers should render the return value as plain text if this is null.
export function safeHref(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return escapeHtml(url.toString());
  } catch {
    return null;
  }
}

function renderSection(section: EmailSection): string {
  switch (section.type) {
    case "paragraph":
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK};">${section.text}</p>`;
    case "code":
      return `<p style="margin:0 0 20px;text-align:center;font-family:'IBM Plex Mono',Consolas,Menlo,monospace;font-size:32px;font-weight:700;letter-spacing:6px;color:${TEAL_DEEP};">${escapeHtml(section.text)}</p>`;
    case "button":
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
          <tr>
            <td style="border-radius:999px;background:${TEAL_DEEP};">
              <a href="${section.url}" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:${PAPER};text-decoration:none;border-radius:999px;">${escapeHtml(section.label)}</a>
            </td>
          </tr>
        </table>`;
    case "details":
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;border-collapse:collapse;">
          ${section.rows
            .map(
              (row, i) => `
            <tr>
              <td style="padding:10px 0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:${INK_MUTED};white-space:nowrap;vertical-align:top;${i > 0 ? `border-top:1px solid ${BEIGE_PANEL};` : ""}">${escapeHtml(row.label)}</td>
              <td style="padding:10px 0 10px 16px;font-size:15px;color:${INK};${i > 0 ? `border-top:1px solid ${BEIGE_PANEL};` : ""}">${row.value}</td>
            </tr>`,
            )
            .join("")}
        </table>`;
    case "divider":
      return `<hr style="border:none;border-top:1px solid ${BEIGE_PANEL};margin:24px 0;" />`;
  }
}

export function renderEmail({
  preheader,
  heading,
  sections,
}: {
  preheader: string;
  heading: string;
  sections: EmailSection[];
}): string {
  const logoUrl = `${EMAIL_PUBLIC_ORIGIN}/logos/png/mark-primary-dark-on-teal-512.png`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mikaelson Institute for African Studies</title>
  </head>
  <body style="margin:0;padding:0;background:${BEIGE_PANEL};font-family:${FONT_STACK};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BEIGE_PANEL};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${PAPER};border-radius:16px;overflow:hidden;border:1px solid rgba(32,29,22,0.08);">
            <tr>
              <td style="background:${TEAL_DEEP};padding:28px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;">
                      <img src="${logoUrl}" width="36" height="36" alt="" style="display:block;border-radius:8px;" />
                    </td>
                    <td style="font-size:15px;font-weight:700;color:${PAPER};">
                      Mikaelson Institute<br />
                      <span style="font-weight:400;color:${TURQUOISE};font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">for African Studies</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;font-weight:700;color:${INK};">${escapeHtml(heading)}</h1>
                ${sections.map(renderSection).join("\n")}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 32px;border-top:1px solid ${BEIGE_PANEL};">
                <p style="margin:0;font-size:12px;line-height:1.6;color:${INK_MUTED};">
                  Mikaelson Institute for African Studies &middot;
                  <a href="${EMAIL_PUBLIC_ORIGIN}" style="color:${INK_MUTED};">${EMAIL_PUBLIC_ORIGIN.replace(/^https?:\/\//, "")}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
