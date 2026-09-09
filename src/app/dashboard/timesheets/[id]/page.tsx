"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getTimesheet } from "@/lib/api/timesheets";
import type { Timesheet } from "@/types/timesheet";
import StatusBadge from "@/components/ui/StatusBadge";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatDateRange(
  startDate: string,
  endDate: string
) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const startMonth = start.toLocaleString("en-US", {
    month: "long",
  });

  const endMonth = end.toLocaleString("en-US", {
    month: "long",
  });

  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${year}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`;
}

export default function TimesheetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [timesheet, setTimesheet] =
    useState<Timesheet | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTimesheet() {
      try {
        setIsLoading(true);
        setError("");

        const { id } = await params;
        const response = await getTimesheet(id);

        setTimesheet(response.data);
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

    loadTimesheet();
  }, [params]);

  return (
      <div className="mx-auto max-w-[1280px] p-7">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#1C64F2] hover:text-[#1447E6]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Timesheets
        </Link>

        {isLoading && (
          <section className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading timesheet...
            </p>
          </section>
        )}

        {!isLoading && error && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </section>
        )}

        {!isLoading && !error && timesheet && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-[24px] font-bold text-[#111928]">
                  Timesheet Details
                </h1>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Week #{timesheet.weekNumber} ·{" "}
                  {formatDateRange(
                    timesheet.startDate,
                    timesheet.endDate
                  )}
                </p>
              </div>

              <StatusBadge status={timesheet.status} />
            </div>

            <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  Week
                </p>

                <p className="mt-1 text-sm text-[#111928]">
                  Week #{timesheet.weekNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  Total Hours
                </p>

                <p className="mt-1 text-sm text-[#111928]">
                  {timesheet.totalHours} hours
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  Start Date
                </p>

                <p className="mt-1 text-sm text-[#111928]">
                  {formatDate(timesheet.startDate)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  End Date
                </p>

                <p className="mt-1 text-sm text-[#111928]">
                  {formatDate(timesheet.endDate)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-[#111928]">
                Timesheet Entries
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                      <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
                        Project
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
                        Work Type
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
                        Description
                      </th>

                      <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase text-[#6B7280]">
                        Hours
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {timesheet.entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="p-4 text-sm text-[#111928]">
                          {formatDate(entry.date)}
                        </td>

                        <td className="p-4 text-sm text-[#111928]">
                          {entry.projectName}
                        </td>

                        <td className="p-4 text-sm text-[#6B7280]">
                          {entry.workType}
                        </td>

                        <td className="p-4 text-sm text-[#6B7280]">
                          {entry.description}
                        </td>

                        <td className="p-4 text-right text-sm font-medium text-[#111928]">
                          {entry.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </div>
  );
}