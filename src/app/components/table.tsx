// components/Table.tsx
import React from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow bg-white">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-black uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-black">
                    {col.render
                      ? col.render(row[col.key], row, rowIndex)
                      : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-400">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
