import type { TimesheetStatus } from "@/types/timesheet";

const styles: Record<TimesheetStatus, string> = {
  completed: "bg-[#DEF7EC] text-[#03543F]",
  incomplete: "bg-[#FDF6B2] text-[#723B13]",
  missing: "bg-[#FCE8F3] text-[#99154B]",
};

const labels: Record<TimesheetStatus, string> = {
  completed: "COMPLETED",
  incomplete: "INCOMPLETE",
  missing: "MISSING",
};

export default function StatusBadge({
  status,
}: {
  status: TimesheetStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
