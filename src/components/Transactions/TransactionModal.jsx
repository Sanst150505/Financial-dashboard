import { useEffect, useState } from "react";
import { CATEGORIES } from "../../data/mockData";

const EMPTY_FORM = {
  date: new Date().toISOString().split("T")[0],
  desc: "",
  amount: "",
  cat: "Food",
  type: "expense",
};

export default function TransactionModal({ mode, transaction, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!transaction) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      id: transaction.id,
      date: transaction.date,
      desc: transaction.desc,
      amount: Math.abs(transaction.amount).toString(),
      cat: transaction.cat,
      type: transaction.type,
    });
  }, [transaction]);

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.desc.trim() || !form.amount || !form.date) {
      return;
    }

    const normalizedAmount =
      form.type === "expense"
        ? -Math.abs(Number(form.amount))
        : Math.abs(Number(form.amount));

    onSave({
      id: transaction?.id ?? undefined,
      date: form.date,
      desc: form.desc.trim(),
      amount: normalizedAmount,
      cat: form.type === "income" ? "Income" : form.cat,
      type: form.type,
    });
    onClose();
  };

  const availableCategories =
    form.type === "income" ? ["Income"] : CATEGORIES.filter((category) => category !== "Income");

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{mode === "edit" ? "Update entry" : "New entry"}</p>
            <h2 className="modal-title">
              {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
            </h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            x
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(event) => setField("date", event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(event) => setField("type", event.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Grocery run"
            value={form.desc}
            onChange={(event) => setField("desc", event.target.value)}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(event) => setField("amount", event.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.type === "income" ? "Income" : form.cat}
              onChange={(event) => setField("cat", event.target.value)}
              disabled={form.type === "income"}
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {mode === "edit" ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
