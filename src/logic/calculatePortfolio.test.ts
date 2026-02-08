import { calculatePortfolio } from "./calculatePortfolio";

const mockData = {
  "2025-01-01": { AAPL: 100, GOOG: 200 },
  "2025-01-02": { AAPL: 110, GOOG: 190 },
  "2025-01-03": { AAPL: 120, GOOG: 210 },
};

describe("calculatePortfolio", () => {
  test("calculates equal-weight portfolio", () => {
    const result = calculatePortfolio({
      pricesByDate: mockData,
      symbols: ["AAPL", "GOOG"],
      startDate: "2025-01-01",
      endDate: "2025-01-03",
      investment: 1000,
    });

    // 1000 → 500 each
    // AAPL: 500/100 = 5 shares
    // GOOG: 500/200 = 2.5 shares
    // End value = 5*120 + 2.5*210 = 1125
    expect(result.finalValue).toBeCloseTo(1125);
  });

  test("skips symbols with no data", () => {
    const result = calculatePortfolio({
      pricesByDate: mockData,
      symbols: ["AAPL", "MSFT"],
      startDate: "2025-01-01",
      endDate: "2025-01-03",
      investment: 1000,
    });

    expect(result.usedSymbols).toEqual(["AAPL"]);
    expect(result.droppedSymbols).toEqual(["MSFT"]);
  });
});
