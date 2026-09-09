import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1C64F2] text-white hover:bg-[#1447E6]",
  secondary:
    "border border-[#D1D5DB] text-[#4A5565] hover:bg-[#F9FAFB]",
  ghost:
    "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111928]",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}
