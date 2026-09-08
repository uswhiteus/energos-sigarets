import React from "react";

export default function EnergyButtons({ onAdd }) {
  const sizes = [250, 330, 450, 500];

  return (
    <div className="energy-buttons">
      {sizes.map((size) => (
        <button
          key={size}
          className="energy-button"
          onClick={() => onAdd(size)}
        >
          <span className="energy-button-number">{size}</span>
          <span className="energy-button-unit">мл</span>
        </button>
      ))}
    </div>
  );
}