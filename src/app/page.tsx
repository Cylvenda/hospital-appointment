import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const patientBenefits = [
  {
    title: "Book appointments online",
    description: "Request an appointment without needing to visit the hospital first or wait in long lines.",
  },
  {
    title: "Track your appointment status",
    description: "See whether your appointment is pending, accepted, completed, or cancelled from your dashboard.",
  },
  {
    title: "Stay informed",
    description: "Receive updates and manage your appointment information in one simple place.",
  },
]

const patientSteps = [
  {
    title: "Create your account",
    description: "Sign up using your email, phone number, and password to start using the patient system.",
  },
  {
    title: "Sign in to your patient dashboard",
    description: "After logging in, you will see your appointments, updates, and the actions available to you.",
  },
  {
    title: "Book an appointment",
    description: "Choose the appointment details and submit your request through the system.",
  },
  {
    title: "Wait for updates",
    description: "Your appointment status will be updated by the hospital team, and you can check it anytime.",
  },
]

const dashboardHighlights = [
  "View recent appointments",
  "Check pending, accepted, and cancelled requests",
  "Book your next appointment faster",
  "Follow updates from one dashboard",
]

const appointmentJourney = [
  {
    stage: "Stage 1",
    title: "Create your patient account",
    description:
      "Start by registering with your email, phone number, and password so you can access the patient dashboard.",
    status: "Getting started",
  },
  {
    stage: "Stage 2",
    title: "Sign in and open your dashboard",
    description:
      "After logging in, you can see your appointment area and begin the process of creating a new appointment request.",
    status: "Dashboard access",
  },
  {
    stage: "Stage 3",
    title: "Submit your appointment request",
    description:
      "Fill in the appointment details and send your request through the system for the hospital team to review.",
    status: "Request sent",
  },
  {
    stage: "Stage 4",
    title: "Wait while the request is pending",
    description:
      "Your appointment first appears as pending, which means it has been received and is waiting for confirmation.",
    status: "Pending",
  },
  {
    stage: "Stage 5",
    title: "Receive approval or changes",
    description:
      "If the appointment is accepted, you can prepare for your visit. If it is cancelled, you can check the update and create another request if needed.",
    status: "Accepted or cancelled",
  },
  {
    stage: "Stage 6",
    title: "Attend and complete the appointment",
    description:
      "After the visit is finished, the appointment can move to completed, showing that the process has reached its final stage.",
    status: "Completed",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_28%),linear-gradient(180deg,var(--background)_0%,var(--muted)_45%,var(--background)_100%)] text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              PA
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">PAMS</p>
              <p className="text-sm text-muted-foreground">Patient Appointment System</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
              <a href="#about" className="transition hover:text-primary">
                About Us
              </a>
              <a href="#contact" className="transition hover:text-primary">
                Contact Us
              </a>
            </nav>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/register">Create account</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                Book, follow, and manage your hospital appointments with ease.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                This platform is made for patients. It helps you create an account, request appointments, and check
                updates from your dashboard without confusion.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-12 rounded-full px-6">
                  <Link href="/register">Create patient account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 rounded-full border-border bg-card/80 px-6 hover:bg-accent"
                >
                  <Link href="/login">I already have an account</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {patientBenefits.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-tl-3xl border border-border bg-card/85 p-5 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.16)] backdrop-blur"
                  >
                    <p className="text-base font-semibold text-card-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.16)] backdrop-blur">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                What patients can do
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Your dashboard helps you stay in control.</h2>

              <div className="mt-6 space-y-3">
                {dashboardHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-muted px-4 py-4 text-sm text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-primary p-5 text-primary-foreground">
                <p className="text-sm text-primary-foreground/80">Patient note</p>
                <p className="mt-2 text-base leading-7">
                  Once you sign in, the system helps you follow your appointment journey step by step instead of making
                  you guess what happens next.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border bg-card/85 p-7 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.16)] backdrop-blur">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                About Us
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">We built this system to make patient care easier to access.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  PAMS is a patient appointment platform created to reduce confusion during the booking process and give
                  patients a simpler way to connect with hospital services.
                </p>
                <p>
                  Our goal is to help patients move from registration to appointment follow-up with clear steps,
                  understandable status updates, and a dashboard that is easy to use on both phone and desktop.
                </p>
                <p>
                  We focus on making healthcare interactions feel more organized, transparent, and convenient for every patient.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-primary p-7 text-primary-foreground shadow-[0_24px_70px_-30px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">Our promise</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Clear communication at every step.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-primary-foreground/90">
                <p>Patients should not have to guess what to do next after creating an account or requesting care.</p>
                <p>That is why the system explains the process clearly, shows appointment status updates, and keeps important actions easy to find.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border bg-card/85 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.16)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
              How patients use the system
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A clear process from registration to appointment updates.
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {patientSteps.map((step, index) => (
                <Card key={step.title} className="rounded-3xl border-border bg-card shadow-none">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      0{index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-card-foreground">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-border bg-card/85 p-7 shadow-[0_18px_55px_-36px_rgba(15,23,42,0.16)] backdrop-blur">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Why this helps patients
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Less confusion, more clarity.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Instead of depending only on phone calls or physical visits, you can use the system to request care
                  and follow your appointment progress online.
                </p>
                <p>
                  The dashboard is designed to show your latest appointments and their status clearly, so you can know
                  what is pending, what has been accepted, and what has changed.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-secondary p-7 text-secondary-foreground shadow-[0_24px_70px_-30px_rgba(15,23,42,0.16)]">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Start here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">New patient or returning patient?</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  If you are new, create an account first. After that, sign in and go to your patient dashboard to
                  book your appointment.
                </p>
                <p>
                  If you already registered, just sign in and continue managing your appointments from where you left
                  off.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-12 rounded-full px-6">
                  <Link href="/register">Create account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 rounded-full border-border bg-background/40 px-6 hover:bg-accent"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border bg-card/85 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.16)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
              Appointment Journey
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From creating an appointment to the final stage.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              This guide shows patients what happens after they start using the system, including the important status
              changes they will see in their dashboard.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {appointmentJourney.map((item) => (
                <Card key={item.title} className="rounded-3xl border-border bg-card shadow-none">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                      {item.stage}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-card-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <div className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {item.status}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-border bg-card/85 p-7 shadow-[0_18px_55px_-36px_rgba(15,23,42,0.16)] backdrop-blur">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Contact Us
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Need help with your account or appointment?</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                If you have trouble registering, signing in, or understanding your appointment status, our team is here to help.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-border bg-muted p-5">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="mt-1 text-base font-semibold text-card-foreground">+255 700 000 000</p>
                </div>
                <div className="rounded-3xl border border-border bg-muted p-5">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="mt-1 text-base font-semibold text-card-foreground">support@pamshealth.com</p>
                </div>
                <div className="rounded-3xl border border-border bg-muted p-5">
                  <p className="text-sm text-muted-foreground">Working Hours</p>
                  <p className="mt-1 text-base font-semibold text-card-foreground">Monday - Saturday, 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-primary p-7 text-primary-foreground shadow-[0_24px_70px_-30px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">Patient support</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Reach out when you need guidance.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-primary-foreground/90">
                <p>
                  Contact us if you are unsure how to create your account, submit an appointment request, or read the update shown in your dashboard.
                </p>
                <p>
                  We want patients to feel supported while using the system, especially during their first visit to the platform.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-12 rounded-full bg-background px-6 text-foreground hover:bg-background/90">
                  <Link href="/register">Get started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 rounded-full border-primary-foreground/20 bg-primary-foreground/5 px-6 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/login">Go to sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border bg-card/70 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                PA
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">PAMS</p>
                <p className="text-sm text-muted-foreground">Patient Appointment System</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A patient-friendly platform for registering, booking appointments, and following hospital updates with clarity.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-foreground uppercase">Quick Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/register" className="transition hover:text-primary">
                Create Account
              </Link>
              <Link href="/login" className="transition hover:text-primary">
                Sign In
              </Link>
              <a href="#about" className="transition hover:text-primary">
                About Us
              </a>
              <a href="#contact" className="transition hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-foreground uppercase">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>+255 700 000 000</p>
              <p>support@pamshealth.com</p>
              <p>Monday - Saturday, 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PAMS. Built to make patient appointment management simpler and clearer.
        </div>
      </footer>
    </div>
  )
}
