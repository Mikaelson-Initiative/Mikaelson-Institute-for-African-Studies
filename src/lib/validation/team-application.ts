import { z } from "zod";

export const ROLE_INTEREST_OPTIONS = [
  "research-editorial",
  "design-technology",
  "community-outreach",
  "operations-admin",
  "other",
] as const;

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
