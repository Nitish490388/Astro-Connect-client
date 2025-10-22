import { z } from "zod";

/**
 * Validation rules:
 * - name: required, min 2 chars, max 100
 * - email: required, valid email (disabled in UI but validated server-side)
 * - dob: required, ISO string or Date; must be in the past (not today/future)
 * - gender: optional enum (male/female/other) — adjust to your app values
 * - birthPlace: optional, max length 200
 * - birthTime: optional, must match HH:mm 24-hour format (e.g. "08:05", "23:59")
 * - phone: optional, simple international-ish validation (E.164-ish) or local pattern
 * - address: optional, max length 500
 */
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name is too long" }),
  // Accept either ISO string or Date; normalize to ISO string
  dob: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !Number.isNaN(date.getTime()) && date < new Date(); // must be a valid date and in past
    }, { message: "Invalid date of birth or date must be in the past" }),
  gender: z.enum(["male", "female", "other"]),
  birthPlace: z.string().max(200),
  // HH:mm 24-hour format, e.g. "08:05" or "23:59"
  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Time must be in HH:mm format" })
    .optional()
    .or(z.literal("").transform(() => undefined)).optional(), // allow empty string -> undefined
  // Phone: allow empty or a pattern (simple international-ish). Adjust to your needs.
//   phone: z
//     .string()
//     .min(7, { message: "Phone seems too short" })
//     .max(20, { message: "Phone seems too long" })
//     .optional()
//     .or(z.literal("").transform(() => undefined)),
});

// TypeScript type inferred from schema
export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
