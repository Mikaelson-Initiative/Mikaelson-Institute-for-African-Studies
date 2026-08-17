"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { GENDER_OPTIONS } from "@/lib/validation/auth";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  phoneNumber: z.string().trim().min(7, "Enter a valid phone number."),
  gender: z.enum(GENDER_OPTIONS, { message: "Select an option." }),
  nationality: z.string().trim().min(2, "Enter your nationality."),
  stateOfOrigin: z.string().trim().min(2, "Enter your state of origin."),
});

export async function updateProfile(formData: FormData) {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) {
    redirect("/learn/login?denied=1");
  }

  const fields = profileSchema.safeParse({
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    gender: formData.get("gender"),
    nationality: formData.get("nationality"),
    stateOfOrigin: formData.get("stateOfOrigin"),
  });

  if (!fields.success) {
    redirect("/learn/profile?error=1");
  }

  const { name, phoneNumber, gender, nationality, stateOfOrigin } = fields.data;

  await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  await prisma.cohortApplication.update({
    where: { id: application.id },
    data: { phoneNumber, gender, nationality, stateOfOrigin },
  });

  revalidatePath("/learn/profile");
  redirect("/learn/profile?saved=1");
}
