import React from "react";

const reasons = [
  { id: "want", label: "Просто захотелось", icon: "😏" },
  { id: "stress", label: "Стресс", icon: "😤" },
  { id: "tired", label: "Усталость", icon: "😴" },
  { id: "food", label: "После еды", icon: "🍽️" },
  { id: "company", label: "За компанию", icon: "👥" },
  { id: "habit", label: "По привычке", icon: "🔄" },
  { id: "alcohol", label: "После алкоголя", icon: "🍺" },
  { id: "other", label: "Другое", icon: "❓" },
];

export default function ReasonModal({ isOpen, onSelect, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="reason-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reason-modal-header">
          <h2>Почему сейчас?</h2>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <p className="reason-modal-subtitle">
          Выбери причину — это поможет понять свои привычки.
        </p>

        <div className="reasons-list">
          {reasons.map((reason) => (
            <button
              key={reason.id}
              className="reason-button"
              onClick={() => onSelect(reason.id)}
            >
              <span className="reason-icon">{reason.icon}</span>
              <span>{reason.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}