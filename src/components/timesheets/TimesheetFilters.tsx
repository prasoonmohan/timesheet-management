"use client";

interface TimesheetFiltersProps {
  status: string;
  startDate: string;
  endDate: string;
  onStatusChange: (status: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function TimesheetFilters({
  status,
  startDate,
  endDate,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
}: TimesheetFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-2.5">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="start-date"
          className="text-sm font-normal text-[#6B7280]"
        >
          From
        </label>

        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(event) =>
            onStartDateChange(event.target.value)
          }
      className="h-10 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#6B7280]outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="end-date"
          className="text-sm font-normal text-[#6B7280]"
        >
          To
        </label>

        <input
          id="end-date"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(event) =>
            onEndDateChange(event.target.value)
          }
          className="h-10 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#6B7280]outline-none transition focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="status"
          className="text-sm font-normal text-[#6B7280]"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="h-10.5 min-w-[140px] rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111928] outline-none transition focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      {(status || startDate || endDate) && (
        <button
          type="button"
          onClick={() => {
            onStatusChange("");
            onStartDateChange("");
            onEndDateChange("");
          }}
          className="h-10 px-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}