import { Button } from "@/components/ui/button"
import Link from "next/link"

const Page = () => {
     return (
          <div className="flex flex-row items-center justify-center w-screen mt-auto">
               <Button ><Link href="/register">Register</Link></Button>
               <Button><Link href="/login">Login</Link></Button>
          </div>
     )
}

export default Page