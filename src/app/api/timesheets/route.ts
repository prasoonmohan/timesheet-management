import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { timesheets } from "@/lib/mock-data/timesheets";

const DEFAULT_PAGE_SIZE = 5;
const MAX_PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const requestedPage = Number(searchParams.get("page") ?? 1);
  const requestedPageSize = Number(
    searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE
  );

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const pageSize =
    Number.isInteger(requestedPageSize) && requestedPageSize > 0
      ? Math.min(requestedPageSize, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  let filteredTimesheets = [...timesheets];

  // Status filter
  if (
    status === "completed" ||
    status === "incomplete" ||
    status === "missing"
  ) {
    filteredTimesheets = filteredTimesheets.filter(
      (timesheet) => timesheet.status === status
    );
  }

  // Date range filter
  if (startDate || endDate) {
    filteredTimesheets = filteredTimesheets.filter((timesheet) => {
      const weekStart = timesheet.startDate;
      const weekEnd = timesheet.endDate;

      if (startDate && weekEnd < startDate) {
        return false;
      }

      if (endDate && weekStart > endDate) {
        return false;
      }

      return true;
    });
  }

  const total = filteredTimesheets.length;
  const totalPages = Math.ceil(total / pageSize);

  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedTimesheets = filteredTimesheets.slice(
    startIndex,
    endIndex
  );

  return NextResponse.json({
    success: true,
    data: paginatedTimesheets,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  });
}