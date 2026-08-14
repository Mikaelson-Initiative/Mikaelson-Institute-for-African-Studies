import { z } from "zod";

export const libraryContributionSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address."),
  amount: z.number().int().min(1, "Enter a valid amount."),
  tier: z.string().trim().optional(),
});

export type LibraryContributionFields = z.infer<typeof libraryContributionSchema>;
