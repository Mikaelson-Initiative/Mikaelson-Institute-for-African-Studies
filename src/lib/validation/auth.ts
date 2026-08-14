import { z } from "zod";

export const sendCodeSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const FIRST_TIME_STUDYING_OPTIONS = ["yes", "some", "no"] as const;
export const PRIMARY_GOAL_OPTIONS = ["academic", "professional", "personal", "community"] as const;

export const cohortApplicationSchema = z.object({
  name: z.string().trim().min(2).optional(),
  firstTimeStudying: z.enum(FIRST_TIME_STUDYING_OPTIONS),
  primaryGoal: z.enum(PRIMARY_GOAL_OPTIONS),
  about: z.string().trim().min(20, "Tell us a bit more about yourself."),
  motivation: z.string().trim().min(20, "Tell us a bit more about your motivation."),
});
