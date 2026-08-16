import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className={cn("w-full overflow-auto", className)}>
    <table {...props} />
  </div>
);

export const TableHeader = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("[&_tr]:bg-gray-50", className)}>{children}</thead>
);

export const TableBody = ({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-border hover:bg-gray-100" {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <th
    scope="col"
    className="h-12 px-4 text-left align-middle text-gray-500 font-medium"
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="p-4 align-middle" {...props}>
    {children}
  </td>
);