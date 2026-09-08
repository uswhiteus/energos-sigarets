import React from "react";

export default function TrackCard({
  title,
  icon,
  count,
  limit,
  unit = "",
  onAdd,
  type,
}) {
  const progress = limit > 0 ? Math.min((count / limit) * 100, 100) : 0;

  return (
    <section className={`track-card ${type || ""}`}>
      <div className="track-card-header">
        <div className="track-card-title">
          <span className="track-card-icon">{icon}</span>
          <span>{title}</span>
        </div>

        <div className="track-card-count">
          {count}
          {unit && <span>{unit}</span>}
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="track-card-limit">
        Лимит: {limit}
        {unit && ` ${unit}`}
      </div>

      <button className="track-add-button" onClick={onAdd}>
        + ДОБАВИТЬ
      </button>
    </section>
  );
}