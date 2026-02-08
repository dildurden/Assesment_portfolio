import { useMemo } from "react";
import type { NormalizedPricesByDate, StockSymbol } from "../types/stocks";
import { calculatePortfolio } from "../logic/calculatePortfolio";

interface UsePortfolioParams {
  pricesByDate: NormalizedPricesByDate | null;
  symbols: StockSymbol[];
  startDate: string;
  endDate: string;
  investment: number;
}

export function usePortfolio({
  pricesByDate,
  symbols,
  startDate,
  endDate,
  investment,
}: UsePortfolioParams) {
  return useMemo(() => {
    if (!pricesByDate || symbols.length === 0) {
      return null;
    }
    return calculatePortfolio({
      pricesByDate,
      symbols,
      startDate,
      endDate,
      investment,
    });
  }, [pricesByDate, symbols, startDate, endDate, investment]);
}
