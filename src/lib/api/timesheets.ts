import type {
  Timesheet,
  TimesheetResponse,
  TimesheetsResponse,
} from "@/types/timesheet";

async function parseResponse(response: Response) {
  const result: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof result === "object" && result && "error" in result && typeof result.error === "string" ? result.error : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return result;
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  try { return await parseResponse(await fetch(input, init)) as T; }
  catch (error) {
    if (error instanceof TypeError) throw new Error("Unable to reach the server. Please try again.");
    throw error instanceof Error ? error : new Error("Unable to reach the server. Please try again.");
  }
}

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

  return request<TimesheetsResponse>(
    `/api/timesheets${query ? `?${query}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

}

export async function getTimesheet(id: string): Promise<TimesheetResponse> {
  return request<TimesheetResponse>(`/api/timesheets/${id}`, {
    method: "GET",
    credentials: "include",
  });

}


export async function updateTimesheet(
  id: string,
  entries: Timesheet["entries"]
): Promise<TimesheetResponse> {
  return request<TimesheetResponse>(
    `/api/timesheets/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entries,
      }),
    }
  );

}

interface CreateTimesheetResponse {
  success: boolean;
  data: Timesheet;
  error?: string;
}

export async function createTimesheet(
  id: string,
  entries: Timesheet["entries"]
): Promise<CreateTimesheetResponse> {
  return request<CreateTimesheetResponse>(
    `/api/timesheets/${id}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entries,
      }),
    }
  );

}
