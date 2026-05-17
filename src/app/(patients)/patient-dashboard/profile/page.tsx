"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
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

import api from "@/api/axios"
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
import { DatePicker } from "@/components/ui/date-picker"

interface Region {
  uuid: string
  name: string
}

interface District {
  uuid: string
  name: string
  region_uuid: string
}

// --- SCHEMA ---
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  phone: z.string().regex(/^\+255[0-9]{9}$/, "Invalid format. Use +255XXXXXXXXX"),
  education: z.string().min(1, "Educational level is required"),
  country: z.string(),
  religion: z.string().optional(),
  tribe: z.string().optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed", "Separated"]),
  occupation: z.string().optional(),
  veoName: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  residence: z.string().min(1, "Residence detail is required"),
  kinName: z.string().min(2, "Next of kin name is required"),
  kinPhone: z.string().regex(/^\+255[0-9]{9}$/, "Invalid format. Use +255XXXXXXXXX"),
  kinRelationship: z.enum(["Parent", "Spouse", "Sibling", "Child", "Friend", "Guardian", "Relative"]),
  bloodGroup: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  nidaNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal(""))
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function PatientProfilePage() {
  const router = useRouter()
  const user = useAuthUserStore((state) => state.user)
  const updateProfile = useAuthUserStore((state) => state.updateProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Live Regions & Districts state
  const [regions, setRegions] = useState<Region[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [isInitialMount, setIsInitialMount] = useState(true)

  const defaultValues = useMemo(() => {
    const profile = user?.patient_profile
    return {
      firstName: user?.first_name || "",
      middleName: user?.middle_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "+255",
      dob: profile?.dob || "",
      gender: (profile?.gender as any) || "Male",
      education: profile?.education || "Bachelor Degree",
      country: profile?.country || "Tanzania",
      religion: profile?.religion || "",
      tribe: profile?.tribe || "",
      maritalStatus: (profile?.marital_status as any) || "Single",
      occupation: profile?.occupation || "",
      veoName: profile?.veo_name || "",
      region: profile?.region_uuid || "",
      district: profile?.district_uuid || "",
      residence: profile?.residence || "",
      kinName: profile?.next_of_kin?.name || "",
      kinPhone: profile?.next_of_kin?.phone || "+255",
      kinRelationship: (profile?.next_of_kin?.relationship as any) || "Relative",
      bloodGroup: profile?.blood_group || "",
      insuranceProvider: profile?.insurance_provider || "",
      insuranceNumber: profile?.insurance_number || "",
      nidaNumber: profile?.nida_number || "",
    }
  }, [user])

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

  // Reset/Pre-fill form when user fetches
  useEffect(() => {
    reset(defaultValues)
  }, [user, reset, defaultValues])

  // Fetch Regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get<Region[]>("regions/")
        setRegions(res.data)
      } catch (err) {
        console.error("Failed to load regions", err)
      }
    }
    fetchRegions()
  }, [])

  // Fetch Districts dynamically when selectedRegion changes
  useEffect(() => {
    if (!selectedRegion) {
      setDistricts([])
      return
    }
    const fetchDistricts = async () => {
      try {
        const res = await api.get<District[]>(`districts/?region_uuid=${selectedRegion}`)
        setDistricts(res.data)
      } catch (err) {
        console.error("Failed to load districts", err)
      }
    }
    fetchDistricts()
  }, [selectedRegion])

  // Clean-up/wipe district dropdown selection ONLY if region is manually changed by user (not during initial prefill mount)
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return
    }
    setValue("district", "")
  }, [selectedRegion, setValue])

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
      const payload = {
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
          region: data.region ? { uuid: data.region } : null,
          district: data.district ? { uuid: data.district } : null,
          next_of_kin: {
            name: data.kinName,
            phone: data.kinPhone,
            relationship: data.kinRelationship
          }
        }
      }

      console.log("Submitting Normalized Profile Data:", payload)
      
      const success = await updateProfile(payload as any)

      if (success) {
        toast.success("Profile saved successfully!")
        // Refetch user to propagate profile_complete flag
        await useAuthUserStore.getState().fetchUser()
        router.push("/patient-dashboard")
      } else {
        toast.error("Failed to update profile.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while saving your profile.")
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
            Clinical Registration
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Complete Patient Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Provide your registration details so the care team can prepare for your visits.
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            className="rounded-xl h-11 px-5 font-bold hover:bg-muted/50 border-border"
            onClick={() => router.push("/patient-dashboard")}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* FORM CARD */}
      <Card className="rounded-3xl border-border bg-card shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* SECTION 1: NAMES */}
            <FormSection 
              title="Patient Identity" 
              subtitle="Legal identity details matching your official clinical records."
              icon={UserIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-rose-500">*</span></Label>
                  <Input id="firstName" {...register("firstName")} className="rounded-xl h-12" placeholder="e.g. Nickson" />
                  {errors.firstName && <p className="text-xs text-rose-500 font-bold">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input id="middleName" {...register("middleName")} className="rounded-xl h-12" placeholder="e.g. Ali" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-rose-500">*</span></Label>
                  <Input id="lastName" {...register("lastName")} className="rounded-xl h-12" placeholder="e.g. Bakari" />
                  {errors.lastName && <p className="text-xs text-rose-500 font-bold">{errors.lastName.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 2: PERSONAL INFO */}
            <FormSection 
              title="Personal Details" 
              subtitle="Basic information used for clinical assessment."
              icon={Calendar03Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="dob">Date of Birth <span className="text-rose-500">*</span></Label>
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
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" value={age} readOnly className="rounded-xl h-12 bg-muted/30 font-bold" />
                  <p className="text-[10px] text-muted-foreground">Auto-filled from date of birth.</p>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="gender">Gender <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("gender", val as any)} value={watch("gender")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="phone">Phone Number <span className="text-rose-500">*</span></Label>
                  <Input id="phone" {...register("phone")} className="rounded-xl h-12" placeholder="+255..." />
                  {errors.phone && <p className="text-xs text-rose-500 font-bold">{errors.phone.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 3: BACKGROUND */}
            <FormSection 
              title="Background Context" 
              subtitle="Socio-economic information for holistic care."
              icon={Book02Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Educational Level <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("education", val)} value={watch("education")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["Primary", "Secondary", "Certificate", "Diploma", "Bachelor Degree", "Master Degree", "PhD", "Other"].map(lvl => (
                        <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country <span className="text-rose-500">*</span></Label>
                  <Input id="country" {...register("country")} readOnly className="rounded-xl h-12 bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion (Optional)</Label>
                  <Input id="religion" {...register("religion")} className="rounded-xl h-12" placeholder="e.g. Christian" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tribe">Tribe (Optional)</Label>
                  <Input id="tribe" {...register("tribe")} className="rounded-xl h-12" placeholder="e.g. Chagga" />
                </div>
                <div className="space-y-2">
                  <Label>Marital Status <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("maritalStatus", val as any)} value={watch("maritalStatus")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["Single", "Married", "Divorced", "Widowed", "Separated"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation (Optional)</Label>
                  <Input id="occupation" {...register("occupation")} className="rounded-xl h-12" placeholder="e.g. Teacher" />
                </div>
              </div>
            </FormSection>

            {/* SECTION 4: RESIDENCE */}
            <FormSection 
              title="Residence Information" 
              subtitle="Where you live for home visits or emergency logistics."
              icon={Location01Icon}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="veoName">Village/Street Officer Name (Optional)</Label>
                  <Input id="veoName" {...register("veoName")} className="rounded-xl h-12" placeholder="VEO Name" />
                  <p className="text-[10px] text-muted-foreground font-medium">Previously known as VEO.</p>
                </div>
                <div className="space-y-2">
                  <Label>Region <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("region", val)} value={watch("region")}>
                    <SelectTrigger className="rounded-xl h-12 w-full text-left">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {regions.map(r => (
                        <SelectItem key={r.uuid} value={r.uuid}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-xs text-rose-500 font-bold">{errors.region.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Council / District <span className="text-rose-500">*</span></Label>
                  <Select 
                    disabled={!selectedRegion} 
                    onValueChange={(val) => setValue("district", val)}
                    value={watch("district")}
                  >
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder={selectedRegion ? "Select district" : "Choose region first"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {districts.map(d => (
                        <SelectItem key={d.uuid} value={d.uuid}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-xs text-rose-500 font-bold">{errors.district.message}</p>}
                  <p className="text-[10px] text-muted-foreground">Choose a real council/district from the selected region.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residence">Residence Detail <span className="text-rose-500">*</span></Label>
                  <Input id="residence" {...register("residence")} className="rounded-xl h-12" placeholder="House No, Street, Landmark" />
                  {errors.residence && <p className="text-xs text-rose-500 font-bold">{errors.residence.message}</p>}
                </div>
              </div>
            </FormSection>

            {/* SECTION 5: NEXT OF KIN */}
            <FormSection 
              title="Emergency Contact" 
              subtitle="Next of kin details in case of emergency."
              icon={UserGroupIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="kinName">Name <span className="text-rose-500">*</span></Label>
                  <Input id="kinName" {...register("kinName")} className="rounded-xl h-12" placeholder="Full name" />
                  {errors.kinName && <p className="text-xs text-rose-500 font-bold">{errors.kinName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kinPhone">Phone Number <span className="text-rose-500">*</span></Label>
                  <Input id="kinPhone" {...register("kinPhone")} className="rounded-xl h-12" placeholder="+255..." />
                  {errors.kinPhone && <p className="text-xs text-rose-500 font-bold">{errors.kinPhone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Relationship <span className="text-rose-500">*</span></Label>
                  <Select onValueChange={(val) => setValue("kinRelationship", val as any)} value={watch("kinRelationship")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["Parent", "Spouse", "Sibling", "Child", "Friend", "Guardian", "Relative"].map(rel => (
                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormSection>

            {/* SECTION 6: MEDICAL */}
            <FormSection 
              title="Additional Medical Information" 
              subtitle="Optional data to expedite your hospital visits."
              icon={HealthIcon}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Blood Group (Optional)</Label>
                  <Select onValueChange={(val) => setValue("bloodGroup", val)} value={watch("bloodGroup")}>
                    <SelectTrigger className="rounded-xl h-12 w-full">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider (Optional)</Label>
                  <Input id="insuranceProvider" {...register("insuranceProvider")} className="rounded-xl h-12" placeholder="e.g. NHIF" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">Insurance Number (Optional)</Label>
                  <Input id="insuranceNumber" {...register("insuranceNumber")} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nidaNumber">NIDA Number (Optional)</Label>
                  <Input id="nidaNumber" {...register("nidaNumber")} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" {...register("email")} className="rounded-xl h-12" placeholder="patient@example.com" />
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="flex-1 md:flex-none rounded-xl h-14 px-12 font-bold shadow-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
                      Save Profile
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
