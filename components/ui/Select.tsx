import * as React from "react";

interface SelectProps extends React.ComponentPropsWithoutRef<"div"> {}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={`inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export { Select };