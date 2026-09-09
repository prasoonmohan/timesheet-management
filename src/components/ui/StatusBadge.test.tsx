import { render, screen } from "@testing-library/react";

import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it.each(["completed", "incomplete", "missing"] as const)("shows the %s status", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(status.toUpperCase())).toBeInTheDocument();
  });
});
