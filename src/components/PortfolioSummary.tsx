import type { PortfolioResult } from "../logic/calculatePortfolio";

interface PortfolioSummaryProps {
  portfolio: PortfolioResult | null;
  startDate: string;
  endDate: string;
}

export function PortfolioSummary({
  portfolio,
  startDate,
  endDate,
}: PortfolioSummaryProps) {
  return (
    <>
      <h2 className="card__title">Portfolio Summary</h2>

      {!portfolio && (
        <div className="text-muted">
          Adjust the inputs above to see how the portfolio would have evolved.
        </div>
      )}

      {portfolio && (
        <>
          <p className="summary-row">
            Date range: <strong>{startDate}</strong> →{" "}
            <strong>{endDate}</strong>
          </p>
          <p className="summary-row">
            Selected symbols:{" "}
            {portfolio.usedSymbols.length > 0 ? (
              <strong>{portfolio.usedSymbols.join(", ")}</strong>
            ) : (
              <em>none with data in range</em>
            )}
          </p>
          {portfolio.droppedSymbols.length > 0 && (
            <p className="summary-row" style={{ color: "#b45309" }}>
              Ignored (no data in range): {portfolio.droppedSymbols.join(", ")}
            </p>
          )}
          <p className="summary-row">
            Final portfolio value:{" "}
            <strong>{portfolio.finalValue.toFixed(2)}</strong>
          </p>
          <p className="summary-row">
            Data points: <strong>{portfolio.series.length}</strong>
          </p>
        </>
      )}
    </>
  );
}
