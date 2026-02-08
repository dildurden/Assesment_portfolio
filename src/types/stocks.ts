export interface StockIdentifierRaw {
  id_stock: string;
  name: string;
  symbol: string;
}

export interface StockPriceRaw {
  id_stock: string;
  high: string;
  low: string;
  close: string;
  date: string;
}

export type StockSymbol = "AAPL" | "GOOG" | "MSFT" | "NVDA" | "SPX";

export type NormalizedPricesByDate = Record<
  string, // date "YYYY-MM-DD"
  Record<string, number> // symbol -> close price
>;
