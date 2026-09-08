import React from "react";

export default function Stats({ history = {} }) {
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = history[today] || [];

  const cigarettes = todayEntries.filter(
    (entry) => entry.type === "cigarette"
  );

  const energy = todayEntries.filter(
    (entry) => entry.type === "energy"
  );

  const energyMl = energy.reduce(
    (total, entry) => total + (Number(entry.amount) || 0),
    0
  );

  const intervals = cigarettes
    .map((entry) => Number(entry.interval))
    .filter((interval) => interval > 0);

  const averageInterval =
    intervals.length > 0
      ? Math.round(
          intervals.reduce((sum, value) => sum + value, 0) /
            intervals.length
        )
      : 0;

  const formatInterval = (minutes) => {
    if (!minutes) return "—";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} мин`;
    }

    if (mins === 0) {
      return `${hours} ч`;
    }

    return `${hours} ч ${mins} мин`;
  };

  const reasonNames = {
    want: "Просто захотелось",
    stress: "Стресс",
    tired: "Усталость",
    food: "После еды",
    company: "За компанию",
    habit: "По привычке",
    alcohol: "После алкоголя",
    other: "Другое",
  };

  const reasonStats = {};

  cigarettes.forEach((entry) => {
    const reason = entry.reason || "other";

    reasonStats[reason] =
      (reasonStats[reason] || 0) + 1;
  });

  const reasons = Object.entries(reasonStats)
    .sort((a, b) => b[1] - a[1]);

  return (
    <main className="page">
      <h2>Статистика</h2>

      <p className="page-subtitle">
        Разбираемся, что происходит с твоими привычками.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚬</div>
          <div className="stat-value">
            {cigarettes.length}
          </div>
          <div className="stat-label">
            Сигарет сегодня
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">
            {energy.length}
          </div>
          <div className="stat-label">
            Энергетиков сегодня
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🥤</div>
          <div className="stat-value">
            {energyMl}
          </div>
          <div className="stat-label">
            Мл энергетика
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">
            {formatInterval(averageInterval)}
          </div>
          <div className="stat-label">
            Средний интервал
          </div>
        </div>
      </div>

      <section className="stats-section">
        <h3>Почему ты куришь?</h3>

        {reasons.length === 0 ? (
          <div className="empty-state">
            Пока недостаточно данных.
          </div>
        ) : (
          <div className="reason-stats">
            {reasons.map(([reason, count]) => {
              const percentage = Math.round(
                (count / cigarettes.length) * 100
              );

              return (
                <div
                  className="reason-stat"
                  key={reason}
                >
                  <div className="reason-stat-header">
                    <span>
                      {reasonNames[reason] || "Другое"}
                    </span>

                    <strong>
                      {count} ({percentage}%)
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}