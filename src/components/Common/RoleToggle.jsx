import { useState } from "react";

const ROLES = [
  { id: "viewer", label: "Viewer" },
  { id: "admin", label: "Admin" },
];

function ChevronIcon() {
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

export default function RoleToggle({ role, setRole, compact = false }) {
  const [open, setOpen] = useState(false);
  const current = ROLES.find((option) => option.id === role);

  return (
    <div className={`role-switcher ${compact ? "role-switcher--compact" : ""}`}>
      {!compact && <p className="role-helper">Switch between viewer and admin access.</p>}

      <button className="role-current" onClick={() => setOpen((value) => !value)}>
        {current?.label}
        <ChevronIcon />
      </button>

      {open && (
        <div className={`role-menu ${compact ? "role-menu--down" : "role-menu--up"}`}>
          {ROLES.map((option) => (
            <button
              key={option.id}
              className={`role-menu__item ${role === option.id ? "active" : ""}`}
              onClick={() => {
                setRole(option.id);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
