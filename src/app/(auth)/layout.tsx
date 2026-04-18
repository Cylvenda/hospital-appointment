import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function AuthLayout({ children }: { children: ReactNode }) {
     return (
          <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-primary to-chart-3 p-4">

               <Card className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl border-0">


                    {/* RIGHT SIDE (IMAGE) */}
                    <div className="relative left-4  hidden md:block">
                         <Image
                              src="/meeet.webp"
                              alt="Meeting Background"
                              fill
                              className=" rounded-2xl "
                              priority
                         />
                    </div>

                    {/* LEFT SIDE (FORM) */}
                    <div className="flex items-center justify-center p-10">
                         <div className="w-full max-w-md space-y-6">
                              <Link
                                   href="/"
                                   className="inline-flex items-center gap-3 transition hover:opacity-90"
                              >
                                   <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                                        PA
                                   </div>
                                   <div>
                                        <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                                             PAMS
                                        </p>
                                   </div>
                              </Link>

                              {children}

                              {/* <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                   <Separator className="flex-1 bg-accent" />
                                   <span>or continue with</span>
                                   <Separator className="flex-1 bg-accent" />
                              </div> */}

                              {/*  Google / GitHub / Apple buttons */}
                              {/* <div className="grid grid-cols-3 gap-3">

                                   <button className="flex items-center justify-center gap-2 border rounded-md py-2 text-sm hover:bg-muted transition">
                                        <Image src="/google.png" alt="Google" width={18} height={18} />
                                        Google
                                   </button>

                                   <button className="flex items-center justify-center gap-2 border rounded-md py-2 text-sm hover:bg-muted transition">
                                        <Image src="/apple.svg" alt="Apple" width={18} height={18} />
                                        Apple
                                   </button>

                                   <button className="flex items-center justify-center gap-2 border rounded-md py-2 text-sm hover:bg-muted transition">
                                        <Image src="/github.png" alt="GitHub" width={18} height={18} />
                                        GitHub
                                   </button>

                              </div> */}

                         </div>
                    </div>

               </Card>
          </div>
     )
}
