"use client";

import { useEffect, useState } from "react";

import TimesheetFilters from "@/components/timesheets/TimesheetFilters";
import TimesheetPagination from "@/components/timesheets/TimesheetPagination";
import TimesheetTable from "@/components/timesheets/TimesheetTable";
import { getTimesheets } from "@/lib/api/timesheets";
import type { Timesheet } from "@/types/timesheet";
import { useToast } from "@/components/ui/ToastProvider";

export default function DashboardPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const { showToast } = useToast();

  useEffect(() => {
    async function loadTimesheets() {
      try {
        setIsLoading(true);
        setError("");

        const response = await getTimesheets({
          page,
          pageSize,
          status,
          startDate,
          endDate,
        });

        setTimesheets(response.data);
        setPagination(response.pagination);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong";
        setError(message);
        showToast(message, "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadTimesheets();
  }, [page, pageSize, status, startDate, endDate, showToast]);

  return (
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-8">
        <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-[24px] font-bold leading-8 text-[#111928]">
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

            {isLoading && <div aria-label="Loading timesheets" className="space-y-3 py-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-14 animate-pulse rounded bg-[#F3F4F6]" />)}</div>}

            {!isLoading && error && (
              <p className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {!isLoading && !error && (
              <>
                <TimesheetTable timesheets={timesheets} />

                {pagination.total > 0 && (
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
                )}
              </>
            )}
          </div>
        </section>

      </div>
  );
}
