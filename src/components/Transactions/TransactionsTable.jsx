import { useDeferredValue, useState } from "react";
import { CATEGORIES } from "../../data/mockData";
import TransactionModal from "./TransactionModal";
import "./Table.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
  { value: "a-z", label: "Category A-Z" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TransactionsTable({
  transactions,
  role,
  onAdd,
  onEdit,
  onDelete,
  title = "Transactions",
  description = "Review your latest activity.",
  showToolbar = true,
  limit,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [modalMode, setModalMode] = useState(null);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const deferredSearch = useDeferredValue(search);

  const query = deferredSearch.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.cat === categoryFilter;
    const matchesSearch =
      query.length === 0 ||
      transaction.desc.toLowerCase().includes(query) ||
      transaction.cat.toLowerCase().includes(query) ||
      transaction.date.includes(query);

    return matchesType && matchesCategory && matchesSearch;
  });

  const sortedTransactions = [...filtered].sort((left, right) => {
    if (sortBy === "oldest") {
      return new Date(left.date) - new Date(right.date);
    }

    if (sortBy === "highest") {
      return Math.abs(right.amount) - Math.abs(left.amount);
    }

    if (sortBy === "lowest") {
      return Math.abs(left.amount) - Math.abs(right.amount);
    }

    if (sortBy === "a-z") {
      return left.cat.localeCompare(right.cat) || left.desc.localeCompare(right.desc);
    }

    return new Date(right.date) - new Date(left.date);
  });

  const filteredTransactions =
    typeof limit === "number" ? sortedTransactions.slice(0, limit) : sortedTransactions;

  const openAddModal = () => {
    setActiveTransaction(null);
    setModalMode("add");
  };

  const openEditModal = (transaction) => {
    setActiveTransaction(transaction);
    setModalMode("edit");
  };

  const closeModal = () => {
    setActiveTransaction(null);
    setModalMode(null);
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
  };

  const handleSave = (transaction) => {
    if (modalMode === "edit") {
      onEdit({ ...transaction, id: activeTransaction.id });
      return;
    }

    onAdd(transaction);
  };

  const activeFilterCount = [typeFilter !== "all", categoryFilter !== "all", search.trim() !== ""]
    .filter(Boolean)
    .length;

  const isEmpty = filteredTransactions.length === 0;

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{description}</p>
        </div>

        {showToolbar && (
          <div className="section-actions">
            <input
              className="search-bar"
              type="text"
              placeholder="Search by date, description, or category"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {role === "admin" && (
              <button className="btn-primary" onClick={openAddModal}>
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>

      {showToolbar && (
        <div className="filters-grid">
          <label className="filter-field">
            <span className="filter-label">Type</span>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="filter-field">
            <span className="filter-label">Category</span>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span className="filter-label">Sort</span>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {showToolbar && (
        <div className="results-bar">
          <p className="results-copy">
            Showing <strong>{filteredTransactions.length}</strong> of{" "}
            <strong>{transactions.length}</strong> transactions
            {activeFilterCount > 0 ? ` with ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}` : ""}.
          </p>
          <button className="btn-text" onClick={clearFilters}>
            Reset filters
          </button>
        </div>
      )}

      {role === "viewer" && showToolbar && (
        <div className="viewer-note">
          Viewer mode is read-only. Switch to admin to add, edit, or delete transactions.
        </div>
      )}

      <div className="tx-table-wrapper">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th className="numeric-cell">Amount</th>
              {role === "admin" && <th className="actions-cell">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={role === "admin" ? 6 : 5}>
                  <div className="empty-state">
                    <p className="empty-state-title">No transactions match these filters.</p>
                    <p className="empty-state-copy">
                      Try adjusting the search, filters, or add a new transaction.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="date-cell">{transaction.date}</td>
                  <td>{transaction.desc}</td>
                  <td>
                    <span className={`cat-badge cat-${transaction.cat}`}>
                      {transaction.cat}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td
                    className={`numeric-cell amount-cell ${
                      transaction.amount > 0 ? "positive" : "negative"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </td>
                  {role === "admin" && (
                    <td className="actions-cell">
                      <div className="table-actions">
                        <button
                          className="btn-inline"
                          onClick={() => openEditModal(transaction)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-inline btn-inline-danger"
                          onClick={() => setPendingDelete(transaction)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalMode && role === "admin" && (
        <TransactionModal
          mode={modalMode}
          transaction={activeTransaction}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {pendingDelete && role === "admin" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Confirm action</p>
                <h2 className="modal-title">Delete Transaction</h2>
              </div>
              <button
                className="icon-btn"
                onClick={() => setPendingDelete(null)}
                aria-label="Close dialog"
              >
                x
              </button>
            </div>
            <p className="confirm-copy">
              Remove <strong>{pendingDelete.desc}</strong> from <strong>{pendingDelete.date}</strong>?
              This action cannot be undone from the UI.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button
                className="btn-primary btn-danger"
                onClick={() => {
                  onDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
