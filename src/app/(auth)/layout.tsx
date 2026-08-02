import type { ReactNode } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { BrandIcon } from "@/components/pwa/brand-icon"
import Image from "next/image"

export default function AuthLayout({ children }: { children: ReactNode }) {
     return (
          <div className="min-h-dvh flex items-center justify-center bg-linear-to-r from-primary to-chart-3 p-3 sm:p-4">

               <Card className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl border-0">


                     {/* RIGHT SIDE (IMAGE) */}
                     <div className="relative hidden md:block">
                          <Image
                               src="/meeet.webp"
                               alt="DPAMS"
                               fill
                               sizes="(max-width: 768px) 100vw, 50vw"
                               className="rounded-2xl dark:invert dark:hue-rotate-180 dark:opacity-90 dark:brightness-95 transition-all duration-300"
                               priority
                          />
                     </div>

                    {/* LEFT SIDE (FORM) */}
                    <div className="flex min-w-0 items-center justify-center p-5 sm:p-8 lg:p-10">
                         <div className="w-full max-w-md space-y-6">
                              <Link
                                   href="/"
                                   className="inline-flex items-center gap-3 transition hover:opacity-90"
                              >
                                   <BrandIcon priority />
                                   <div>
                                        <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                                             DPAMS
                                        </p>
                                   </div>
                              </Link>

                              {children}

                         </div>
                    </div>

               </Card>
          </div>
     )
}
