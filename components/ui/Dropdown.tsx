import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ trigger, children, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("relative inline-block", className)}>
      <button onClick={() => setOpen(!open)}>{trigger}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}