import { EmptyChart, buildSmoothPath, formatCurrency } from "./chartUtils.jsx";

export default function BalanceTrendChart({ monthlyData }) {
  if (!monthlyData.length) {
    return (
      <div className="chart-card">
        <p className="chart-title">Cashflow Trend</p>
        <EmptyChart message="Add some dated transactions to see your monthly trend." />
      </div>
    );
  }

  const incomeValues = monthlyData.map((month) => month.income);
  const expenseValues = monthlyData.map((month) => month.expenses);
  const maxValue = Math.max(...incomeValues, ...expenseValues, 1);
  const chartWidth = 620;
  const chartHeight = 240;
  const leftPadding = 54;
  const rightPadding = 16;
  const topPadding = 12;
  const bottomPadding = 26;
  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;

  const projectPoints = (values) =>
    values.map((value, index) => ({
      x: leftPadding + (innerWidth * index) / Math.max(values.length - 1, 1),
      y: topPadding + innerHeight - (value / maxValue) * innerHeight,
      label: monthlyData[index].month,
    }));

  const incomePoints = projectPoints(incomeValues);
  const expensePoints = projectPoints(expenseValues);
  const incomePath = buildSmoothPath(incomePoints);
  const expensePath = buildSmoothPath(expensePoints);
  const yTicks = Array.from({ length: 4 }, (_, index) => Math.round((maxValue / 4) * (4 - index)));
  const areaBaseY = topPadding + innerHeight;

  const buildAreaPath = (points) =>
    `${buildSmoothPath(points)} L ${points[points.length - 1].x} ${areaBaseY} L ${points[0].x} ${areaBaseY} Z`;

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-head">
        <p className="chart-title">Cashflow Trend</p>
        <div className="chart-legend">
          <span><i className="legend-dot legend-dot--income" />Income</span>
          <span><i className="legend-dot legend-dot--expense" />Expenses</span>
        </div>
      </div>

      <div className="axis-chart">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#37d39a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#37d39a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f05d6c" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f05d6c" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = topPadding + innerHeight - (tick / maxValue) * innerHeight;
            return (
              <g key={tick}>
                <line
                  x1={leftPadding}
                  x2={chartWidth - rightPadding}
                  y1={y}
                  y2={y}
                  className="axis-grid"
                />
                <text x={4} y={y + 4} className="axis-label axis-label--y">
                  {formatCurrency(tick)}
                </text>
              </g>
            );
          })}

          <path d={buildAreaPath(incomePoints)} className="trend-area trend-area--income" />
          <path d={buildAreaPath(expensePoints)} className="trend-area trend-area--expense" />

          <path d={incomePath} className="trend-line trend-line--income trend-line--animated" />
          <path d={expensePath} className="trend-line trend-line--expense trend-line--animated" />

          {incomePoints.map((point) => (
            <circle
              key={`income-${point.label}`}
              cx={point.x}
              cy={point.y}
              r="3"
              className="trend-marker trend-marker--income"
            />
          ))}
          {expensePoints.map((point) => (
            <circle
              key={`expense-${point.label}`}
              cx={point.x}
              cy={point.y}
              r="3"
              className="trend-marker trend-marker--expense"
            />
          ))}

          {monthlyData.map((month, index) => (
            <text
              key={month.month}
              x={incomePoints[index].x}
              y={chartHeight - 2}
              textAnchor="middle"
              className="axis-label"
            >
              {month.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
