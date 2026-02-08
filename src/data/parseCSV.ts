import Papa from "papaparse";

/**
 * Converts a CSV string into an array of objects.
 * Handles both numeric and string values intelligently.
 */
export function parseCSV<T>(csvText: string): T[] {
  const result = Papa.parse<T>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    console.warn("CSV parse warnings:", result.errors);
  }

  return result.data;
}
