import Link from "next/link";
import type { ReactNode } from "react";

type ActionButtonProps = {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "soft";
  disabled?: boolean;
  ariaLabel?: string;
};

const variantClasses = {
  primary: "bg-leaf text-white shadow-soft hover:bg-[#5f9776]",
  secondary: "bg-berry text-white shadow-soft hover:bg-[#9d5062]",
  soft: "bg-white text-ink shadow-soft hover:bg-mint",
};

export function ActionButton({
  href,
  children,
  onClick,
  variant = "primary",
  disabled,
  ariaLabel,
}: ActionButtonProps) {
  const className = `inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-5 py-3 text-center text-base font-black transition focus:outline-none focus:ring-4 focus:ring-peach disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <span className={className} aria-label={ariaLabel} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
