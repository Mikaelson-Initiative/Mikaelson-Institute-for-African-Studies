import { z } from "zod";

export const bookFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(300),
  category: z.string().trim().min(1).max(100),
  genre: z.string().trim().min(1, "Genre is required.").max(100),
  imgUrl: z.string().trim().min(1, "Image URL is required.").max(2000),
  linkUrl: z.string().trim().min(1, "Link URL is required.").max(2000),
  sortOrder: z.coerce.number().int(),
});

export const galleryItemFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(300),
  description: z.string().trim().max(2000).nullable(),
  sortOrder: z.coerce.number().int(),
});

export const partnerFieldsSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  type: z.string().trim().max(100).nullable(),
  sortOrder: z.coerce.number().int(),
});

export const teamMemberFieldsSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  role: z.string().trim().min(1, "Role is required.").max(200),
  category: z.string().trim().min(1, "Category is required.").max(100),
  displayIndex: z.string().trim().max(50),
  affiliation: z.string().trim().max(300).nullable(),
  sortOrder: z.coerce.number().int(),
});
