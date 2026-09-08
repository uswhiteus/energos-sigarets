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

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultState;
    }

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

/*
  Возвращает текст предупреждения в зависимости
  от того, во сколько раз превышен дневной лимит.
*/
function getWarning(type, count, limit) {
  if (!limit || count < limit) {
    return null;
  }

  const multiplier = count / limit;

  // 1x
  if (multiplier >= 1 && multiplier < 1.5) {
    return "Неплохо брат, на этом и тормознем";
  }

  // 1.5x
  if (multiplier >= 1.5 && multiplier < 2) {
    return type === "cigarettes"
      ? "Побереги лёгкие"
      : "Побереги сердечко";
  }

  // 2x
  if (multiplier >= 2 && multiplier < 2.5) {
    return type === "cigarettes"
      ? "Я конечно понимаю, что ты заядлый курильщик, но всё-таки хватит"
      : "Ну все теперь ты монстр энергии, тормози, разобьётся";
  }

  // 2.5x
  if (multiplier >= 2.5 && multiplier < 3) {
    return type === "cigarettes"
      ? "Ооооо, вижу уже дым из ушей пошел"
      : "Такими темпами сердце выпрыгнет и убежит";
  }

  // 3x
  if (multiplier >= 3 && multiplier < 4) {
    return type === "cigarettes"
      ? "Импотенция брат, не забывай"
      : "Теперь тебе передвигаться исключительно колесом, иначе зачем это вообще";
  }

  // 4x и дальше
  return "Зря ты думаешь, что будешь жить вечно";
}

/*
  Определяем уровень предупреждения.

  1 = достиг лимита
  2 = 1.5x
  3 = 2x
  4 = 2.5x
  5 = 3x
  6 = 4x
  7 = 5x
  и т.д.
*/
function getWarningLevel(count, limit) {
  if (!limit || count < limit) {
    return 0;
  }

  const multiplier = count / limit;

  if (multiplier < 1.5) return 1;
  if (multiplier < 2) return 2;
  if (multiplier < 2.5) return 3;
  if (multiplier < 3) return 4;
  if (multiplier < 4) return 5;

  // После 3x каждое следующее целое превышение
  // даёт новое предупреждение.
  return Math.floor(multiplier) + 2;
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
    if (!popup) return;

    const timer = setTimeout(() => {
      setPopup(null);
    }, 4500);

    return () => clearTimeout(timer);
  }, [popup]);

  function showWarning(type, oldCount, newCount, limit) {
    const oldLevel = getWarningLevel(oldCount, limit);
    const newLevel = getWarningLevel(newCount, limit);

    // Показываем сообщение только когда
    // пользователь перешёл на новый уровень.
    if (newLevel > oldLevel && newLevel > 0) {
      const message = getWarning(type, newCount, limit);

      if (message) {
        setPopup(message);
      }
    }
  }

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

    showWarning(
      "cigarettes",
      oldCount,
      newCount,
      state.cigaretteLimit
    );
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

    showWarning(
      "energy",
      oldCount,
      newCount,
      state.energyLimit
    );
  }

  function saveSettings(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    setState(prev => ({
      ...prev,
      cigaretteLimit:
        Number(form.get("cigaretteLimit")) || 1,

      energyLimit:
        Number(form.get("energyLimit")) || 1,

      cigarettePrice:
        Number(form.get("cigarettePrice")) || 0,

      energyPrice:
        Number(form.get("energyPrice")) || 0
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

          <div className="popup-content">
            <div className="popup-title">
              Мой контроль
            </div>

            <div className="popup-text">
              {popup}
            </div>
          </div>

          <button
            className="popup-close"
            onClick={() => setPopup(null)}
          >
            ×
          </button>
        </div>
      )}

      <header className="header">
        <div>
          <div className="eyebrow">
            ЛИЧНЫЙ ТРЕКЕР
          </div>

          <h1>
            Мой контроль
          </h1>
        </div>
      </header>

      {tab === "home" && (
        <main className="content">

          <section className="today-card">
            <div className="card-label">
              СЕГОДНЯ
            </div>

            <div className="big-number">
              {todayData.cigarettes + todayData.energy}
            </div>

            <div className="muted">
              всего привычек
            </div>
          </section>

          <section className="track-card">

            <div className="track-header">

              <div>
                <div className="track-title">
                  🚬 Сигареты
                </div>

                <div className="track-value">
                  {todayData.cigarettes} / {state.cigaretteLimit}
                </div>
              </div>

              <button
                className="add-button"
                onClick={addCigarette}
              >
                +
              </button>

            </div>

            <div className="progress">

              <div
                className="progress-fill"
                style={{
                  width: `${cigaretteProgress}%`
                }}
              />

            </div>

            <div className="track-footer">

              {todayData.cigarettes >= state.cigaretteLimit
                ? "Лимит превышен"
                : `Осталось ${
                    state.cigaretteLimit -
                    todayData.cigarettes
                  }`}

            </div>

          </section>

          <section className="track-card">

            <div className="track-header">

              <div>
                <div className="track-title">
                  ⚡ Энергетики
                </div>

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
                style={{
                  width: `${energyProgress}%`
                }}
              />

            </div>

            <div className="track-footer">

              {todayData.energy >= state.energyLimit
                ? "Лимит превышен"
                : `Осталось ${
                    state.energyLimit -
                    todayData.energy
                  }`}

            </div>

          </section>

        </main>
      )}

      {tab === "history" && (

        <main className="content">

          <h2>
            История
          </h2>

          {Object.keys(state.history).length === 0 ? (

            <div className="empty">
              Пока записей нет
            </div>

          ) : (

            Object.entries(state.history)
              .sort((a, b) =>
                b[0].localeCompare(a[0])
              )
              .map(([date, data]) => (

                <div
                  className="history-card"
                  key={date}
                >

                  <div className="history-date">
                    {date}
                  </div>

                  <div>
                    🚬 {data.cigarettes || 0}
                  </div>

                  <div>
                    ⚡ {data.energy || 0}
                  </div>

                  <div>
                    {data.energyMl || 0} мл
                  </div>

                </div>

              ))

          )}

        </main>

      )}

      {tab === "stats" && (

        <main className="content">

          <h2>
            Статистика
          </h2>

          <div className="stats-grid">

            <div className="stat-card">
              <span>
                🚬 Сегодня
              </span>

              <strong>
                {todayData.cigarettes}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                ⚡ Сегодня
              </span>

              <strong>
                {todayData.energy}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                ⚡ Объём
              </span>

              <strong>
                {todayData.energyMl} мл
              </strong>
            </div>

          </div>

        </main>

      )}

      {tab === "settings" && (

        <main className="content">

          <h2>
            Настройки
          </h2>

          <form
            className="settings"
            onSubmit={saveSettings}
          >

            <label>
              Лимит сигарет

              <input
                name="cigaretteLimit"
                type="number"
                min="1"
                defaultValue={
                  state.cigaretteLimit
                }
              />
            </label>

            <label>
              Лимит энергетиков

              <input
                name="energyLimit"
                type="number"
                min="1"
                defaultValue={
                  state.energyLimit
                }
              />
            </label>

            <label>
              Цена сигарет

              <input
                name="cigarettePrice"
                type="number"
                min="0"
                defaultValue={
                  state.cigarettePrice
                }
              />
            </label>

            <label>
              Цена энергетика

              <input
                name="energyPrice"
                type="number"
                min="0"
                defaultValue={
                  state.energyPrice
                }
              />
            </label>

            <button
              className="save-button"
              type="submit"
            >
              Сохранить
            </button>

          </form>

        </main>

      )}

      <nav className="bottom-nav">

        <button
          className={
            tab === "home"
              ? "active"
              : ""
          }
          onClick={() => setTab("home")}
        >
          <span>⌂</span>
          Главная
        </button>

        <button
          className={
            tab === "history"
              ? "active"
              : ""
          }
          onClick={() => setTab("history")}
        >
          <span>☷</span>
          История
        </button>

        <button
          className={
            tab === "stats"
              ? "active"
              : ""
          }
          onClick={() => setTab("stats")}
        >
          <span>◒</span>
          Статистика
        </button>

        <button
          className={
            tab === "settings"
              ? "active"
              : ""
          }
          onClick={() => setTab("settings")}
        >
          <span>⚙</span>
          Настройки
        </button>

      </nav>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);