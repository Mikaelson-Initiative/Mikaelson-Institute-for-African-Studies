import { z } from "zod";

// name/email deliberately aren't accepted here — the API route takes them
// from the signed-in session, since this step only appears for an applicant
// who just submitted, not an anonymous form like /library/support.
export const cohortDonationSchema = z.object({
  amount: z.number().int().min(1, "Enter a valid amount."),
  tier: z.string().trim().optional(),
});

export type CohortDonationFields = z.infer<typeof cohortDonationSchema>;
