import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold uppercase tracking-wider text-corporate-navy">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={generatedId}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-corporate-text placeholder:text-gray-400 transition-colors focus:border-corporate-blue focus:outline-none focus:ring-2 focus:ring-corporate-blue/20 disabled:cursor-not-allowed disabled:bg-gray-50",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const generatedId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold uppercase tracking-wider text-corporate-navy">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={generatedId}
          rows={rows}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-corporate-text placeholder:text-gray-400 transition-colors focus:border-corporate-blue focus:outline-none focus:ring-2 focus:ring-corporate-blue/20 disabled:cursor-not-allowed disabled:bg-gray-50 resize-y",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, children, ...props }, ref) => {
    const generatedId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold uppercase tracking-wider text-corporate-navy">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={generatedId}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-corporate-text transition-colors focus:border-corporate-blue focus:outline-none focus:ring-2 focus:ring-corporate-blue/20 disabled:cursor-not-allowed disabled:bg-gray-50",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
