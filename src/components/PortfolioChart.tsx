import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PortfolioPoint } from "../logic/calculatePortfolio";

interface PortfolioChartProps {
  series: PortfolioPoint[];
}

export function PortfolioChart({ series }: PortfolioChartProps) {
  if (!series.length) {
    return (
      <>
        <h2 className="card__title">Portfolio Chart</h2>
        <div className="text-muted">
          No data available for the selected date range.
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="card__title">Portfolio Chart</h2>
      <div className="chart-container">
        <ResponsiveContainer>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalValue"
              dot={false}
              strokeWidth={2}
              stroke="#38bdf8"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
