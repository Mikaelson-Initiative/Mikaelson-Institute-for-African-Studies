import { z } from "zod";
import { focusAreas } from "@/lib/focus-areas";

const focusAreaSlugs = focusAreas.map((area) => area.slug) as [string, ...string[]];

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const submissionFieldsSchema = z.object({
  title: z.string().trim().min(3, "Enter the paper's title."),
  authorName: z.string().trim().min(2, "Enter your full name."),
  authorEmail: z.email("Enter a valid email address."),
  focusArea: z.enum(focusAreaSlugs, { message: "Choose a focus area." }),
  abstract: z
    .string()
    .trim()
    .min(50, "Abstract must be at least 50 characters.")
    .max(3000, "Abstract must be under 3000 characters."),
});

export type SubmissionFields = z.infer<typeof submissionFieldsSchema>;
