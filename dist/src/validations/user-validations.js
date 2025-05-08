import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string().min(3),
    last_name: z.string().min(3).optional(),
    email: z.string().email(),
    phone: z.string().min(10).max(15).optional(),
    dob: z.string().transform(val => new Date(val)),
    doj: z.string().transform(val => new Date(val)),
    designation: z.string().min(3),
});
