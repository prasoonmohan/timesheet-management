import type { Timesheet } from "@/types/timesheet";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const startMonth = start.toLocaleString("en-US", {
    month: "short",
  });

  const endMonth = end.toLocaleString("en-US", {
    month: "short",
  });

  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${year}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`;
}

function getStatusLabel(status: Timesheet["status"]) {
  switch (status) {
    case "completed":
      return "COMPLETED";

    case "incomplete":
      return "INCOMPLETE";

    case "missing":
      return "MISSING";
  }
}

function getActionLabel(status: Timesheet["status"]) {
  switch (status) {
    case "completed":
      return "View";

    case "incomplete":
      return "Update";

    case "missing":
      return "Create";
  }
}

export default function TimesheetTable({
  timesheets,
}: TimesheetTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse border border-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-[#F9FAFB]">
            <th className="px-2.5 py-4 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
              Week #
            </th>

            <th className="px-2.5 py-4 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
              Date
            </th>

            <th className="px-2.5 py-4 text-left text-[12px] font-semibold uppercase text-[#6B7280]">
              Status
            </th>

            <th className="px-2.5 py-4 text-center text-[12px] font-semibold uppercase text-[#6B7280]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {timesheets.map((timesheet) => (
            <tr
              key={timesheet.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="p-4 text-sm text-[#111928]">
                {timesheet.weekNumber}
              </td>

              <td className="p-4 text-sm text-[#6B7280]">
                {formatDateRange(
                  timesheet.startDate,
                  timesheet.endDate
                )}
              </td>

              <td className="p-4">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium tracking-wide ${
                    timesheet.status === "completed"
                      ? "bg-[#DEF7EC] text-[#03543F]"
                      : timesheet.status === "incomplete"
                        ? "bg-[#FDF6B2] text-[#723B13]"
                        : "bg-[#FCE8F3] text-[#99154B]"
                  }`}
                >
                  {getStatusLabel(timesheet.status)}
                </span>
              </td>

              <td className="p-4 text-center">
                <button
                  type="button"
                  className="text-[16px] font-normal text-[#1C64F2] transition hover:text-[#1C64F2]/80"
                >
                  {getActionLabel(timesheet.status)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}