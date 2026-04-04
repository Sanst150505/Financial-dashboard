import { EmptyChart } from "./chartUtils.jsx";

export default function MonthlyComparisonChart({ monthlyData }) {
  if (!monthlyData.length) {
    return (
      <div className="chart-card">
        <p className="chart-title">Month-over-Month Comparison</p>
        <EmptyChart message="No monthly totals available yet." />
      </div>
    );
  }

  const max = Math.max(...monthlyData.flatMap((item) => [item.income, item.expenses]), 1);

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <p className="chart-title">Month-over-Month Comparison</p>
          <p className="chart-subtitle">Income versus expenses for each month.</p>
        </div>
      </div>

      <div className="comparison-chart">
        {monthlyData.map((item) => (
          <div className="comparison-group" key={item.month}>
            <div className="comparison-bars">
              <div
                className="comparison-bar comparison-bar--income"
                style={{ height: `${(item.income / max) * 100}%` }}
              />
              <div
                className="comparison-bar comparison-bar--expense"
                style={{ height: `${(item.expenses / max) * 100}%` }}
              />
            </div>
            <span className="comparison-label">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="comparison-legend">
        <span><i className="comparison-dot comparison-dot--income" />Income</span>
        <span><i className="comparison-dot comparison-dot--expense" />Expenses</span>
      </div>
    </div>
  );
}
