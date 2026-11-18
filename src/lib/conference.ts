export const CONFERENCE_NAME = "Mikaelson Institute Research Conference";
export const CONFERENCE_YEAR = 2027;

// Theme and year confirmed by the Institute (2026-11-18).
export const CONFERENCE_THEME = {
  lead: "At the Frontier",
  subject: "Knowledge Production from Africa",
};
export const CONFERENCE_THEME_TEXT = `${CONFERENCE_THEME.lead}: ${CONFERENCE_THEME.subject}`;

// The Institute's published contact address (see /contact). Used until the
// conference has a registration/submission backend of its own.
export const CONFERENCE_CONTACT_EMAIL = "institute@mikaelsoninitiative.org";
export const CONFERENCE_INTEREST_MAILTO = `mailto:${CONFERENCE_CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Research Conference: register interest",
)}`;
