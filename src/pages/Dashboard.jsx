import BalanceTrendChart from "../components/Charts/BalanceTrendChart";
import CategoryBarChart from "../components/Charts/CategoryBarChart";
import MonthlyComparisonChart from "../components/Charts/MonthlyComparisonChart";
import SpendingPieChart from "../components/Charts/SpendingPieChart";
import SummaryCard from "../components/Dashboard/SummaryCard";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import "./Dashboard.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function InsightCard({ title, value, description }) {
  return (
    <article className="insight-card">
      <p className="insight-label">{title}</p>
      <p className="insight-value">{value}</p>
      <p className="insight-sub">{description}</p>
    </article>
  );
}

function buildMonthlyData(transactions) {
  const today = new Date("2026-04-04T00:00:00");
  const months = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      month: date.toLocaleString("en-IN", { month: "short" }),
      income: 0,
      expenses: 0,
      balance: 0,
    });
  }

  transactions.forEach((transaction) => {
    const key = transaction.date.slice(0, 7);
    const month = months.find((entry) => entry.key === key);
    if (!month) {
      return;
    }

    if (transaction.type === "income") {
      month.income += transaction.amount;
    } else {
      month.expenses += Math.abs(transaction.amount);
    }
  });

  let runningBalance = 0;
  return months.map((month) => {
    runningBalance += month.income - month.expenses;
    return {
      ...month,
      balance: runningBalance,
    };
  });
}

export default function DashboardPage({ transactions, role, onAdd, onEdit, onDelete }) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const categoryData = Object.entries(
    transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((map, transaction) => {
        map[transaction.cat] = (map[transaction.cat] || 0) + Math.abs(transaction.amount);
        return map;
      }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);

  const monthlyData = buildMonthlyData(transactions);
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const difference = currentMonth.expenses - previousMonth.expenses;
  const direction = difference > 0 ? "up" : difference < 0 ? "down" : "flat";
  const highestCategory = categoryData[0] ?? { label: "No data", value: 0 };
  const averageExpense = categoryData.length > 0 ? totalExpenses / categoryData.length : 0;
  const monthlyObservation =
    direction === "flat"
      ? "Spending is unchanged from last month."
      : `Spending is ${direction} by ${formatCurrency(Math.abs(difference))} versus last month.`;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const balance = totalIncome - totalExpenses;
  const recentTransactions = [...transactions]
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 5);

  return (
    <div className="dashboard-stack">
      <section className="dashboard-grid">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(balance)}
          change={`${savingsRate >= 0 ? "+" : "-"}${Math.abs(savingsRate).toFixed(1)}% saved`}
          colorClass="color-balance"
        />
        <SummaryCard
          label="Income"
          value={formatCurrency(totalIncome)}
          change={`${formatCurrency(monthlyData[monthlyData.length - 1]?.income ?? 0)} this month`}
          colorClass="color-income"
        />
        <SummaryCard
          label="Expenses"
          value={formatCurrency(totalExpenses)}
          change={`${formatCurrency(monthlyData[monthlyData.length - 1]?.expenses ?? 0)} this month`}
          colorClass="color-expense"
        />
        <SummaryCard
          label="Tracked Transactions"
          value={transactions.length.toString()}
          change={`${role === "admin" ? "+ Add or edit enabled" : "+ Viewer mode"}`}
          colorClass="color-savings"
        />
      </section>

      <section className="charts-row">
        <BalanceTrendChart monthlyData={monthlyData} />
        <SpendingPieChart categoryData={categoryData} />
      </section>

      <section className="insights-grid">
        <InsightCard
          title="Highest Spending Category"
          value={highestCategory.label}
          description={`${formatCurrency(highestCategory.value)} spent in this category.`}
        />
        <InsightCard
          title="Monthly Comparison"
          value={monthlyObservation}
          description="A quick month-over-month read on expense momentum."
        />
        <InsightCard
          title="Average Category Spend"
          value={formatCurrency(averageExpense)}
          description="Average spend across active expense categories."
        />
      </section>

      <section className="secondary-grid">
        <MonthlyComparisonChart monthlyData={monthlyData} />
        <CategoryBarChart categoryData={categoryData} />
      </section>

      <TransactionsTable
        transactions={recentTransactions}
        role={role}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        title="Recent Transactions"
        description="Latest activity pulled into the dashboard for quick review."
        showToolbar={false}
      />
    </div>
  );
}
