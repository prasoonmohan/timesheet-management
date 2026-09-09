"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type TimesheetPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function TimesheetPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TimesheetPaginationProps) {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex items-center justify-between">
      {/* Page size */}
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(event) => {
            onPageSizeChange(Number(event.target.value));
          }}
          className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#4A5565] outline-none transition focus:border-[#1C64F2]"
          aria-label="Rows per page"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>

        <span className="text-sm text-[#6B7280]">
          {total} {total === 1 ? "week" : "weeks"}
        </span>
      </div>

      {/* Pagination */}
      <div className="flex h-10 overflow-hidden rounded-md border border-[#E5E7EB]">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center px-3 text-sm text-[#4A5565] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:text-[#A0AEC0]"
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-10 border-l border-[#E5E7EB] px-3 text-sm font-medium transition ${
              pageNumber === page
                ? "bg-[#F9FAFB] text-[#1447E6]"
                : "bg-white text-[#4A5565] hover:bg-[#F9FAFB]"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center border-l border-[#E5E7EB] px-3 text-sm text-[#4A5565] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:text-[#A0AEC0]"
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}