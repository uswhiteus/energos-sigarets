import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const STORAGE_KEY = "my-control-v1";

const defaultState = {
  cigaretteLimit: 10,
  energyLimit: 2,
  cigarettePrice: 250,
  energyPrice: 100,
  history: {}
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);

    return {
      ...defaultState,
      ...parsed,
      history: parsed.history || {}
    };
  } catch {
    return defaultState;
  }
}

function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("home");
  const [popup, setPopup] = useState(null);

  const today = todayKey();

  const todayData = state.history[today] || {
    cigarettes: 0,
    energy: 0,
    energyMl: 0
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  function addCigarette() {
    const oldCount = todayData.cigarettes;
    const newCount = oldCount + 1;

    setState(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [today]: {
          ...(prev.history[today] || {}),
          cigarettes: newCount,
          energy: todayData.energy,
          energyMl: todayData.energyMl
        }
      }
    }));

    if (
      oldCount < state.cigaretteLimit &&
      newCount >= state.cigaretteLimit
    ) {
      setPopup("Неплохо брат, на этом и тормознем");
    }
  }

  function addEnergy(ml) {
    const oldCount = todayData.energy;
    const newCount = oldCount + 1;

    setState(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [today]: {
          ...(prev.history[today] || {}),
          cigarettes: todayData.cigarettes,
          energy: newCount,
          energyMl: todayData.energyMl + ml
        }
      }
    }));

    if (
      oldCount < state.energyLimit &&
      newCount >= state.energyLimit
    ) {
      setPopup("Неплохо брат, на этом и тормознем");
    }
  }

  function saveSettings(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    setState(prev => ({
      ...prev,
      cigaretteLimit: Number(form.get("cigaretteLimit")) || 1,
      energyLimit: Number(form.get("energyLimit")) || 1,
      cigarettePrice: Number(form.get("cigarettePrice")) || 0,
      energyPrice: Number(form.get("energyPrice")) || 0
    }));

    setPopup("Настройки сохранены");
  }

  const cigaretteProgress = Math.min(
    100,
    (todayData.cigarettes / state.cigaretteLimit) * 100
  );

  const energyProgress = Math.min(
    100,
    (todayData.energy / state.energyLimit) * 100
  );

  return (
    <div className="app">
      {popup && (
        <div className="popup">
          <div className="popup-icon">🔥</div>
          <div>
            <div className="popup-title">Мой контроль</div>
            <div className="popup-text">{popup}</div>
          </div>
          <button onClick={() => setPopup(null)}>×</button>
        </div>
      )}

      <header className="header">
        <div>
          <div className="eyebrow">ЛИЧНЫЙ ТРЕКЕР</div>
          <h1>Мой контроль</h1>
        </div>
      </header>

      {tab === "home" && (
        <main className="content">
          <section className="today-card">
            <div className="card-label">СЕГОДНЯ</div>

            <div className="big-number">
              {todayData.cigarettes + todayData.energy}
            </div>

            <div className="muted">всего привычек</div>
          </section>

          <section className="track-card">
            <div className="track-header">
              <div>
                <div className="track-title">🚬 Сигареты</div>
                <div className="track-value">
                  {todayData.cigarettes} / {state.cigaretteLimit}
                </div>
              </div>

              <button className="add-button" onClick={addCigarette}>
                +
              </button>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${cigaretteProgress}%` }}
              />
            </div>

            <div className="track-footer">
              {todayData.cigarettes >= state.cigaretteLimit
                ? "Лимит достигнут"
                : `Осталось ${state.cigaretteLimit - todayData.cigarettes}`}
            </div>
          </section>

          <section className="track-card">
            <div className="track-header">
              <div>
                <div className="track-title">⚡ Энергетики</div>
                <div className="track-value">
                  {todayData.energy} / {state.energyLimit}
                </div>
              </div>
            </div>

            <div className="energy-buttons">
              {[250, 330, 450, 500].map(ml => (
                <button
                  key={ml}
                  className="energy-button"
                  onClick={() => addEnergy(ml)}
                >
                  + {ml} мл
                </button>
              ))}
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${energyProgress}%` }}
              />
            </div>

            <div className="track-footer">
              {todayData.energy >= state.energyLimit
                ? "Лимит достигнут"
                : `Осталось ${state.energyLimit - todayData.energy}`}
            </div>
          </section>
        </main>
      )}

      {tab === "history" && (
        <main className="content">
          <h2>История</h2>

          {Object.keys(state.history).length === 0 ? (
            <div className="empty">Пока записей нет</div>
          ) : (
            Object.entries(state.history)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([date, data]) => (
                <div className="history-card" key={date}>
                  <div className="history-date">{date}</div>
                  <div>🚬 {data.cigarettes || 0}</div>
                  <div>⚡ {data.energy || 0}</div>
                  <div>{data.energyMl || 0} мл</div>
                </div>
              ))
          )}
        </main>
      )}

      {tab === "stats" && (
        <main className="content">
          <h2>Статистика</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <span>🚬 Сегодня</span>
              <strong>{todayData.cigarettes}</strong>
            </div>

            <div className="stat-card">
              <span>⚡ Сегодня</span>
              <strong>{todayData.energy}</strong>
            </div>

            <div className="stat-card">
              <span>⚡ Объём</span>
              <strong>{todayData.energyMl} мл</strong>
            </div>
          </div>
        </main>
      )}

      {tab === "settings" && (
        <main className="content">
          <h2>Настройки</h2>

          <form className="settings" onSubmit={saveSettings}>
            <label>
              Лимит сигарет
              <input
                name="cigaretteLimit"
                type="number"
                min="1"
                defaultValue={state.cigaretteLimit}
              />
            </label>

            <label>
              Лимит энергетиков
              <input
                name="energyLimit"
                type="number"
                min="1"
                defaultValue={state.energyLimit}
              />
            </label>

            <label>
              Цена сигарет
              <input
                name="cigarettePrice"
                type="number"
                min="0"
                defaultValue={state.cigarettePrice}
              />
            </label>

            <label>
              Цена энергетика
              <input
                name="energyPrice"
                type="number"
                min="0"
                defaultValue={state.energyPrice}
              />
            </label>

            <button className="save-button" type="submit">
              Сохранить
            </button>
          </form>
        </main>
      )}

      <nav className="bottom-nav">
        <button
          className={tab === "home" ? "active" : ""}
          onClick={() => setTab("home")}
        >
          <span>⌂</span>
          Главная
        </button>

        <button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          <span>☷</span>
          История
        </button>

        <button
          className={tab === "stats" ? "active" : ""}
          onClick={() => setTab("stats")}
        >
          <span>◒</span>
          Статистика
        </button>

        <button
          className={tab === "settings" ? "active" : ""}
          onClick={() => setTab("settings")}
        >
          <span>⚙</span>
          Настройки
        </button>
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);