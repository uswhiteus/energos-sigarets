import React from "react";

import { getTodayKey, formatInterval } from "../utils/dates";

import {
  getTodayEntries,
  getCigarettes,
  getEnergy,
  getEnergyMl,
  getAverageCigaretteInterval,
  getReasonStats,
} from "../utils/statistics";

export default function Stats({ history = {} }) {
  const today = getTodayKey();

  const entries = getTodayEntries(history, today);

  const cigarettes = getCigarettes(entries);
  const energy = getEnergy(entries);

  const energyMl = getEnergyMl(entries);

  const averageInterval =
    getAverageCigaretteInterval(entries);

  const reasons = getReasonStats(entries);

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
            {formatInterval(averageInterval) || "—"}
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
            {reasons.map((item) => (
              <div
                className="reason-stat"
                key={item.reason}
              >
                <div className="reason-stat-header">
                  <span>{item.label}</span>

                  <strong>
                    {item.count} ({item.percentage}%)
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}