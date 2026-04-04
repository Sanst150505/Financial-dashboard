import { CHART_COLORS } from "../../data/mockData";
import { EmptyChart, describeSlice, formatCurrency } from "./chartUtils.jsx";

export default function SpendingPieChart({ categoryData }) {
  if (!categoryData.length) {
    return (
      <div className="chart-card">
        <p className="chart-title">All Expenses</p>
        <EmptyChart message="No expense data yet." />
      </div>
    );
  }

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <p className="chart-title">All Expenses</p>
          <p className="chart-subtitle">Spending distribution across categories</p>
        </div>
        <p className="chart-highlight">{formatCurrency(total)}</p>
      </div>

      <div className="expense-pie-layout">
        <svg viewBox="0 0 240 240" className="expense-pie" aria-hidden="true">
          {categoryData.map((item, index) => {
            const startAngle = currentAngle;
            const sliceAngle = (item.value / total) * 360;
            currentAngle += sliceAngle;
            return (
              <path
                key={item.label}
                d={describeSlice(120, 120, 92, startAngle, currentAngle)}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                className="expense-pie-slice"
                style={{ animationDelay: `${index * 90}ms` }}
              />
            );
          })}
          <circle cx="120" cy="120" r="48" className="expense-pie-hole" />
          <text x="120" y="112" textAnchor="middle" className="expense-pie-label">
            Total
          </text>
          <text x="120" y="136" textAnchor="middle" className="expense-pie-value">
            {formatCurrency(total)}
          </text>
        </svg>

        <div className="expense-breakdown expense-breakdown--below">
          {categoryData.map((item, index) => (
            <div className="expense-breakdown__row" key={item.label}>
              <div className="expense-breakdown__main">
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span>{item.label}</span>
              </div>
              <div className="expense-breakdown__meta">
                <strong>{Math.round((item.value / total) * 100)}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
