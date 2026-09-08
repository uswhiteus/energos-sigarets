import React from "react";

export default function ProgressBar({ value, max }) {
  const progress =
    max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}