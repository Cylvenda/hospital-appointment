import * as z from "zod"

type Translate = (key: string) => string

const emailPattern = /^[a-zA-Z][a-zA-Z0-9._]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function passwordSchema(t: Translate) {
  return z
    .string()
    .min(1, t("auth.validation.passwordRequired"))
    .min(8, t("auth.validation.passwordMinimum"))
    .max(20, t("auth.validation.passwordMaximum"))
    .regex(/[a-z]/, t("auth.validation.passwordLowercase"))
    .regex(/[A-Z]/, t("auth.validation.passwordUppercase"))
    .regex(/[0-9]/, t("auth.validation.passwordNumber"))
    .regex(/[^a-zA-Z0-9]/, t("auth.validation.passwordSpecial"))
}

export function createRegisterFormSchema(t: Translate) {
  return z.object({
    email: z.string().regex(emailPattern, t("auth.validation.emailInvalid")),
    phone: z
      .string()
      .regex(/^(?:\+255|0)(6|7)\d{8}$/, t("auth.validation.phoneInvalid"))
      .transform((value) => value.replace(/[\s-]/g, ""))
      .transform((value) => value.startsWith("0") ? `+255${value.slice(1)}` : value),
    password: passwordSchema(t),
  })
}

export function createLoginFormSchema(t: Translate) {
  return z.object({
    email: z.string().regex(emailPattern, t("auth.validation.emailInvalid")),
    password: passwordSchema(t),
  })
}

export function createResetFormSchema(t: Translate) {
  return z.object({
    email: z.string().regex(emailPattern, t("auth.validation.emailInvalid")),
  })
}

export function createResetConfirmFormSchema(t: Translate) {
  return z
    .object({
      newPassword: passwordSchema(t),
      confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.validation.passwordsMismatch"),
      path: ["confirmPassword"],
    })
}
