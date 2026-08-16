import type { ReactNode } from "react";

export type Column<T> = { key: string; label: string; render: (row: T) => ReactNode; align?: "left" | "right" };

export function DataTable<T>({ columns, rows, empty = "No records found" }: { columns: Column<T>[]; rows: T[]; empty?: string }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th key={column.key} className={column.align === "right" ? "text-right" : ""}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column.key} className={column.align === "right" ? "text-right" : ""}>{column.render(row)}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty-state">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
