import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghost-inverse";

// Rounded, elevated, with a small hover lift — transform/box-shadow/color
// only, 200ms, per the Animation PRD's micro-interaction rules. Disabled
// buttons stay flat: no lift, no shadow growth.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-turquoise text-teal-deep hover:bg-turquoise-hover",
  secondary: "bg-teal-deep text-paper hover:bg-teal-deep-hover",
  ghost: "border-2 border-ink/20 text-ink shadow-none hover:border-teal-deep hover:text-teal-deep hover:shadow-none",
  // For use on dark (teal) backgrounds — hero, CFP banner — where the ink-
  // based ghost variant above would be invisible.
  "ghost-inverse":
    "border-2 border-paper/30 text-paper shadow-none hover:border-turquoise hover:text-turquoise hover:shadow-none",
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
