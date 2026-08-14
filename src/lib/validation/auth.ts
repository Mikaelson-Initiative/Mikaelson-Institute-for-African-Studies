import { z } from "zod";

export const sendCodeSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export const FIRST_TIME_STUDYING_OPTIONS = ["yes", "some", "no"] as const;
export const PRIMARY_GOAL_OPTIONS = ["academic", "professional", "personal", "community"] as const;
export const GENDER_OPTIONS = ["female", "male", "non-binary", "prefer-not-to-say"] as const;

export const cohortApplicationSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phoneNumber: z.string().trim().min(7, "Enter a valid phone number."),
  gender: z.enum(GENDER_OPTIONS, { message: "Select an option." }),
  nationality: z.string().trim().min(2, "Enter your nationality."),
  stateOfOrigin: z.string().trim().min(2, "Enter your state of origin."),
  additionalInfo: z.string().trim().max(1000).optional(),
  firstTimeStudying: z.enum(FIRST_TIME_STUDYING_OPTIONS),
  primaryGoal: z.enum(PRIMARY_GOAL_OPTIONS),
  about: z.string().trim().min(20, "Tell us a bit more about yourself."),
  motivation: z.string().trim().min(20, "Tell us a bit more about your motivation."),
});
