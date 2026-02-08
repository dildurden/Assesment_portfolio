import { render, screen } from "@testing-library/react";
import { PortfolioSummary } from "./PortfolioSummary";

describe("PortfolioSummary", () => {
  test("shows message when no portfolio", () => {
    render(
      <PortfolioSummary
        portfolio={null}
        startDate="2025-01-01"
        endDate="2025-01-10"
      />
    );
    expect(screen.getByText(/adjust the inputs above/i)).toBeInTheDocument();
  });

  test("renders final portfolio value", () => {
    render(
      <PortfolioSummary
        portfolio={{
          series: [],
          finalValue: 1234,
          usedSymbols: ["AAPL"],
          droppedSymbols: [],
        }}
        startDate="2025-01-01"
        endDate="2025-01-10"
      />
    );

    expect(screen.getByText(/1234/i)).toBeInTheDocument();
  });
});
