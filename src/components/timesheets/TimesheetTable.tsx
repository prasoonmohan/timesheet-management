import type { Timesheet } from "@/types/timesheet";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

function formatDateRange(startDate: string, endDate: string) {
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

export default function TimesheetTable({
  timesheets,
}: TimesheetTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse border border-[#E5E7EB]">
        <thead>
          <tr className="h-[54px] border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <th className="w-[160px] px-3 text-left text-[12px] font-semibold uppercase tracking-normal text-[#6B7280]">
              Week #
            </th>

            <th className="px-3 text-left text-[12px] font-semibold uppercase tracking-normal text-[#6B7280]">
              Date
            </th>

            <th className="w-[180px] px-3 text-left text-[12px] font-semibold uppercase tracking-normal text-[#6B7280]">
              Status
            </th>

            <th className="w-[160px] px-3 text-center text-[12px] font-semibold uppercase tracking-normal text-[#6B7280]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {timesheets.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-12 text-center">
                <p className="text-sm font-medium text-[#111928]">
                  No timesheets found
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Try adjusting your filters to see more results.
                </p>
              </td>
            </tr>
          ) : (
            timesheets.map((timesheet) => (
            <tr
              key={timesheet.id}
              className="h-[64px] border-b border-[#E5E7EB] last:border-b-0"
            >
              <td className="px-3 text-sm font-normal text-[#111928]">
                {timesheet.weekNumber}
              </td>

              <td className="px-3 text-sm font-normal text-[#6B7280]">
                {formatDateRange(
                  timesheet.startDate,
                  timesheet.endDate
                )}
              </td>

              <td className="px-3">
                <StatusBadge status={timesheet.status} />
              </td>

              <td className="p-3 text-center">
  {timesheet.status === "completed" ? (
    <Link
      href={`/dashboard/timesheets/${timesheet.id}`}
      className="text-[16px] font-normal text-[#1C64F2] transition hover:text-[#1C64F2]/80"
    >
      View
    </Link>
  ) : timesheet.status === "incomplete" ? (
    <Link
      href={`/dashboard/timesheets/${timesheet.id}/edit`}
      className="text-[16px] font-normal text-[#1C64F2] transition hover:text-[#1C64F2]/80"
    >
      Update
    </Link>
  ) : (
  <Link
  href={`/dashboard/timesheets/${timesheet.id}/create`}
  className="text-[16px] font-normal text-[#1C64F2] transition hover:text-[#1C64F2]/80"
>
  Create
</Link>
  )}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
