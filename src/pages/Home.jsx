import React from "react";

import TrackCard from "../components/TrackCard";
import EnergyButtons from "../components/EnergyButtons";

export default function Home({
  cigaretteCount = 0,
  energyCount = 0,
  energyMl = 0,
  cigaretteLimit = 10,
  energyLimit = 2,
  onAddCigarette,
  onAddEnergy,
  onUrge,
}) {
  return (
    <main className="page">
      <h2>Сегодня</h2>

      <p className="page-subtitle">
        Контролируй привычки, а не они тебя.
      </p>

      <TrackCard
        title="Сигареты"
        icon="🚬"
        count={cigaretteCount}
        limit={cigaretteLimit}
        onAdd={onAddCigarette}
        type="cigarette"
      />

      <section className="track-card energy">
        <div className="track-card-header">
          <div className="track-card-title">
            <span className="track-card-icon">⚡</span>
            <span>Энергетики</span>
          </div>

          <div className="track-card-count">
            {energyCount}
          </div>
        </div>

        <div className="energy-volume">
          Сегодня выпито: <strong>{energyMl} мл</strong>
        </div>

        <div className="track-card-limit">
          Лимит: {energyLimit}
        </div>

        <EnergyButtons onAdd={onAddEnergy} />
      </section>

      <button
        className="urge-main-button"
        onClick={onUrge}
      >
        <span>🔥</span>
        МЕНЯ ТЯНЕТ
      </button>
    </main>
  );
}