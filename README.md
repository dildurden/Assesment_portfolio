---

# Nasdaq Frontend Assessment — Portfolio Calculator

A React + TypeScript application that calculates the value of a portfolio of selected stocks over a date range using the provided CSV files:

- **`stock_identifiers.csv`** – mapping of internal `id_stock` → stock symbol
- **`stock_prices.csv`** – daily OHLC prices per stock ID

The application allows users to:

- Select **start** and **end** dates
- Choose one or more **symbols** (AAPL, GOOG, MSFT, NVDA, SPX)
- Enter an **initial investment amount**
- View:

  - **Final portfolio value** on the end date
  - **A line chart** showing daily portfolio value over the range

---

## 🚀 Tech Stack

- **React** + **TypeScript**
- **Vite**
- **Recharts** (Line chart)
- **Jest** + **React Testing Library**
- **Docker (Node 20)**

---

## 📈 How the Portfolio Calculation Works

### 1. Equal Allocation

Total investment is evenly divided among the symbols that **have data** in the selected date range.

### 2. Buy Logic

For each symbol:

- The app buys at the **first available closing price** encountered between the selected dates.
- Shares purchased:

```
shares = allocationPerSymbol / firstClosePrice
```

### 3. Daily Portfolio Valuation

For each day in the range:

```
totalValue(date) = Σ (shares[symbol] × priceOnDate[symbol])
```

If a symbol has no price on a given day, its **last known price is carried forward**.

### 4. Dropped Symbols

If a symbol has **no data at all** in the range, it is excluded and reported as _dropped_.

---

## 🗂️ Project Structure

```
src/
  data/
    normalizeStockData.ts     # CSV → normalized date/symbol price map
  logic/
    calculatePortfolio.ts     # Main portfolio math
  components/
    PortfolioForm.tsx         # User inputs
    PortfolioSummary.tsx      # Final calculated output
    PortfolioChart.tsx        # Recharts line graph
  utils/
    number.ts                 # parseNumeric helper (handles commas)
  tests/
    setupTests.ts             # jest-dom + RTL setup

public/
  stock_identifiers.csv
  stock_prices.csv
```

---

## 📄 CSV Handling Notes

The CSV files include numbers with commas:

- `"40,359,100"`
- `"6,94343"`

To ensure accurate parsing:

- All commas are stripped before numeric conversion.
- `id_stock` is normalized so `"40,359,100"` becomes `"40359100"`.

This prevents malformed `Number()` parsing.

---

## ▶️ Running the App

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build and preview

```bash
npm run build
npm run preview
```

---

## 🧪 Running Tests (Jest + RTL)

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage report:

```bash
npm run test:coverage
```

Tests cover:

- CSV numeric parsing
- Normalization logic
- Portfolio calculation paths
- Form wiring + component behavior

---

## 🐳 Docker

### Build image

```bash
docker build -t nasdaq-portfolio .
```

### Run container

```bash
docker run --rm -p 4173:4173 nasdaq-portfolio
```

Open:

```
http://localhost:4173
```

(Adjust port if your Dockerfile specifies a different one.)

---

## 🧠 Assumptions & Design Decisions

- Only **closing prices** are used (per assessment instructions).
- Dates are ISO (`YYYY-MM-DD`), making lexicographic sorting valid.
- Full investment is reallocated among symbols that **have data** during the chosen range.
- Missing daily prices use **last observation carried forward** to keep the series continuous.

---

## 📝 Notes for Reviewers

The core application logic is intentionally separated into pure functions:

- `normalizeStockData()`
- `calculatePortfolio()`

This ensures:

- Deterministic behavior
- Clear testability
- UI stays simple and declarative

UI components use proper `htmlFor`/`id` relationships for accessibility and RTL compatibility.

---

If you'd like, I can also generate a **short animated GIF preview**, **screenshots**, **API-style documentation**, or a **Design Decisions** appendix.
