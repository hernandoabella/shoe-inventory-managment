import * as React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "error"> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-xs font-medium text-gray-600">
            {label}
          </label>
        )}
        <input
          className={`flex w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
