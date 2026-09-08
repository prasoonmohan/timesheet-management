export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface TimesheetEntry {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  workType: string;
  description: string;
  hours: number;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
  entries: TimesheetEntry[];
}

export interface TimesheetPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TimesheetsResponse {
  success: boolean;
  data: Timesheet[];
  pagination: TimesheetPagination;
  error?: string;
}