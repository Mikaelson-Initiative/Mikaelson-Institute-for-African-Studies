import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

export type ContactFields = z.infer<typeof contactSchema>;
