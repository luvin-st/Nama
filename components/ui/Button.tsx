import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "lime" | "tint" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-on-primary",
  lime: "bg-lime text-lime-ink",
  tint: "bg-chip text-ink",
  ghost: "bg-transparent text-link font-medium",
};

const BASE =
  "flex h-[52px] w-full items-center justify-center rounded-[14px] text-[17px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-45";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest} />;
}

type LinkButtonProps = { href: string; variant?: Variant; className?: string; children: ReactNode };

export function LinkButton({ href, variant = "primary", className = "", children }: LinkButtonProps) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}
