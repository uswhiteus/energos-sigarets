import React from "react";

import {
  getTodayKey,
  formatTime,
  formatInterval,
} from "../utils/dates";

import { getReasonLabel } from "../utils/reasons";

export default function History({ history = {} }) {
  const today = getTodayKey();

  const todayEntries = history[today] || [];

  const sortedEntries = [...todayEntries].sort(
    (a, b) =>
      new Date(b.timestamp) -
      new Date(a.timestamp)
  );

  return (
    <main className="page">
      <h2>История</h2>

      <p className="page-subtitle">
        Всё, что ты употребил сегодня.
      </p>

      {sortedEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            📋
          </div>

          <h3>Пока пусто</h3>

          <p>
            Добавленные сигареты и энергетики
            появятся здесь.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {sortedEntries.map((entry, index) => {
            const isCigarette =
              entry.type === "cigarette";

            return (
              <div
                className={`history-item ${
                  isCigarette
                    ? "cigarette-item"
                    : "energy-item"
                }`}
                key={
                  entry.id ||
                  `${entry.timestamp}-${index}`
                }
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

                    {isCigarette &&
                      entry.reason && (
                        <>
                          {" • "}
                          {getReasonLabel(
                            entry.reason
                          )}
                        </>
                      )}

                    {!isCigarette &&
                      entry.amount && (
                        <>
                          {" • "}
                          {entry.amount} мл
                        </>
                      )}
                  </div>

                  {isCigarette &&
                    entry.interval > 0 && (
                      <div className="history-item-interval">
                        Интервал:{" "}
                        {formatInterval(
                          entry.interval
                        )}
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