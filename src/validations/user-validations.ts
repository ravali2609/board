import z from "zod";

export const vCreateUser = z.object({
  first_name: z.string().min(3, { message: "first_name must be 3 or more characters" }),
  last_name: z.string().min(3, { message: "first_name must be 3 or more characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10).max(15).optional(),
  dob: z.string().transform(val => new Date(val)),
  doj: z.string().transform(val => new Date(val)),
  designation: z.string().min(3, { message: "designation must be 3 or more characters" }),
});

export type ValidatedCreateUser = z.infer<typeof vCreateUser>;
