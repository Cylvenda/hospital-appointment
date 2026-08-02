import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandIconProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandIcon({ className, size = 40, priority = false }: BrandIconProps) {
  return (
    <Image
      src="/icons/icon-192x192.png"
      alt="DPAMS"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 rounded-[22%]", className)}
    />
  );
}
