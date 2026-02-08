import type { ChangeEvent } from "react";
import type { StockSymbol } from "../types/stocks";

interface PortfolioFormProps {
  allSymbols: StockSymbol[];
  selectedSymbols: StockSymbol[];
  startDate: string;
  endDate: string;
  investment: number;
  onChangeSymbols: (symbols: StockSymbol[]) => void;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  onChangeInvestment: (value: number) => void;
}

// PortfolioForm: Collects investment amount, date range, and selected stocks.
// Emits all values upward via controlled props. Includes basic validation to prevent invalid ranges.

export function PortfolioForm({
  allSymbols,
  selectedSymbols,
  startDate,
  endDate,
  investment,
  onChangeSymbols,
  onChangeStartDate,
  onChangeEndDate,
  onChangeInvestment,
}: PortfolioFormProps) {
  const toggleSymbol = (symbol: StockSymbol) => {
    onChangeSymbols(
      selectedSymbols.includes(symbol)
        ? selectedSymbols.filter((s) => s !== symbol)
        : [...selectedSymbols, symbol]
    );
  };

  const handleInvestmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onChangeInvestment(Number.isNaN(value) ? 0 : value);
  };

  return (
    <div className="form-grid">
      <div>
        <div className="form-group">
          <label className="form-label" htmlFor="investment">
            Investment amount
          </label>
          <input
            id="investment"
            type="number"
            className="form-input"
            value={investment}
            min={0}
            onChange={handleInvestmentChange}
          />
        </div>
        {/*  Start date cannot exceed the end date.End date cannot be earlier than the start date.These constraints help the user avoid invalid portfolio ranges.
         */}
        <div className="form-group">
          <label className="form-label" htmlFor="start-date">
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            className="form-input"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => onChangeStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="end-date">
            End date
          </label>
          <input
            id="end-date"
            type="date"
            className="form-input"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onChangeEndDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="form-group">
          <label className="form-label">Stocks</label>
          <div className="checkbox-group">
            {allSymbols.map((symbol) => (
              <label key={symbol} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedSymbols.includes(symbol)}
                  onChange={() => toggleSymbol(symbol)}
                />{" "}
                {symbol}
              </label>
            ))}
          </div>
        </div>
        <p className="text-muted">
          The portfolio is equally weighted across all selected symbols at the
          start date.
        </p>
      </div>
    </div>
  );
}
