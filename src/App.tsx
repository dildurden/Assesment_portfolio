// src/App.tsx
import { useState } from "react";
import "./App.css";
import { usePricesByDate } from "./hooks/usePricesByDate";
import { usePortfolio } from "./hooks/usePortfolio";
import type { StockSymbol } from "./types/stocks";
import { PortfolioForm } from "./components/PortfolioForm";
import { PortfolioSummary } from "./components/PortfolioSummary";
import { PortfolioChart } from "./components/PortfolioChart";

const ALL_SYMBOLS: StockSymbol[] = ["AAPL", "GOOG", "MSFT", "NVDA", "SPX"];

function getValidationError(opts: {
  investment: number;
  startDate: string;
  endDate: string;
  selectedSymbols: string[];
}): string | null {
  const { investment, startDate, endDate, selectedSymbols } = opts;

  if (!startDate || !endDate) {
    return "Select both a start date and an end date to run the simulation.";
  }

  if (endDate < startDate) {
    return "The end date should be on or after the start date.";
  }

  if (investment <= 0) {
    return "Enter an investment amount greater than zero.";
  }

  if (selectedSymbols.length === 0) {
    return "Choose at least one stock to include in the portfolio.";
  }

  return null;
}

function App() {
  const { pricesByDate, loading, error } = usePricesByDate();

  const [selectedSymbols, setSelectedSymbols] = useState<StockSymbol[]>([
    "AAPL",
    "GOOG",
  ]);
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  const [investment, setInvestment] = useState(10000);

  const validationError = getValidationError({
    investment,
    startDate,
    endDate,
    selectedSymbols,
  });

  const hasValidInputs = !validationError;

  const portfolio = usePortfolio({
    pricesByDate: hasValidInputs ? pricesByDate : null,
    symbols: selectedSymbols,
    startDate,
    endDate,
    investment,
  });

  const noDataMessage =
    hasValidInputs && portfolio && portfolio.series.length === 0
      ? "No price data is available for this combination of dates and symbols. Try widening the date range or selecting different stocks."
      : null;

  if (loading) {
    return (
      <div className="app">
        <div className="app__inner">
          <h1 className="app__title">Portfolio Value Simulator</h1>
          <p className="app__subtitle">
            Loading historical prices for AAPL, GOOG, MSFT, NVDA and SPX…
          </p>
        </div>
      </div>
    );
  }

  if (error || !pricesByDate) {
    return (
      <div className="app">
        <div className="app__inner">
          <h1 className="app__title">Portfolio Value Simulator</h1>
          <p className="app__subtitle">
            Something went wrong while loading market data.
          </p>
          <div className="card">
            <p className="summary-row">
              Failed to load data: <strong>{error}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__inner">
        <h1 className="app__title">Portfolio Value Simulator</h1>
        <p className="app__subtitle">
          Explore how an equally weighted basket of large-cap names would have
          evolved over time.
        </p>

        <div className="card">
          <h2 className="card__title">Inputs</h2>

          <PortfolioForm
            allSymbols={ALL_SYMBOLS}
            selectedSymbols={selectedSymbols}
            startDate={startDate}
            endDate={endDate}
            investment={investment}
            onChangeSymbols={setSelectedSymbols}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            onChangeInvestment={setInvestment}
          />
        </div>

        {validationError && (
          <div className="message message--error">{validationError}</div>
        )}

        {!validationError && noDataMessage && (
          <div className="message message--info">{noDataMessage}</div>
        )}

        <div className="card card--center">
          <PortfolioSummary
            portfolio={portfolio}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {portfolio && portfolio.series.length > 0 && (
          <div className="card card--center">
            <PortfolioChart series={portfolio.series} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
