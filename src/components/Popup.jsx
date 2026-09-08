import React from "react";

export default function Popup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="popup-icon">⚠️</div>

        <div className="popup-message">
          {message}
        </div>

        <button className="popup-button" onClick={onClose}>
          Понял
        </button>
      </div>
    </div>
  );
}