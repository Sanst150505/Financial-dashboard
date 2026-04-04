import "./SummaryCard.css";

export default function SummaryCard({ label, value, change, colorClass }) {
  const isPositive = !change.startsWith("-");

  return (
    <article className="summary-card">
      <p className="summary-card__label">{label}</p>
      <p className={`summary-card__value ${colorClass}`}>{value}</p>
      <p
        className={`summary-card__change ${
          isPositive ? "summary-card__change--up" : "summary-card__change--down"
        }`}
      >
        {change}
      </p>
    </article>
  );
}
