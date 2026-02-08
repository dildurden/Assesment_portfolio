// src/hooks/usePricesByDate.ts
import { useEffect, useState } from "react";
import { loadNormalizedPrices } from "../data/loadNormalizedPrices";
import type { NormalizedPricesByDate } from "../types/stocks";

export function usePricesByDate() {
  const [pricesByDate, setPricesByDate] =
    useState<NormalizedPricesByDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await loadNormalizedPrices();
        if (!cancelled) {
          setPricesByDate(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return { pricesByDate, loading, error };
}
