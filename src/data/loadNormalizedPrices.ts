import { loadStockData } from "./loadStockData";
import { normalizeStockData } from "./normalizeStockData";
import type { NormalizedPricesByDate } from "../types/stocks";

export async function loadNormalizedPrices(): Promise<NormalizedPricesByDate> {
  const { identifiers, prices } = await loadStockData();
  return normalizeStockData(identifiers, prices);
}
