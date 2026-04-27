import * as React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./table";
import { cn } from "@/lib/utils";

export interface AppTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface AppTableProps {
  columns: AppTableColumn[];
  children: React.ReactNode;
  className?: string;
}

export function AppTable({ columns, children, className }: AppTableProps) {
  return (
    <div className={cn("border rounded-lg overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead
                key={c.key}
                className={cn(
                  c.align === "center" && "text-center",
                  c.align === "right" && "text-right",
                  c.width
                )}
              >
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

interface ActionCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionCell({ children, className }: ActionCellProps) {
  return (
    <td className={cn("px-3 w-20", className)}>
      <div className="flex gap-1">{children}</div>
    </td>
  );
}
