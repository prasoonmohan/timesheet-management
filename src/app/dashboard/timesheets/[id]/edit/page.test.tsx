import { render, screen } from "@testing-library/react";

import { ToastProvider } from "@/components/ui/ToastProvider";
import type { Timesheet } from "@/types/timesheet";
import EditTimesheetPage from "./page";

jest.mock("@/lib/api/timesheets", () => ({
  getTimesheet: jest.fn(),
  updateTimesheet: jest.fn(),
}));

const { getTimesheet } = jest.requireMock("@/lib/api/timesheets") as {
  getTimesheet: jest.Mock;
};

function makeTimesheet(totalHours: number): Timesheet {
  return {
    id: "timesheet-1",
    weekNumber: 1,
    startDate: "2024-01-15",
    endDate: "2024-01-21",
    status: "incomplete",
    totalHours,
    entries: [{
      id: "entry-1",
      date: "2024-01-15",
      projectId: "project-1",
      projectName: "Homepage Development",
      workType: "Development",
      description: "Implemented the page",
      hours: totalHours,
    }],
  };
}

describe("EditTimesheetPage progress", () => {
  it.each([
    [0, "0%"],
    [20, "50%"],
    [40, "100%"],
    [48, "100%"],
  ])("shows %s of 40 hours as %s", async (totalHours, expectedProgress) => {
    getTimesheet.mockResolvedValueOnce({ success: true, data: makeTimesheet(totalHours) });

    render(
      <ToastProvider>
        <EditTimesheetPage params={Promise.resolve({ id: "timesheet-1" })} />
      </ToastProvider>
    );

    expect(await screen.findByText(`${totalHours}/40 hrs`)).toBeInTheDocument();
    expect(screen.getByText(expectedProgress)).toBeInTheDocument();
  });
});
