import React from "react";

export default function History({ history = {} }) {
  const today = new Date().toISOString().split("T")[0];

  const todayEntries = history[today] || [];

  const sortedEntries = [...todayEntries].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";

    return new Date(timestamp).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonName = (reason) => {
    const reasons = {
      want: "Просто захотелось",
      stress: "Стресс",
      tired: "Усталость",
      food: "После еды",
      company: "За компанию",
      habit: "По привычке",
      alcohol: "После алкоголя",
      other: "Другое",
    };

    return reasons[reason] || "";
  };

  return (
    <main className="page">
      <h2>История</h2>

      <p className="page-subtitle">
        Всё, что ты употребил сегодня.
      </p>

      {sortedEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Пока пусто</h3>
          <p>
            Добавленные сигареты и энергетики появятся здесь.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {sortedEntries.map((entry, index) => {
            const isCigarette = entry.type === "cigarette";

            return (
              <div
                className={`history-item ${
                  isCigarette ? "cigarette-item" : "energy-item"
                }`}
                key={entry.id || `${entry.timestamp}-${index}`}
              >
                <div className="history-item-icon">
                  {isCigarette ? "🚬" : "⚡"}
                </div>

                <div className="history-item-info">
                  <div className="history-item-title">
                    {isCigarette
                      ? "Сигарета"
                      : "Энергетик"}
                  </div>

                  <div className="history-item-details">
                    {formatTime(entry.timestamp)}

                    {entry.reason && (
                      <>
                        {" • "}
                        {getReasonName(entry.reason)}
                      </>
                    )}

                    {entry.amount && (
                      <>
                        {" • "}
                        {entry.amount} мл
                      </>
                    )}
                  </div>

                  {entry.interval && (
                    <div className="history-item-interval">
                      Интервал: {entry.interval}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}