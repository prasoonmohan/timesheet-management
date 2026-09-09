import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { timesheets } from "@/lib/mock-data/timesheets";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
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

  const { id } = await params;

  const timesheet = timesheets.find(
    (item) => item.id === id
  );

  if (!timesheet) {
    return NextResponse.json(
      {
        success: false,
        error: "Timesheet not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: timesheet,
  });
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
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

  const { id } = await params;

  const timesheet = timesheets.find(
    (item) => item.id === id
  );

  if (!timesheet) {
    return NextResponse.json(
      {
        success: false,
        error: "Timesheet not found",
      },
      { status: 404 }
    );
  }

  if (timesheet.status !== "incomplete") {
    return NextResponse.json(
      {
        success: false,
        error: "Only incomplete timesheets can be updated",
      },
      { status: 400 }
    );
  }

  let body: {
    entries?: typeof timesheet.entries;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.entries)) {
    return NextResponse.json(
      {
        success: false,
        error: "Entries are required",
      },
      { status: 400 }
    );
  }

  const hasInvalidEntry = body.entries.some(
    (entry) =>
      !entry.id ||
      !entry.date ||
      !entry.projectId ||
      !entry.projectName ||
      !entry.workType ||
      !entry.description ||
      typeof entry.hours !== "number" ||
      !Number.isFinite(entry.hours) ||
      entry.hours <= 0 ||
      entry.hours > 24
  );

  if (hasInvalidEntry) {
    return NextResponse.json(
      {
        success: false,
        error: "All entry fields are required and hours must be greater than 0",
      },
      { status: 400 }
    );
  }

  const totalHours = body.entries.reduce(
    (total, entry) => total + entry.hours,
    0
  );

  timesheet.entries = body.entries;
  timesheet.totalHours = totalHours;

  // Once the incomplete timesheet is fully filled,
  // mark it as completed.
  timesheet.status =
    totalHours >= 40 ? "completed" : "incomplete";

  return NextResponse.json({
    success: true,
    data: timesheet,
  });
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
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

  const { id } = await params;

  const timesheet = timesheets.find(
    (item) => item.id === id
  );

  if (!timesheet) {
    return NextResponse.json(
      {
        success: false,
        error: "Timesheet not found",
      },
      { status: 404 }
    );
  }

  if (timesheet.status !== "missing") {
    return NextResponse.json(
      {
        success: false,
        error: "Only missing timesheets can be created",
      },
      { status: 400 }
    );
  }

  let body: {
    entries?: typeof timesheet.entries;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.entries) || body.entries.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "At least one entry is required",
      },
      { status: 400 }
    );
  }

  const hasInvalidEntry = body.entries.some(
    (entry) =>
      !entry.id ||
      !entry.date ||
      !entry.projectId ||
      !entry.projectName ||
      !entry.workType ||
      !entry.description ||
      typeof entry.hours !== "number" ||
      !Number.isFinite(entry.hours) ||
      entry.hours <= 0 ||
      entry.hours > 24
  );

  if (hasInvalidEntry) {
    return NextResponse.json(
      {
        success: false,
        error:
          "All entry fields are required and hours must be greater than 0",
      },
      { status: 400 }
    );
  }

  const totalHours = body.entries.reduce(
    (total, entry) => total + entry.hours,
    0
  );

  timesheet.entries = body.entries;
  timesheet.totalHours = totalHours;

  timesheet.status =
    totalHours >= 40 ? "completed" : "incomplete";

  return NextResponse.json(
    {
      success: true,
      data: timesheet,
    },
    { status: 201 }
  );
}
