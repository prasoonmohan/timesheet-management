import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TimesheetEntryEditor from "./TimesheetEntryEditor";

const date = "2024-01-15";

describe("TimesheetEntryEditor", () => {
  it("does not add an entry when required fields are empty", async () => {
    const user = userEvent.setup();
    const onEntriesChange = jest.fn();

    render(<TimesheetEntryEditor days={[date]} entries={[]} onEntriesChange={onEntriesChange} />);

    await user.click(screen.getByRole("button", { name: /add new task/i }));
    await user.click(screen.getByRole("button", { name: /add entry/i }));

    expect(onEntriesChange).not.toHaveBeenCalled();
  });

  it("adds an entry after the user completes the form", async () => {
    const user = userEvent.setup();
    const onEntriesChange = jest.fn();

    render(<TimesheetEntryEditor days={[date]} entries={[]} onEntriesChange={onEntriesChange} />);

    await user.click(screen.getByRole("button", { name: /add new task/i }));
    await user.selectOptions(screen.getByLabelText(/select project/i), "project-2");
    await user.selectOptions(screen.getByLabelText(/type of work/i), "Testing");
    await user.type(screen.getByLabelText(/task description/i), "Covered regression scenarios");
    await user.click(screen.getByRole("button", { name: /add entry/i }));

    expect(onEntriesChange).toHaveBeenCalledWith([
      expect.objectContaining({
        date,
        projectId: "project-2",
        projectName: "Dashboard Development",
        workType: "Testing",
        description: "Covered regression scenarios",
        hours: 1,
      }),
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps hours between 1 and 24", async () => {
    const user = userEvent.setup();

    render(<TimesheetEntryEditor days={[date]} entries={[]} onEntriesChange={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /add new task/i }));
    const hours = screen.getByRole("spinbutton", { name: /hours/i });

    await user.click(screen.getByRole("button", { name: /decrease hours/i }));
    expect(hours).toHaveValue(1);

    for (let index = 0; index < 24; index += 1) {
      await user.click(screen.getByRole("button", { name: /increase hours/i }));
    }
    expect(hours).toHaveValue(24);
  });
});
