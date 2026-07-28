"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAdminStore } from "@/store/admin/admin.store";
import { PasswordInput } from "@/components/password-input";
import { getBackendFieldErrors } from "@/lib/backend-errors";
import { useTranslation } from "@/lib/i18n";

type UserRole = "user" | "receptionist" | "doctor" | "lab_tech";

type FormErrors = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
  license_number?: string;
  role?: string;
};

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  license_number: "",
  role: "" as UserRole,
};

export default function CreateUserPage() {
  const { t } = useTranslation();
  const { createUser, createDoctor } = useAdminStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!form.first_name.trim()) {
      newErrors.first_name = t("i18nAudit.createUser.firstNameRequired");
    } else if (form.first_name.trim().length < 2) {
      newErrors.first_name = t("i18nAudit.createUser.firstNameShort");
    } else if (!/^[a-zA-Z\s'-]+$/.test(form.first_name.trim())) {
      newErrors.first_name =
        t("i18nAudit.createUser.firstNameInvalid");
    }

    // Last name validation
    if (!form.last_name.trim()) {
      newErrors.last_name = t("i18nAudit.createUser.lastNameRequired");
    } else if (form.last_name.trim().length < 2) {
      newErrors.last_name = t("i18nAudit.createUser.lastNameShort");
    } else if (!/^[a-zA-Z\s'-]+$/.test(form.last_name.trim())) {
      newErrors.last_name =
        t("i18nAudit.createUser.lastNameInvalid");
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = t("i18nAudit.createUser.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = t("i18nAudit.createUser.emailInvalid");
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = t("i18nAudit.createUser.phoneRequired");
    } else if (!/^[\d\s\-\+\(\)]+$/.test(form.phone.trim())) {
      newErrors.phone =
        t("i18nAudit.createUser.phoneInvalid");
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = t("i18nAudit.createUser.phoneShort");
    }

    // Password validation
    if (!form.password) {
      newErrors.password = t("i18nAudit.createUser.passwordRequired");
    } else if (form.password.length < 8) {
      newErrors.password = t("i18nAudit.createUser.passwordShort");
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password =
        t("i18nAudit.createUser.passwordLowercase");
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      newErrors.password =
        t("i18nAudit.createUser.passwordUppercase");
    } else if (!/(?=.*\d)/.test(form.password)) {
      newErrors.password = t("i18nAudit.createUser.passwordNumber");
    } else if (!/(?=.*[@$!%*?&])/.test(form.password)) {
      newErrors.password =
        t("i18nAudit.createUser.passwordSpecial");
    }

    // Confirm password validation
    if (!form.confirm_password) {
      newErrors.confirm_password = t("i18nAudit.createUser.confirmRequired");
    } else if (form.password !== form.confirm_password) {
      newErrors.confirm_password = t("i18nAudit.createUser.passwordMismatch");
    }

    // Role validation
    if (!form.role) {
      newErrors.role = t("i18nAudit.createUser.roleRequired");
    }

    // License number validation (only for doctors)
    if (form.role === "doctor") {
      if (!form.license_number.trim()) {
        newErrors.license_number = t("i18nAudit.createUser.licenseRequired");
      } else if (form.license_number.trim().length < 5) {
        newErrors.license_number =
          t("i18nAudit.createUser.licenseShort");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("i18nAudit.createUser.fixErrors"));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (form.role === "doctor") {
        await createDoctor({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          license_number: form.license_number.trim(),
          is_available: true,
        });
        toast.success(t("i18nAudit.createUser.created", { role: t("roleLabels.doctor") }));
      } else {
        await createUser({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: form.role,
          is_active: true,
        });
        toast.success(
          t("i18nAudit.createUser.created", { role: t(`roleLabels.${form.role}`) }),
        );
      }

      setForm(emptyForm);
      setErrors({});
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
        "confirm_password",
        "license_number",
        "role",
      ]);
      if (Object.keys(backendErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      } else {
        toast.error(t("i18nAudit.createUser.createFailed", { role: t(`roleLabels.${form.role}`) }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getPasswordStrength = (
    password: string,
  ): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return { score, label: t("i18nAudit.createUser.weak"), color: "text-red-500" };
    if (score <= 4) return { score, label: t("i18nAudit.createUser.medium"), color: "text-yellow-500" };
    return { score, label: t("i18nAudit.createUser.strong"), color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="w-full max-w-8xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/users">
            <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={1.8} />
            {t("i18nAudit.createUser.back")}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("i18nAudit.createUser.title")}</h1>
          <p className="text-muted-foreground">
            {t("i18nAudit.createUser.description")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UserPlus} strokeWidth={1.8} />
            {t("i18nAudit.createUser.information")}
          </CardTitle>
          <CardDescription>
            {t("i18nAudit.createUser.informationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">{t("i18nAudit.createUser.role")}</Label>
              <Select
                value={form.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("i18nAudit.createUser.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t("i18nAudit.createUser.regularUser")}</SelectItem>
                  <SelectItem value="receptionist">{t("roleLabels.receptionist")}</SelectItem>
                  <SelectItem value="doctor">{t("roleLabels.doctor")}</SelectItem>
                  <SelectItem value="lab_tech">{t("roleLabels.lab_tech")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t("i18nAudit.createUser.firstName")}</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className={errors.first_name ? "border-red-500" : ""}
                  placeholder={t("i18nAudit.createUser.enterFirstName")}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">{t("i18nAudit.createUser.lastName")}</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className={errors.last_name ? "border-red-500" : ""}
                  placeholder={t("i18nAudit.createUser.enterLastName")}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("i18nAudit.createUser.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("i18nAudit.createUser.phone")}</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="+255 ...."
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("i18nAudit.createUser.password")}</Label>
                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "border-red-500" : ""}
                  placeholder={t("i18nAudit.createUser.enterPassword")}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${(passwordStrength.score / 6) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">{t("i18nAudit.createUser.confirmPassword")}</Label>
                <PasswordInput
                  id="confirm_password"
                  value={form.confirm_password}
                  onChange={(e) =>
                    handleInputChange("confirm_password", e.target.value)
                  }
                  className={errors.confirm_password ? "border-red-500" : ""}
                  placeholder={t("i18nAudit.createUser.confirmPasswordPlaceholder")}
                  required
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-500">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            {/* License Number (only for doctors) */}
            {form.role === "doctor" && (
              <div className="space-y-2">
                <Label htmlFor="license_number">{t("i18nAudit.createUser.license")}</Label>
                <Input
                  id="license_number"
                  value={form.license_number}
                  onChange={(e) =>
                    handleInputChange("license_number", e.target.value)
                  }
                  className={errors.license_number ? "border-red-500" : ""}
                  placeholder={t("i18nAudit.createUser.enterLicense")}
                />
                {errors.license_number && (
                  <p className="text-sm text-red-500">
                    {errors.license_number}
                  </p>
                )}
              </div>
            )}

            {/* Password Requirements */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t("i18nAudit.createUser.requirements")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span
                    className={
                      form.password.length >= 8 ? "text-green-500" : ""
                    }
                  >
                    •
                  </span>
                  {t("i18nAudit.createUser.eightCharacters")}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[a-z]/.test(form.password) ? "text-green-500" : ""
                    }
                  >
                    •
                  </span>
                  {t("i18nAudit.createUser.lowercase")}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[A-Z]/.test(form.password) ? "text-green-500" : ""
                    }
                  >
                    •
                  </span>
                  {t("i18nAudit.createUser.uppercase")}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={/\d/.test(form.password) ? "text-green-500" : ""}
                  >
                    •
                  </span>
                  {t("i18nAudit.createUser.number")}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[@$!%*?&]/.test(form.password) ? "text-green-500" : ""
                    }
                  >
                    •
                  </span>
                  {t("i18nAudit.createUser.special")}
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.role}
                className="flex-1"
              >
                {isSubmitting
                  ? t("i18nAudit.createUser.creating")
                  : t("i18nAudit.createUser.create", { role: t(`roleLabels.${form.role || "user"}`) })}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setErrors({});
                }}
                disabled={isSubmitting}
              >
                {t("i18nAudit.createUser.clear")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
