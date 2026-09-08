"use client";

import { useEffect, useState } from "react";

import TimesheetFilters from "@/components/timesheets/TimesheetFilters";
import TimesheetTable from "@/components/timesheets/TimesheetTable";
import { getTimesheets } from "@/lib/api/timesheets";
import type { Timesheet } from "@/types/timesheet";
import TimesheetPagination from "@/components/timesheets/TimesheetPagination";

export default function DashboardPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(5);

const [pagination, setPagination] = useState({
  page: 1,
  pageSize: 5,
  total: 0,
  totalPages: 1,
});

  useEffect(() => {
  async function loadTimesheets() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getTimesheets({
        page,
        pageSize: 5,
        status,
        startDate,
        endDate,
      });

     setTimesheets(response.data);
setPagination(response.pagination);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  loadTimesheets();
}, [page, pageSize,status, startDate, endDate]);

  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-17 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="text-[24px] font-semibold text-[#111928]">
              ticktock
            </span>

            <span className="text-sm text-[#111827]">
              Timesheets
            </span>
          </div>

          <button
            type="button"
            className="text-[16px] text-[#6B7280] font-medium"
          >
            John Doe
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] p-7">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-[24px] font-bold text-[#111928]">
            Your Timesheets
          </h1>

          <div className="mt-6">
          <TimesheetFilters
    status={status}
    startDate={startDate}
    endDate={endDate}
    onStatusChange={(value) => {
      setStatus(value);
      setPage(1);
    }}
    onStartDateChange={(value) => {
      setStartDate(value);
      setPage(1);
    }}
    onEndDateChange={(value) => {
      setEndDate(value);
      setPage(1);
    }}
  />

  {isLoading && (
    <p className="py-10 text-center text-sm text-gray-500">
      Loading timesheets...
    </p>
  )}

            {!isLoading && error && (
              <p className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </p>
            )}

           {!isLoading && !error && (
  <>
    <TimesheetTable timesheets={timesheets} />

    <div className="mt-6">
      <TimesheetPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
      />
    </div>
  </>
)}
          </div>
        </section>

        <footer className="mt-4 rounded-lg border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-xs text-[#6B7280]">
            © 2024 tentwenty. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}