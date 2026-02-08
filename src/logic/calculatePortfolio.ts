// Core portfolio calculation logic.
//
// Responsibilities:
// - Take normalized price data keyed by date/symbol
// - Allocate an investment equally across selected symbols
// - Buy on the first available date in the range for each symbol
// - Carry prices forward on days when data is missing
// - Return a time series of total portfolio value plus summary metadata

import type { NormalizedPricesByDate, StockSymbol } from "../types/stocks";

export interface PortfolioInput {
  pricesByDate: NormalizedPricesByDate;
  symbols: StockSymbol[];
  startDate: string; // ISO date "YYYY-MM-DD"
  endDate: string; // ISO date "YYYY-MM-DD"
  investment: number; // total dollars
}

export interface PortfolioPoint {
  date: string;
  totalValue: number;
}

export interface PortfolioResult {
  series: PortfolioPoint[];
  finalValue: number;
  usedSymbols: StockSymbol[]; // symbols that actually had data in range
  droppedSymbols: StockSymbol[]; // selected but no data in range
}

export function calculatePortfolio({
  pricesByDate,
  symbols,
  startDate,
  endDate,
  investment,
}: PortfolioInput): PortfolioResult {
  // Guard: nothing to invest → nothing to calculate
  if (investment <= 0) {
    return {
      series: [],
      finalValue: 0,
      usedSymbols: [],
      droppedSymbols: symbols,
    };
  }

  // Collect all dates in the requested range where we have any price data.
  const dates = getSortedDatesInRange(pricesByDate, startDate, endDate);

  if (dates.length === 0) {
    // No overlapping dates with data → no portfolio timeline
    return {
      series: [],
      finalValue: 0,
      usedSymbols: [],
      droppedSymbols: symbols,
    };
  }

  // Compute initial shares for each symbol based on the first price
  // found in the date range. We also decide which symbols are usable.
  const { perSymbol, usedSymbols, droppedSymbols } = computeInitialShares(
    pricesByDate,
    dates,
    symbols,
    investment
  );

  if (usedSymbols.length === 0) {
    // None of the selected symbols had any data in the range
    return {
      series: [],
      finalValue: 0,
      usedSymbols: [],
      droppedSymbols,
    };
  }

  const series: PortfolioPoint[] = [];
  let lastTotal = 0;

  // Walk forward through all dates in the range and compute portfolio value.
  for (const date of dates) {
    let total = 0;

    for (const symbol of usedSymbols) {
      const state = perSymbol[symbol];
      const priceToday = pricesByDate[date]?.[symbol];

      // If we have a price for this date, update the "last seen" price.
      // This lets us carry prices forward across missing days.
      if (typeof priceToday === "number" && !Number.isNaN(priceToday)) {
        state.lastPrice = priceToday;
      }

      total += state.shares * state.lastPrice;
    }

    lastTotal = total;
    series.push({ date, totalValue: total });
  }

  return {
    series,
    finalValue: lastTotal,
    usedSymbols,
    droppedSymbols,
  };
}

/**
 * Returns all dates between startDate and endDate (inclusive)
 * for which we have at least one price entry, sorted ascending.
 * Because dates are in "YYYY-MM-DD" format, lexicographic sort is safe.
 */
function getSortedDatesInRange(
  pricesByDate: NormalizedPricesByDate,
  startDate: string,
  endDate: string
): string[] {
  return Object.keys(pricesByDate)
    .filter((date) => date >= startDate && date <= endDate)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

interface PerSymbolState {
  shares: number;
  lastPrice: number;
  buyDate: string;
}

/**
 * Determines how many shares to buy for each symbol and on which date.
 *
 * Behaviour:
 * - For each symbol, we look for the first date in `dates` where that symbol has a valid price.
 * - If we find one, we treat that as the "buy date" and allocate an equal slice of the
 *   total investment across *only the symbols that have at least one valid price*.
 * - Symbols with no data in the range are reported as dropped and receive no allocation.
 */
function computeInitialShares(
  pricesByDate: NormalizedPricesByDate,
  dates: string[],
  symbols: StockSymbol[],
  totalInvestment: number
): {
  perSymbol: Record<StockSymbol, PerSymbolState>;
  usedSymbols: StockSymbol[];
  droppedSymbols: StockSymbol[];
} {
  // First pass: find buy price/date per symbol, or mark it as dropped.
  const candidates: {
    symbol: StockSymbol;
    buyPrice: number;
    buyDate: string;
  }[] = [];
  const droppedSymbols: StockSymbol[] = [];

  for (const symbol of symbols) {
    let buyPrice: number | undefined;
    let buyDate: string | undefined;

    // Find first date in range where this symbol has a valid price
    for (const date of dates) {
      const price = pricesByDate[date]?.[symbol];
      if (typeof price === "number" && !Number.isNaN(price)) {
        buyPrice = price;
        buyDate = date;
        break;
      }
    }

    if (buyPrice !== undefined && buyDate) {
      candidates.push({ symbol, buyPrice, buyDate });
    } else {
      // This symbol never appears in the selected date range
      droppedSymbols.push(symbol);
    }
  }

  const usedSymbols = candidates.map((c) => c.symbol);

  if (candidates.length === 0) {
    // No symbol had a valid price in the date range
    return {
      perSymbol: {} as Record<StockSymbol, PerSymbolState>,
      usedSymbols: [],
      droppedSymbols,
    };
  }

  // Allocate the full investment equally across symbols that actually have data.
  const amountPerStock = totalInvestment / candidates.length;

  const perSymbol: Record<StockSymbol, PerSymbolState> = {} as Record<
    StockSymbol,
    PerSymbolState
  >;

  for (const { symbol, buyPrice, buyDate } of candidates) {
    const shares = amountPerStock / buyPrice;

    perSymbol[symbol] = {
      shares,
      lastPrice: buyPrice, // will be updated as we walk the timeline
      buyDate,
    };
  }

  return {
    perSymbol,
    usedSymbols,
    droppedSymbols,
  };
}
