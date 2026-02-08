import { parseCSV } from "./parseCSV";
import type { StockIdentifierRaw, StockPriceRaw } from "../types/stocks";

export async function loadStockData() {
  const [idsRes, pricesRes] = await Promise.all([
    fetch("/stock_identifiers.csv"),
    fetch("/stock_prices.csv"),
  ]);

  const [idsText, pricesText] = await Promise.all([
    idsRes.text(),
    pricesRes.text(),
  ]);

  const identifiers = parseCSV<StockIdentifierRaw>(idsText);
  const prices = parseCSV<StockPriceRaw>(pricesText);

  return { identifiers, prices };
}
