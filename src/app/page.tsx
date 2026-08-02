"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "@/lib/i18n"
import { BrandIcon } from "@/components/pwa/brand-icon"
import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  HeartCheckIcon,
  Hospital01Icon,
  Mail01Icon,
  MedicalFileIcon,
  AiPhone01Icon,
  Shield01Icon,
  SmartPhone01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"

const patientBenefits = [
  {
    icon: UserAccountIcon,
    titleKey: "landing.benefit1Title",
    descKey: "landing.benefit1Desc",
  },
  {
    icon: Calendar01Icon,
    titleKey: "landing.benefit2Title",
    descKey: "landing.benefit2Desc",
  },
  {
    icon: HeartCheckIcon,
    titleKey: "landing.benefit3Title",
    descKey: "landing.benefit3Desc",
  },
]

const howItWorks = [
  {
    step: 1,
    icon: UserAccountIcon,
    titleKey: "landing.step1Title",
    descKey: "landing.step1Desc",
  },
  {
    step: 2,
    icon: MedicalFileIcon,
    titleKey: "landing.step2Title",
    descKey: "landing.step2Desc",
  },
  {
    step: 3,
    icon: CheckmarkCircle02Icon,
    titleKey: "landing.step3Title",
    descKey: "landing.step3Desc",
  },
  {
    step: 4,
    icon: Hospital01Icon,
    titleKey: "landing.step4Title",
    descKey: "landing.step4Desc",
  },
]

const faqs = [
  {
    questionKey: "landing.faq1Question",
    answerKey: "landing.faq1Answer",
  },
  {
    questionKey: "landing.faq2Question",
    answerKey: "landing.faq2Answer",
  },
  {
    questionKey: "landing.faq3Question",
    answerKey: "landing.faq3Answer",
  },
  {
    questionKey: "landing.faq4Question",
    answerKey: "landing.faq4Answer",
  },
]

export default function Page() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandIcon priority className="shadow-lg shadow-primary/20" />
            <div>
              <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">DPAMS</p>
              <p className="text-[10px] text-muted-foreground font-semibold">{t("landing.tagline")}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
              <a href="#how-it-works" className="transition hover:text-primary">
                {t("landing.howItWorks")}
              </a>
              <a href="#faq" className="transition hover:text-primary">
                {t("landing.faq")}
              </a>
              <a href="#contact" className="transition hover:text-primary">
                {t("landing.contact")}
              </a>
            </nav>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">{t("landing.signIn")}</Link>
            </Button>
            <Button asChild className="rounded-md">
              <Link href="/register">{t("landing.getStarted")}</Link>
            </Button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">


                <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  {t("landing.heroTitle")}{" "}
                  <span className="text-primary">{t("landing.heroTitleHighlight")}</span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {t("landing.heroDescription")}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" asChild className="h-12 rounded-md px-8 text-base">
                    <Link href="/register">
                      <HugeiconsIcon icon={Calendar01Icon} className="mr-2" size={18} />
                      {t("landing.preRegisterBookNow")}
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 rounded-md px-8 text-base"
                  >
                    <Link href="/login">
                      {t("landing.haveAccount")}
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>{t("landing.freeToUse")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>{t("landing.noHiddenFees")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>{t("landing.access247")}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <HugeiconsIcon icon={HeartCheckIcon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">{t("landing.welcomeBack")}</p>
                      <p className="text-sm text-muted-foreground">{t("landing.healthJourneyStarts")}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{t("landing.generalCheckup")}</p>
                          <p className="text-sm text-muted-foreground">{t("landing.tomorrow9am")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                          <HugeiconsIcon icon={Clock01Icon} className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{t("landing.dentalCleaning")}</p>
                          <p className="text-sm text-muted-foreground">{t("landing.dec282pm")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-primary/10 p-4 text-center">
                    <p className="text-sm font-medium text-primary">{t("landing.readyToBook")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">
              {t("landing.dualPurposePlatform")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("landing.healthcareUnified")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("landing.healthcareDescription")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patientBenefits.map((benefit) => (
              <Card key={benefit.titleKey} className="group border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <HugeiconsIcon icon={benefit.icon} className="text-primary" size={28} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{t(benefit.titleKey)}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {t(benefit.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pre-Registration Feature Spotlight Section */}
        <section id="pre-registration" className="relative overflow-hidden bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/10 py-16 sm:py-24 border-t border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

              {/* Left Side: Rich description of Pre-registration */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {t("landing.preRegistrationFeature")}
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t("landing.eliminateWaiting")} <span className="text-emerald-500">{t("landing.digitalPreRegistration")}</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t("landing.waitingDescription")}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 mt-8">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t("landing.geoVerification")}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t("landing.geoVerificationDesc")}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t("landing.emergencyNextOfKin")}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t("landing.emergencyNextOfKinDesc")}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t("landing.automatedCompleteness")}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t("landing.automatedCompletenessDesc")}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t("landing.instantAccess")}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t("landing.instantAccessDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: A visual interactive component depicting a "Patient File Pre-Registered" */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-20 blur-lg" />
                <div className="relative rounded-3xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <HugeiconsIcon icon={MedicalFileIcon} className="text-emerald-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{t("landing.patientClinicalProfile")}</h4>
                        <p className="text-xs text-muted-foreground text-[10px]">ID: #P-29831-26</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                      {t("landing.preRegistered")}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">{t("landing.fullName")}</span>
                      <span className="font-medium text-xs">Stanslaus Ndossa</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">{t("landing.geographicRegion")}</span>
                      <span className="font-medium text-xs">Dar es Salaam (Kinondoni)</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">{t("landing.emergencyNextOfKinLabel")}</span>
                      <span className="font-medium text-xs">Brayan Mlawa (Brother)</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">{t("landing.clinicalStatus")}</span>
                      <span className="font-medium text-xs text-emerald-500">{t("landing.verifiedValid")}</span>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-500 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                        <span>{t("landing.unlockedBooking")}</span>
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative overflow-hidden bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">
                {t("landing.structuredSteps")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("landing.preRegisterSchedule")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("landing.noComplicatedForms")}
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, index) => (
                <div key={item.titleKey} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="absolute top-8 left-full hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-primary/30 to-transparent lg:block" />
                  )}
                  <div className="relative text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                    <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={item.icon} className="text-primary" size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{t(item.titleKey)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild className="h-12 rounded-md px-8">
                <Link href="/register">
                  {t("landing.startJourney")}
                  <HugeiconsIcon icon={SmartPhone01Icon} className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("landing.yourInfoSafe")}
                </h2>
                <p className="mt-4 text-primary-foreground/80">
                  {t("landing.privacyDescription")}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                    <HugeiconsIcon icon={Shield01Icon} size={16} />
                    <span>{t("landing.endToEndEncryption")}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    <span>{t("landing.pdpaCompliant")}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
                  <HugeiconsIcon icon={HeartCheckIcon} size={80} className="text-primary-foreground/80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">
              {t("landing.gotQuestions")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("landing.frequentlyAsked")}
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/60 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg">{t(faq.questionKey)}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{t(faq.answerKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lg sm:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">
                  {t("landing.weHereToHelp")}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  {t("landing.needAssistance")}
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {t("landing.assistanceDescription")}
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={AiPhone01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("landing.callUs")}</p>
                      <p className="font-semibold">{t("landing.phoneNumber")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={Mail01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("landing.emailUs")}</p>
                      <p className="font-semibold">{t("landing.emailAddress")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={Clock01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("landing.workingHours")}</p>
                      <p className="font-semibold">{t("landing.workingHoursValue")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Card className="border-border/60">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold">{t("landing.readyToGetStarted")}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {t("landing.joinThousands")}
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Button size="lg" asChild className="h-12 rounded-md">
                        <Link href="/register">{t("landing.createFreeAccount")}</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="h-12 rounded-md">
                        <Link href="/login">{t("auth.signIn")}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <BrandIcon />
                <div>
                  <p className="font-semibold tracking-[0.15em] text-primary uppercase">DPAMS</p>
                  <p className="text-xs text-muted-foreground">{t("landing.tagline")}</p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                {t("landing.footerDescription")}
              </p>
            </div>

            <div>
              <p className="font-semibold">{t("landing.quickLinks")}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/register" className="transition hover:text-primary">{t("landing.createAccount")}</Link>
                <Link href="/login" className="transition hover:text-primary">{t("auth.signIn")}</Link>
                <a href="#how-it-works" className="transition hover:text-primary">{t("landing.howItWorksLink")}</a>
                <a href="#faq" className="transition hover:text-primary">{t("landing.faqLink")}</a>
              </div>
            </div>

            <div>
              <p className="font-semibold">{t("landing.contact")}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <p>{t("landing.phoneNumber")}</p>
                <p>{t("landing.emailAddress")}</p>
                <p>{t("landing.workingHoursValue")}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DPAMS. {t("landing.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
