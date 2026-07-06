"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "react-toastify"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Calendar03Icon,
  Book02Icon,
  Location01Icon,
  UserGroupIcon,
  HealthIcon,
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  SignatureIcon
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FormSection } from "@/components/profile/form-section"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import type { UserUpdatePayload } from "@/store/auth/auth.types"
import { DatePicker } from "@/components/ui/date-picker"
import {
  getTanzaniaDistricts,
  getTanzaniaWards,
  TANZANIA_REGIONS,
} from "@/lib/tanzania-locations"
import { useTranslation } from "@/lib/i18n"

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const
const EDUCATION_OPTIONS = [
  "Primary",
  "Secondary",
  "Certificate",
  "Diploma",
  "Bachelor Degree",
  "Master Degree",
  "PhD",
  "Other",
] as const
const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed", "Separated"] as const
const RELATIONSHIP_OPTIONS = ["Parent", "Spouse", "Sibling", "Child", "Friend", "Guardian", "Relative"] as const

const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(2, t("patientProfile.errors.firstNameRequired")),
    middleName: z.string().optional(),
    lastName: z.string().min(2, t("patientProfile.errors.lastNameRequired")),
    dob: z.string().min(1, t("patientProfile.errors.dobRequired")),
    gender: z.enum(GENDER_OPTIONS),
    phone: z.string().regex(/^\+255[0-9]{9}$/, t("patientProfile.errors.invalidPhone")),
    education: z.string().min(1, t("patientProfile.errors.educationRequired")),
    country: z.string(),
    religion: z.string().optional(),
    tribe: z.string().optional(),
    maritalStatus: z.enum(MARITAL_STATUS_OPTIONS),
    occupation: z.string().optional(),
    veoName: z.string().optional(),
    region: z.string().min(1, t("patientProfile.errors.regionRequired")),
    district: z.string().min(1, t("patientProfile.errors.districtRequired")),
    ward: z.string().min(1, t("patientProfile.errors.wardRequired")),
    residence: z.string().min(1, t("patientProfile.errors.residenceRequired")),
    kinName: z.string().min(2, t("patientProfile.errors.kinNameRequired")),
    kinPhone: z.string().regex(/^\+255[0-9]{9}$/, t("patientProfile.errors.invalidPhone")),
    kinRelationship: z.enum(RELATIONSHIP_OPTIONS),
    bloodGroup: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insuranceNumber: z.string().optional(),
    nidaNumber: z.string().optional(),
    email: z.string().email(t("patientProfile.errors.invalidEmail")).optional().or(z.literal("")),
  })

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>

export default function PatientProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const patientId = user?.patient_profile?.patient_id ?? t("search.notAssigned")
  const profileSchema = useMemo(() => createProfileSchema(t), [t])
  
  const defaultValues = useMemo(() => {
    const profile = user?.patient_profile
    return {
      firstName: user?.first_name || "",
      middleName: user?.middle_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "+255",
      dob: profile?.dob || "",
      gender: (profile?.gender as ProfileFormValues["gender"]) || "Male",
      education: profile?.education || "Bachelor Degree",
      country: profile?.country || t("patientProfile.countryDefault"),
      religion: profile?.religion || "",
      tribe: profile?.tribe || "",
      maritalStatus:
        (profile?.marital_status as ProfileFormValues["maritalStatus"]) || "Single",
      occupation: profile?.occupation || "",
      veoName: profile?.veo_name || "",
      region: profile?.region || "",
      district: profile?.district || "",
      ward: profile?.ward || "",
      residence: profile?.residence || "",
      kinName: profile?.next_of_kin?.name || "",
      kinPhone: profile?.next_of_kin?.phone || "+255",
      kinRelationship:
        (profile?.next_of_kin?.relationship as ProfileFormValues["kinRelationship"]) ||
        "Relative",
      bloodGroup: profile?.blood_group || "",
      insuranceProvider: profile?.insurance_provider || "",
      insuranceNumber: profile?.insurance_number || "",
      nidaNumber: profile?.nida_number || "",
    }
  }, [t, user])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid },
    watch
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues
  })

  // Dynamic Watchers
  const dob = watch("dob")
  const selectedRegion = watch("region")
  const selectedDistrict = watch("district")
  const districts = useMemo(
    () => getTanzaniaDistricts(selectedRegion),
    [selectedRegion]
  )
  const wards = useMemo(
    () => getTanzaniaWards(selectedRegion, selectedDistrict),
    [selectedDistrict, selectedRegion]
  )

  // Reset/Pre-fill form when user fetches
  useEffect(() => {
    reset(defaultValues)
  }, [user, reset, defaultValues])

  // --- AGE CALCULATION ---
  const age = useMemo(() => {
    if (!dob) return ""
    const birthDate = new Date(dob)
    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--
    }
    return calculatedAge >= 0 ? calculatedAge.toString() : ""
  }, [dob])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      const payload: UserUpdatePayload = {
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        email: data.email || null,
        phone: data.phone,
        patient_profile: {
          dob: data.dob,
          gender: data.gender,
          education: data.education,
          country: data.country,
          religion: data.religion || null,
          tribe: data.tribe || null,
          marital_status: data.maritalStatus,
          occupation: data.occupation || null,
          veo_name: data.veoName || null,
          residence: data.residence,
          blood_group: data.bloodGroup || null,
          insurance_provider: data.insuranceProvider || null,
          insurance_number: data.insuranceNumber || null,
          nida_number: data.nidaNumber || null,
          region: data.region || null,
          district: data.district || null,
          ward: data.ward || null,
          next_of_kin: {
            name: data.kinName,
            phone: data.kinPhone,
            relationship: data.kinRelationship
          }
        }
      }

      const success = await updateProfile(payload)

      if (success) {
        toast.success(t("patientProfile.profileSaved"))
        // Refetch user to propagate profile_complete flag
        await useAuthUserStore.getState().fetchUser()
        router.push("/patient-dashboard")
      } else {
        toast.error(t("patientProfile.profileSaveFailed"))
      }
    } catch (err) {
      console.error(err)
      toast.error(t("patientProfile.profileSaveError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <HugeiconsIcon icon={SignatureIcon} className="h-4 w-4" />
            {t("patientProfile.eyebrow")}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {t("patientProfile.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("patientProfile.subtitle")}
          </p>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 py-2 text-sm shadow-sm">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
              {t("patients.patientId")}
            </span>
            <span className="font-semibold text-foreground">{patientId}</span>
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            className="rounded-xl h-11 px-5 font-bold hover:bg-muted/50 border-border"
            onClick={() => router.push("/patient-dashboard")}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-2 h-4 w-4" />
            {t("booking.backToDashboard")}
          </Button>
        </div>
      </div>

      {/* FORM CARD */}
      <Card className="rounded-3xl border-border bg-card shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* SECTION 1: NAMES */}
            <FormSection
              title={t("patientProfile.sections.identityTitle")}
              subtitle={t("patientProfile.sections.identitySubtitle")}
              icon={UserIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("patientProfile.firstName")} <span className="text-rose-500">*</span></Label>
                  <Input id="firstName" {...register("firstName")} className="rounded-xl h-12" placeholder={t("patientProfile.firstNamePlaceholder")} />
                  {errors.firstName && <p className="text-xs text-rose-500 font-bold">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">{t("patientProfile.middleNameOptional")}</Label>
                  <Input id="middleName" {...register("middleName")} className="rounded-xl h-12" placeholder={t("patientProfile.middleNamePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("patientProfile.lastName")} <span className="text-rose-500">*</span></Label>
                  <Input id="lastName" {...register("lastName")} className="rounded-xl h-12" placeholder={t("patientProfile.lastNamePlaceholder")} />
                  {errors.lastName && <p className="text-xs text-rose-500 font-bold">{errors.lastName.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 2: PERSONAL INFO */}
            <FormSection
              title={t("patientProfile.sections.personalTitle")}
              subtitle={t("patientProfile.sections.personalSubtitle")}
              icon={Calendar03Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="dob">{t("patients.dateOfBirth")} <span className="text-rose-500">*</span></Label>
                  <Controller
                    control={control}
                    name="dob"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        className="rounded-xl h-12"
                      />
                    )}
                  />
                  {errors.dob && <p className="text-xs text-rose-500 font-bold">{errors.dob.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="age">{t("patients.age")}</Label>
                  <Input id="age" value={age} readOnly className="rounded-xl h-12 bg-muted/30 font-bold" />
                  <p className="text-[10px] text-muted-foreground">{t("patientProfile.autoFilledAge")}</p>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="gender">{t("patients.gender")} <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("gender", val as ProfileFormValues["gender"])} value={watch("gender")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={t("patientProfile.selectGender")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{t(`patientProfile.gender.${option}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="phone">{t("patientProfile.phoneNumber")} <span className="text-rose-500">*</span></Label>
                  <Input id="phone" {...register("phone")} className="rounded-xl h-12" placeholder="+255..." />
                  {errors.phone && <p className="text-xs text-rose-500 font-bold">{errors.phone.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 3: BACKGROUND */}
            <FormSection
              title={t("patientProfile.sections.backgroundTitle")}
              subtitle={t("patientProfile.sections.backgroundSubtitle")}
              icon={Book02Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>{t("patientProfile.educationLevel")} <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("education", val)} value={watch("education")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={t("patientProfile.selectLevel")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {EDUCATION_OPTIONS.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>{t(`patientProfile.education.${lvl}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t("patientProfile.country")} <span className="text-rose-500">*</span></Label>
                  <Input id="country" {...register("country")} readOnly className="rounded-xl h-12 bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">{t("patientProfile.religionOptional")}</Label>
                  <Input id="religion" {...register("religion")} className="rounded-xl h-12" placeholder={t("patientProfile.religionPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tribe">{t("patientProfile.tribeOptional")}</Label>
                  <Input id="tribe" {...register("tribe")} className="rounded-xl h-12" placeholder={t("patientProfile.tribePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("patientProfile.maritalStatus")} <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("maritalStatus", val as ProfileFormValues["maritalStatus"])} value={watch("maritalStatus")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={t("patientProfile.selectStatus")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MARITAL_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{t(`patientProfile.marital.${s}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">{t("patientProfile.occupationOptional")}</Label>
                  <Input id="occupation" {...register("occupation")} className="rounded-xl h-12" placeholder={t("patientProfile.occupationPlaceholder")} />
                </div>
              </div>
            </FormSection>

            {/* SECTION 4: RESIDENCE */}
            <FormSection
              title={t("patientProfile.sections.residenceTitle")}
              subtitle={t("patientProfile.sections.residenceSubtitle")}
              icon={Location01Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="veoName">{t("patientProfile.veoNameOptional")}</Label>
                  <Input id="veoName" {...register("veoName")} className="rounded-xl h-12" placeholder={t("patientProfile.veoPlaceholder")} />
                  <p className="text-[10px] text-muted-foreground font-medium">{t("patientProfile.veoHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("patientProfile.region")} <span className="text-rose-500">*</span></Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("region", value, { shouldValidate: true })
                      setValue("district", "")
                      setValue("ward", "")
                    }}
                    value={watch("region")}
                  >
                    <SelectTrigger className="rounded-xl h-12 w-full text-left">
                      <SelectValue placeholder={t("patientProfile.selectRegion")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {TANZANIA_REGIONS.map((region) => (
                        <SelectItem key={region.slug} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-xs text-rose-500 font-bold">{errors.region.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("patientProfile.councilDistrict")} <span className="text-rose-500">*</span></Label>
                  <Select 
                    disabled={!selectedRegion} 
                    onValueChange={(value) => {
                      setValue("district", value, { shouldValidate: true })
                      setValue("ward", "")
                    }}
                    value={watch("district")}
                  >
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={selectedRegion ? t("patientProfile.selectDistrict") : t("patientProfile.chooseRegionFirst")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {districts.map((district) => (
                        <SelectItem key={district.slug} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-xs text-rose-500 font-bold">{errors.district.message}</p>}
                  <p className="text-[10px] text-muted-foreground">{t("patientProfile.districtHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("patientProfile.ward")} <span className="text-rose-500">*</span></Label>
                  <Select
                    disabled={!selectedDistrict}
                    onValueChange={(value) =>
                      setValue("ward", value, { shouldValidate: true })
                    }
                    value={watch("ward")}
                  >
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue
                        placeholder={
                          selectedDistrict
                            ? t("patientProfile.selectWard")
                            : t("patientProfile.chooseDistrictFirst")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {wards.map((ward) => (
                        <SelectItem key={ward.slug} value={ward.name}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-xs text-rose-500 font-bold">
                      {errors.ward.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residence">{t("patientProfile.residenceDetail")} <span className="text-rose-500">*</span></Label>
                  <Input id="residence" {...register("residence")} className="rounded-xl h-12" placeholder={t("patientProfile.residencePlaceholder")} />
                  {errors.residence && <p className="text-xs text-rose-500 font-bold">{errors.residence.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 5: NEXT OF KIN */}
            <FormSection
              title={t("patientProfile.sections.emergencyTitle")}
              subtitle={t("patientProfile.sections.emergencySubtitle")}
              icon={UserGroupIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="kinName">{t("common.name")} <span className="text-rose-500">*</span></Label>
                  <Input id="kinName" {...register("kinName")} className="rounded-xl h-12" placeholder={t("patientProfile.fullNamePlaceholder")} />
                  {errors.kinName && <p className="text-xs text-rose-500 font-bold">{errors.kinName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kinPhone">{t("patientProfile.phoneNumber")} <span className="text-rose-500">*</span></Label>
                  <Input id="kinPhone" {...register("kinPhone")} className="rounded-xl h-12" placeholder="+255..." />
                  {errors.kinPhone && <p className="text-xs text-rose-500 font-bold">{errors.kinPhone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("patientProfile.relationship")} <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("kinRelationship", val as ProfileFormValues["kinRelationship"])} value={watch("kinRelationship")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={t("patientProfile.selectRelationship")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {RELATIONSHIP_OPTIONS.map((rel) => (
                        <SelectItem key={rel} value={rel}>{t(`patientProfile.relationships.${rel}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormSection>

            {/* SECTION 6: MEDICAL */}
            <FormSection
              title={t("patientProfile.sections.medicalTitle")}
              subtitle={t("patientProfile.sections.medicalSubtitle")}
              icon={HealthIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>{t("patientProfile.bloodGroupOptional")}</Label>
                  <Select onValueChange={(val) => setValue("bloodGroup", val)} value={watch("bloodGroup")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={t("patientProfile.selectBloodGroup")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">{t("patientProfile.insuranceProviderOptional")}</Label>
                  <Input id="insuranceProvider" {...register("insuranceProvider")} className="rounded-xl h-12" placeholder={t("patientProfile.insuranceProviderPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">{t("patientProfile.insuranceNumberOptional")}</Label>
                  <Input id="insuranceNumber" {...register("insuranceNumber")} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nidaNumber">{t("patientProfile.nidaNumberOptional")}</Label>
                  <Input id="nidaNumber" {...register("nidaNumber")} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">{t("patientProfile.emailOptional")}</Label>
                  <Input id="email" type="email" {...register("email")} className="rounded-xl h-12" placeholder={t("patientProfile.emailPlaceholder")} />
                  {errors.email && <p className="text-xs text-rose-500 font-bold">{errors.email.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* BOTTOM ACTION AREA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:relative md:p-0 bg-background/80 backdrop-blur-lg md:bg-transparent border-t md:border-t-0 z-50">
              <div className="mx-auto max-w-5xl flex gap-4 md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 md:flex-none rounded-xl h-14 px-10 font-bold"
                  onClick={() => router.push("/patient-dashboard")}
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-5 w-5" />
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="flex-1 md:flex-none rounded-xl h-14 px-12 font-bold shadow-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    t("profile.saving")
                  ) : (
                    <>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
                      {t("patientProfile.saveProfile")}
                    </>
                  )}
                </Button>
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
