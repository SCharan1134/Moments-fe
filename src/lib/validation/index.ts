import { z } from "zod";

export const SignupValidation = z.object({
  firstName: z.string().min(2, { message: "too short" }),
  lastName: z.string().min(2, { message: "too short" }),
  userName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters" }),
  picturePath: z.string().optional().default("default-user.jpg"),
});

export const loginDetails = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters" }),
});

export const verificationDetails = z.object({
  code: z
    .string()
    .min(6, { message: "wrong length" })
    .max(6, { message: "wrong length" }),
});
