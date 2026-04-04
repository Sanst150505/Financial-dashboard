import { CHART_COLORS } from "../../data/mockData";
import { EmptyChart, formatCurrency } from "./chartUtils.jsx";

export default function CategoryBarChart({ categoryData }) {
  if (!categoryData.length) {
    return (
      <div className="chart-card">
        <p className="chart-title">Spending by Category</p>
        <EmptyChart message="No category totals to compare yet." />
      </div>
    );
  }

  const max = Math.max(...categoryData.map((item) => item.value), 1);

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <p className="chart-title">Spending by Category</p>
          <p className="chart-subtitle">Quick comparison of expense-heavy buckets.</p>
        </div>
      </div>

      <div className="bar-chart">
        {categoryData.map((item, index) => (
          <div key={item.label} className="bar-row">
            <div className="bar-copy">
              <span>{item.label}</span>
              <strong>{formatCurrency(item.value)}</strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
