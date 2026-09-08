import React, { useEffect, useState } from "react";

export default function UrgeTimer({ onClose }) {
  const TOTAL_TIME = 5 * 60;

  const [seconds, setSeconds] = useState(TOTAL_TIME);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const progress = ((TOTAL_TIME - seconds) / TOTAL_TIME) * 100;

  return (
    <div className="modal-overlay">
      <div className="urge-timer">
        <div className="urge-icon">🔥</div>

        <h2>ТЕБЯ ТЯНЕТ</h2>

        <p>
          Подожди немного.
          <br />
          Желание может пройти само.
        </p>

        <div className="urge-time">
          {minutes}:{String(secs).padStart(2, "0")}
        </div>

        <div className="progress-bar urge-progress">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {seconds === 0 ? (
          <div className="urge-finished">
            <h3>5 минут прошло 💪</h3>

            <button
              className="urge-button"
              onClick={onClose}
            >
              Уже отпустило
            </button>

            <button
              className="urge-secondary-button"
              onClick={onClose}
            >
              Всё ещё хочу
            </button>
          </div>
        ) : (
          <button
            className="urge-secondary-button"
            onClick={onClose}
          >
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
}