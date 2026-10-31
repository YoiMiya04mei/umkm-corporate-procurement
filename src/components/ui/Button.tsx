import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none rounded-lg";

    const variants = {
      primary:
        "bg-corporate-navy text-white hover:bg-corporate-blue focus:ring-corporate-blue shadow-corporate",
      secondary:
        "bg-corporate-blue text-white hover:bg-corporate-blue-hover focus:ring-corporate-blue shadow-sm",
      gold:
        "bg-corporate-gold text-corporate-navy font-semibold hover:bg-corporate-gold-hover focus:ring-corporate-gold shadow-gold hover:shadow-md",
      outline:
        "border border-corporate-navy/20 text-corporate-navy hover:bg-corporate-light-gray focus:ring-corporate-navy",
      ghost:
        "text-corporate-navy hover:bg-corporate-light-gray focus:ring-corporate-navy",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

