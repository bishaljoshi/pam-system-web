'use client';

interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, lastPage, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4 text-black">
      {/* Left: Total */}
      <div className="text-sm text-gray-600">
        Total: <strong>{total || 0}</strong> records
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm">
          Page <strong>{page}</strong> of <strong>{lastPage}</strong>
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= lastPage}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
