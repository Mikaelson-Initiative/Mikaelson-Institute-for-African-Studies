import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghost-inverse";

// Rounded, elevated, with a small hover lift — transform/box-shadow/color
// only, 200ms, per the Animation PRD's micro-interaction rules. Disabled
// buttons stay flat: no lift, no shadow growth.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-sans font-semibold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-white text-[#2e4b46] shadow-[inset_0px_0px_30px_0px_#2e4b46] border border-black/5 hover:shadow-[inset_0px_0px_40px_0px_#2e4b46]",
  secondary: "bg-[#2e4b46] text-white shadow-[inset_0px_0px_30px_0px_rgba(255,255,255,0.2)] border border-white/10",
  ghost: "bg-transparent text-[#2e4b46] border-2 border-[#2e4b46]/20 hover:border-[#2e4b46]",
  "ghost-inverse":
    "bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/5",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
