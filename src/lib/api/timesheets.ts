import type { TimesheetsResponse } from "@/types/timesheet";

interface GetTimesheetsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function getTimesheets(
  params: GetTimesheetsParams = {}
): Promise<TimesheetsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.startDate) {
    searchParams.set("startDate", params.startDate);
  }

  if (params.endDate) {
    searchParams.set("endDate", params.endDate);
  }

  const query = searchParams.toString();

  const response = await fetch(
    `/api/timesheets${query ? `?${query}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch timesheets");
  }

  return result;
}