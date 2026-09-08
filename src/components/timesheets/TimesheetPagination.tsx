"use client";

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
          className="h-9 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] pl-2 pr-0 text-sm text-[#4A5565] outline-none focus:border-blue-500"
          aria-label="Rows per page"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* Pagination */}
      <div className="flex items-center rounded-md border border-[#E5E7EB] h-9">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-full px-3 text-sm text-[#4A5565] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-40 border-r border-[#E5E7EB]"
        >
          Previous
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`h-9 min-w-9 px-2 font-medium text-sm transition border-y border-[#E5E7EB] ${
              pageNumber === page
                ? " bg-[#F9FAFB] text-[#1447E6]"
                : " bg-white text-[#4A5565] hover:bg-[#F3F4F6]"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-full px-3 text-sm text-[#4A5565] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-40 border-l border-[#E5E7EB]"
        >
          Next
        </button>
      </div>
    </div>
  );
}