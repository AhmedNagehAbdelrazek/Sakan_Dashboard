import Image from "next/image";
import Link from "next/link";
import { appConfig } from "@/config/app.config";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  showText?: boolean;
}

export function BrandLogo({ href, className, showText = true }: BrandLogoProps) {
  const { name, logoPath } = appConfig.branding;

  return (
    <Link
      href={href ?? "/admin"}
      className={cn("flex items-center gap-2 font-semibold", className)}
    >
      {logoPath ? (
        <Image
          src={logoPath}
          alt={name}
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-md object-contain"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      {showText && <span className="truncate">{name}</span>}
    </Link>
  );
}
