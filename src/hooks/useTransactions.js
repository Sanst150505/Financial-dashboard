import { useEffect, useState } from "react";
import { initialTransactions } from "../data/mockData";

const STORAGE_KEY = "financial-dashboard-transactions";

function readStoredTransactions() {
  if (typeof window === "undefined") {
    return initialTransactions;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initialTransactions;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTransactions;
  } catch {
    return initialTransactions;
  }
}

export default function useTransactions() {
  const [transactions, setTransactions] = useState(readStoredTransactions);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions((current) => [
      {
        ...transaction,
        id: Date.now(),
      },
      ...current,
    ]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  };

  const resetTransactions = () => {
    setTransactions(initialTransactions);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactions,
  };
}
