"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
} from "lucide-react";

import {
  getTimesheet,
  createTimesheet,
} from "@/lib/api/timesheets";
import type {
  Timesheet,
  TimesheetEntry,
} from "@/types/timesheet";
import TimesheetEntryEditor from "@/components/timesheets/TimesheetEntryEditor";
import { useToast } from "@/components/ui/ToastProvider";

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

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${end.getFullYear()}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${end.getFullYear()}`;
}

function getDaysBetween(
  startDate: string,
  endDate: string
) {
  const days: string[] = [];

  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (current <= end) {
   days.push(
  [
    current.getFullYear(),
    String(current.getMonth() + 1).padStart(2, "0"),
    String(current.getDate()).padStart(2, "0"),
  ].join("-")
);

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export default function CreateTimesheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [timesheet, setTimesheet] =
    useState<Timesheet | null>(null);

  const [entries, setEntries] = useState<TimesheetEntry[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();

    const router = useRouter();

  useEffect(() => {
    async function loadTimesheet() {
      try {
        const { id } = await params;

        const response = await getTimesheet(id);

        if (response.data.status !== "missing") {
  setError(
    "Only missing timesheets can be created."
  );
  return;
}

setTimesheet(response.data);
setEntries([]);
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

  const totalHours = useMemo(
    () =>
      entries.reduce(
        (total, entry) =>
          total + Number(entry.hours || 0),
        0
      ),
    [entries]
  );

  const progress = Math.min(
    (totalHours / 40) * 100,
    100
  );

  const days = timesheet
    ? getDaysBetween(
        timesheet.startDate,
        timesheet.endDate
      )
    : [];

async function handleSave() {
  if (!timesheet) {
    return;
  }

  if (entries.length === 0) {
    setError("Please add at least one timesheet entry.");
    return;
  }

  setIsSaving(true);
  setError("");
  setSuccess("");

  try {
    const response = await createTimesheet(
      timesheet.id,
      entries
    );

    setTimesheet(response.data);
    setEntries(response.data.entries);

    setSuccess("Timesheet created successfully.");
    showToast("Timesheet created successfully.");

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create timesheet";
    setError(message);
    showToast(message, "error");
  } finally {
    setIsSaving(false);
  }
}

  return (
    <>
      <div className="mx-auto max-w-[1280px] p-4 sm:p-7">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#1C64F2] hover:text-[#1447E6]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Timesheets
        </Link>

        {isLoading && (
          <section aria-label="Loading timesheet" className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><div className="h-8 w-1/3 animate-pulse rounded bg-gray-100" /><div className="h-40 animate-pulse rounded bg-gray-100" /></section>
        )}

        {!isLoading && error && !timesheet && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </section>
        )}

        {!isLoading && timesheet && (
          <>
            <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-[24px] font-bold text-[#111928]">
                    This week&apos;s timesheet
                  </h1>

                  <p className="mt-6 text-xs text-[#6B7280]">
                    {formatDateRange(
                      timesheet.startDate,
                      timesheet.endDate
                    )}
                  </p>
                </div>

                <div className="w-full sm:w-[188px]">
                  <div className="flex items-center justify-between  text-[#6B7280]">
                    <span className="font-medium text-[#111928] text-[14px]">
                      {totalHours}/40 hrs
                    </span>

                    <span className="text-[12px] font-medium text-[#6B7280]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden bg-[#E5E7EB] rounded-sm">
                    <div
                      className="h-full bg-[#FF8A4C] rounded-sm transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <TimesheetEntryEditor
                days={days}
                entries={entries}
                onEntriesChange={setEntries}
              />

              <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-[#6B7280]">
                    Total hours
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#111928]">
                    {totalHours} hrs
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/dashboard"
                    className="rounded-md border border-[#D1D5DB] px-4 py-2 text-xs font-medium text-[#4A5565] hover:bg-[#F9FAFB] flex justify-center items-center"
                  >
                    Cancel
                  </Link>

                  <button
                    type="button"
                    onClick={handleSave}
                     disabled={isSaving || entries.length === 0}
                    className="rounded-md bg-[#1C64F2] px-5 py-2 text-xs font-medium text-white hover:bg-[#1447E6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                   {isSaving
  ? "Creating..."
  : "Create timesheet"}
                  </button>
                </div>
              </div>

              {success && (
                <p className="mt-4 rounded-md bg-[#DEF7EC] p-3 text-sm text-[#03543F]">
                  {success}
                </p>
              )}

              {error && timesheet && (
                <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </section>
          </>
        )}

      </div>
    </>
  );
}
