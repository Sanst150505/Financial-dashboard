import { useEffect, useRef, useState } from "react";
import RoleToggle from "./components/Common/RoleToggle";
import DashboardPage from "./pages/Dashboard";
import TransactionsTable from "./components/Transactions/TransactionsTable";
import useTransactions from "./hooks/useTransactions";
import "./index.css";

const NAV_PRIMARY = [
  { id: "dashboard", label: "Overview", active: true },
  { id: "transactions", label: "Transactions", active: true },
];

const NAV_SUPPORT = [
  { id: "settings", label: "Settings" },
  { id: "feedback", label: "Feedback" },
  { id: "help", label: "Help Center" },
];

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("financial-dashboard-theme") || "dark";
}

function ThemeIcon({ theme }) {
  return theme === "dark" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.5 3.5a1 1 0 0 1 .8 1.6A7 7 0 1 0 18.9 16a1 1 0 0 1 1.2 1.3A9 9 0 1 1 14.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path
        d="M12 1.8v2.5M12 19.7v2.5M1.8 12h2.5M19.7 12h2.5M4.4 4.4l1.8 1.8M17.8 17.8l1.8 1.8M4.4 19.6l1.8-1.8M17.8 6.2l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10.5 12 15l5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 17h8l-1.1-1.6a5.6 5.6 0 0 1-.9-3.1V10a4 4 0 1 0-8 0v2.3c0 1.1-.3 2.2-.9 3.1L8 17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("viewer");
  const [theme, setTheme] = useState(getStoredTheme);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef(null);
  const { transactions, addTransaction, updateTransaction, deleteTransaction, resetTransactions } =
    useTransactions();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("financial-dashboard-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <div
        className={`app-backdrop ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            Fin<span>Dash</span>
          </div>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            x
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">Menu</span>
          <nav className="sidebar-nav" aria-label="Primary">
            {NAV_PRIMARY.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => {
                  setPage(item.id);
                  closeSidebar();
                }}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-section sidebar-section--secondary">
          <div className="sidebar-nav" aria-label="Support">
            {NAV_SUPPORT.map((item) => (
              <button key={item.id} className="nav-item nav-item--secondary" type="button">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </button>
            <h1 className="topbar-title">
              {page === "transactions" ? "Transactions" : "Overview"}
            </h1>
          </div>

          <div className="topbar-right">
            <button className="icon-button" type="button" aria-label="Notifications">
              <BellIcon />
            </button>

            <button
              className={`theme-switch ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="theme-switch__icon">
                <ThemeIcon theme={theme} />
              </span>
            </button>

            <div className="profile" ref={profileRef}>
              <button
                className="profile-trigger"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="profile-trigger__avatar" aria-hidden="true" />
                <span className="profile-trigger__text">
                  <strong>Sannidhya Tiwari</strong>
                  <span>{role === "admin" ? "Admin" : "Viewer"}</span>
                </span>
                <span className="profile-trigger__chevron" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </button>

              {profileOpen && (
                <div className="profile-menu" role="menu">
                  <div className="profile-menu__header">
                    <strong>Sannidhya Tiwari</strong>
                    <span>Personal finance workspace</span>
                  </div>
                  <div className="profile-menu__section profile-menu__section--role">
                    <span className="profile-menu__label">User Role</span>
                    <RoleToggle role={role} setRole={setRole} compact />
                  </div>
                  <button className="profile-menu__item" role="menuitem">
                    View profile
                  </button>
                  <button className="profile-menu__item" role="menuitem">
                    Preferences
                  </button>
                  <button
                    className="profile-menu__item"
                    role="menuitem"
                    onClick={() => {
                      resetTransactions();
                      setProfileOpen(false);
                    }}
                  >
                    Restore sample data
                  </button>
                  <button className="profile-menu__item profile-menu__item--danger" role="menuitem">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" ? (
            <DashboardPage
              transactions={transactions}
              role={role}
              onAdd={addTransaction}
              onEdit={updateTransaction}
              onDelete={deleteTransaction}
            />
          ) : (
            <TransactionsTable
              transactions={transactions}
              role={role}
              onAdd={addTransaction}
              onEdit={updateTransaction}
              onDelete={deleteTransaction}
              title="Transactions"
              description="Search, filter, sort, and manage your transaction history."
            />
          )}
        </div>
      </main>
    </div>
  );
}
