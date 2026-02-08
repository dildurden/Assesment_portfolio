// -------------------------------------------------------------------
// Normalizes raw CSV data into the structure used by the portfolio
// calculation logic.
//
// Responsibilities:
// - Map internal id_stock values to human-readable stock symbols.
// - Clean up id_stock values that contain commas (e.g. "40,359,100").
// - Parse numeric fields safely (via parseNumeric).
// - Produce a lookup of closing prices by [date][symbol].
// -------------------------------------------------------------------

import type {
  StockIdentifierRaw,
  StockPriceRaw,
  NormalizedPricesByDate,
} from "../types/stocks";

/**
 * Normalizes an id_stock by stripping commas.
 * Example:
 *   "40,359,100" → "40359100"
 */

function normalizeId(id: string) {
  return id.replace(/,/g, "");
}

/**
 * Takes raw CSV rows for identifiers and prices, and returns
 * a date → symbol → closePrice map.
 *
 * This is the main entry point used by the rest of the app.
 */
export function normalizeStockData(
  identifiers: StockIdentifierRaw[],
  prices: StockPriceRaw[]
): NormalizedPricesByDate {
  const idToSymbol: Record<string, string> = {};

  // Build a map from normalized id_stock → symbol (e.g. "13" → "AAPL")
  for (const row of identifiers) {
    const normalizedId = normalizeId(row.id_stock);
    // If there are duplicates, later rows will overwrite earlier ones,
    // which is acceptable for this dataset.
    idToSymbol[normalizedId] = row.symbol;
  }

  const pricesByDate: NormalizedPricesByDate = {};

  // Walk all price rows and fold them into the date/symbol map
  for (const row of prices) {
    const id = normalizeId(row.id_stock);
    const symbol = idToSymbol[id];
    // If we don't know this id_stock → symbol mapping, skip the row.
    if (!symbol) continue;

    const date = row.date;
    // Parse the closing price for this row. We ignore high/low here,
    // because the portfolio logic uses closing prices only.
    const close = parseNumeric(row.close);
    if (close === null) {
      // Malformed or missing close → safer to drop the row
      continue;
    }

    if (!pricesByDate[date]) {
      pricesByDate[date] = {};
    }

    pricesByDate[date][symbol] = close;
  }
  console.log(pricesByDate);
  return pricesByDate;
}

function parseNumeric(
  value: string | number | null | undefined
): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;

  const cleaned = value.replace(/,/g, "").trim();

  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
}
