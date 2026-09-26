import { z } from "zod";

// The single source of truth for /join-team's role choices — the form, the
// API route's validation, and every label shown in emails/admin derive from
// this list, so adding a role here is the only change needed.
export const ROLE_CHOICES = [
  {
    value: "curriculum-historian",
    label: "Curriculum Historian / Content Lead",
    description:
      "Research and write accurate, in-depth module content, and review historical claims before they go live.",
  },
  {
    value: "instructional-designer",
    label: "Instructional Designer",
    description:
      "Turn content into effective learning experiences: pacing, quizzes, learning objectives, and assessment design.",
  },
  {
    value: "fullstack-engineer",
    label: "Full-Stack Engineer",
    description:
      "Build and maintain the LMS platform, our content system, and the tools that power it.",
  },
  {
    value: "community-cohort-manager",
    label: "Community & Cohort Manager",
    description:
      "Run student cohorts, moderate live masterclasses, and support learners through the program.",
  },
  {
    value: "operations-program-lead",
    label: "Operations & Program Lead",
    description:
      "Own the release calendar and coordinate across teams so the program ships on schedule.",
  },
  {
    value: "social-media-manager",
    label: "Social Media Manager",
    description:
      "Grow our audience across social platforms and help tell the Institute's story.",
  },
  {
    value: "academic-partnerships-lead",
    label: "Academic Partnerships Lead",
    description:
      "Build relationships with universities and African studies departments, and source masterclass speakers.",
  },
  {
    value: "other",
    label: "Other",
    description: "Something else you'd like to help with.",
  },
] as const;

export const ROLE_INTEREST_OPTIONS = ROLE_CHOICES.map((choice) => choice.value) as [
  (typeof ROLE_CHOICES)[number]["value"],
  ...(typeof ROLE_CHOICES)[number]["value"][],
];

// Values the form offered before the 2026-09-04 switch to the real open
// positions — no longer accepted for new applications, but kept so older
// TeamApplication rows still show a readable label in /admin.
const LEGACY_ROLE_INTEREST_LABELS: Record<string, string> = {
  "research-editorial": "Research & Editorial",
  "design-technology": "Design & Technology",
  "community-outreach": "Community & Outreach",
  "operations-admin": "Operations & Administration",
};

export const ROLE_INTEREST_LABELS: Record<string, string> = {
  ...LEGACY_ROLE_INTEREST_LABELS,
  ...Object.fromEntries(ROLE_CHOICES.map((choice) => [choice.value, choice.label])),
};

export const ACCEPTED_CV_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const teamApplicationFieldsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address."),
  phoneNumber: z.string().trim().min(7, "Enter a valid phone number."),
  location: z.string().trim().min(2, "Enter your city of residence."),
  roleInterest: z.enum(ROLE_INTEREST_OPTIONS, { message: "Choose an area." }),
  customRole: z.string().trim().max(200).optional(),
  availability: z.string().trim().min(2, "Tell us about your availability."),
  hoursPerWeek: z.coerce
    .number()
    .int("Enter a whole number of hours.")
    .min(1, "Enter how many hours a week you can commit.")
    .max(168, "Enter a realistic number of hours."),
  volunteeredBefore: z.enum(["true", "false"], { message: "Let us know if you've volunteered before." }).transform((v) => v === "true"),
  experience: z.string().trim().min(20, "Tell us a bit more about your experience."),
  linkedinUrl: z.string().trim().min(1, "Add your LinkedIn profile link.").max(300),
  motivation: z.string().trim().min(20, "Tell us a bit more about your motivation."),
});

export type TeamApplicationFields = z.infer<typeof teamApplicationFieldsSchema>;
