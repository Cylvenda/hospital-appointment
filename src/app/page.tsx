"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
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
  StethoscopeIcon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"

const patientBenefits = [
  {
    icon: UserAccountIcon,
    title: "Clinical Pre-Registration",
    description: "Build your complete verified patient identity with structured location, demographic, and next-of-kin entries to skip hospital queues.",
  },
  {
    icon: Calendar01Icon,
    title: "Appointment Management",
    description: "Choose specialized clinics, select three preferred dates, and detail symptoms within a single card booking console.",
  },
  {
    icon: HeartCheckIcon,
    title: "Dynamic Slot Verification",
    description: "Receive instant updates on receptionist scheduling slots, keeping your clinical visits organized and verified.",
  },
]

const howItWorks = [
  {
    step: 1,
    icon: UserAccountIcon,
    title: "1. Digital Pre-Registration",
    description: "Sign up and complete your comprehensive health profile, next of kin details, and Tanzanian region mapping.",
  },
  {
    step: 2,
    icon: MedicalFileIcon,
    title: "2. Request Your Slot",
    description: "Specify your clinic type, three preferred dates, and present your diagnostic symptoms in a bento scheduler.",
  },
  {
    step: 3,
    icon: CheckmarkCircle02Icon,
    title: "3. Receptionist Verification",
    description: "Our front desk verifies your pre-registration status and allocates your verified clinical consulting slot.",
  },
  {
    step: 4,
    icon: Hospital01Icon,
    title: "4. Fast-Track Care",
    description: "Proceed directly to diagnostics upon arrival. Zero manual paperwork, zero check-in delays.",
  },
]

const faqs = [
  {
    question: "Is this service free to use?",
    answer: "Yes! Creating an account and booking appointments is completely free. You only pay for the hospital services you receive.",
  },
  {
    question: "How do I know my appointment is confirmed?",
    answer: "You'll receive notifications and can check your dashboard anytime. When status changes to 'Accepted', you're all set!",
  },
  {
    question: "Can I cancel or reschedule?",
    answer: "Absolutely. Life happens. You can cancel through your dashboard, and book a new appointment when you're ready.",
  },
  {
    question: "What if I need help using the system?",
    answer: "Our support team is available during working hours. Call, email, or visit our help center — we're here for you.",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              <HugeiconsIcon icon={StethoscopeIcon} size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">DPAMS</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Pre-Registration & Appointments</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
              <a href="#how-it-works" className="transition hover:text-primary">
                How It Works
              </a>
              <a href="#faq" className="transition hover:text-primary">
                FAQ
              </a>
              <a href="#contact" className="transition hover:text-primary">
                Contact
              </a>
            </nav>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-md">
              <Link href="/register">Get Started</Link>
            </Button>
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
                  Digital pre-registration &{" "}
                  <span className="text-primary">appointments</span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Build your verified patient profile and manage your clinical appointments stress-free.
                  A unified system designed to fast-track your hospital visits.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" asChild className="h-12 rounded-md px-8 text-base">
                    <Link href="/register">
                      <HugeiconsIcon icon={Calendar01Icon} className="mr-2" size={18} />
                      Pre-Register & Book Now
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 rounded-md px-8 text-base"
                  >
                    <Link href="/login">
                      I have an account
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary" size={16} />
                    <span>24/7 access</span>
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
                      <p className="font-semibold">Welcome back, Patient</p>
                      <p className="text-sm text-muted-foreground">Your health journey starts here</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">General Checkup</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM — Confirmed</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                          <HugeiconsIcon icon={Clock01Icon} className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">Dental Cleaning</p>
                          <p className="text-sm text-muted-foreground">Dec 28, 2:00 PM — Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-primary/10 p-4 text-center">
                    <p className="text-sm font-medium text-primary">Ready to book your next visit?</p>
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
              Dual-Purpose Platform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Healthcare pre-registration and scheduling, unified
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We leverage digital pre-registration and dynamic appointment tools to eliminate manual hospital intake bottlenecks entirely.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patientBenefits.map((benefit) => (
              <Card key={benefit.title} className="group border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <HugeiconsIcon icon={benefit.icon} className="text-primary" size={28} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {benefit.description}
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
                  Clinical Pre-Registration
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Eliminate Hospital Waiting Times With <span className="text-emerald-500">Digital Pre-Registration</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Hospital front desks spend up to 25 minutes collecting manual paperwork from new patients.
                  Our pre-registration protocol lets you supply crucial details securely from home so doctors have your records before you step in.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 mt-8">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Geographic Verification</h4>
                      <p className="text-xs text-muted-foreground mt-1">Live Tanzanian administrative region and constituent district mapping.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Emergency Next-of-Kin</h4>
                      <p className="text-xs text-muted-foreground mt-1">Normalized table relations ensuring clinical security in critical moments.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Automated Completeness Check</h4>
                      <p className="text-xs text-muted-foreground mt-1">Guarantees that essential healthcare entries are 100% complete before booking.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Instant Access Activation</h4>
                      <p className="text-xs text-muted-foreground mt-1">Unlocks full digital appointment and scheduling features immediately.</p>
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
                        <h4 className="font-bold text-sm">Patient Clinical Profile</h4>
                        <p className="text-xs text-muted-foreground text-[10px]">ID: #P-29831-26</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                      Pre-Registered
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">Full Name</span>
                      <span className="font-medium text-xs">Stanslaus Ndossa</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">Geographic Region</span>
                      <span className="font-medium text-xs">Dar es Salaam (Kinondoni)</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">Emergency Next of Kin</span>
                      <span className="font-medium text-xs">Brayan Mlawa (Brother)</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground text-xs">Clinical Status</span>
                      <span className="font-medium text-xs text-emerald-500">100% Verified & Valid</span>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-500 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                        <span>Unlocked Booking Portal</span>
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
                Structured Steps
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Pre-register and schedule in minutes
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                No complicated intake forms at the clinic. Complete your pre-registration and schedule appointments seamlessly.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, index) => (
                <div key={item.title} className="relative">
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
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild className="h-12 rounded-md px-8">
                <Link href="/register">
                  Start Your Journey
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
                  Your health information is safe with us
                </h2>
                <p className="mt-4 text-primary-foreground/80">
                  We take your privacy seriously. Your medical information and personal data
                  are protected with industry-standard security measures.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                    <HugeiconsIcon icon={Shield01Icon} size={16} />
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    <span>PDPA compliant (Tanzania)</span>
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
              Got Questions?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/60 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                  {" We're Here to Help"}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Need assistance? Reach out anytime.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Whether {"you're"} having trouble booking, need to check your appointment status,
                  or just have a question — our friendly support team is ready to help.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={AiPhone01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call us</p>
                      <p className="font-semibold">+255 700 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={Mail01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email us</p>
                      <p className="font-semibold">support@pamshealth.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon icon={Clock01Icon} className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Working hours</p>
                      <p className="font-semibold">Mon — Sat, 8:00 AM — 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Card className="border-border/60">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold">Ready to get started?</h3>
                    <p className="mt-2 text-muted-foreground">
                      Join thousands of patients who have simplified their healthcare journey.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Button size="lg" asChild className="h-12 rounded-md">
                        <Link href="/register">Create Free Account</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="h-12 rounded-md">
                        <Link href="/login">Sign In</Link>
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
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={StethoscopeIcon} size={20} />
                </div>
                <div>
                  <p className="font-semibold tracking-[0.15em] text-primary uppercase">DPAMS</p>
                  <p className="text-xs text-muted-foreground">Digital Patient Pre-Registration and Appointment Management</p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                Making healthcare accessible and stress-free for every patient.
                Complete pre-registration, book slots, and stay informed — all in one place.
              </p>
            </div>

            <div>
              <p className="font-semibold">Quick Links</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/register" className="transition hover:text-primary">Create Account</Link>
                <Link href="/login" className="transition hover:text-primary">Sign In</Link>
                <a href="#how-it-works" className="transition hover:text-primary">How It Works</a>
                <a href="#faq" className="transition hover:text-primary">FAQ</a>
              </div>
            </div>

            <div>
              <p className="font-semibold">Contact</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <p>+255 700 000 000</p>
                <p>support@dpamshealth.com</p>
                <p>Mon — Sat, 8AM — 6PM</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DPAMS. Made with care for patients everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
