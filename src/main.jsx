import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const STORAGE_KEY = "my-control-v1";

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      cigarettes: [],
      energy: [],
      cigaretteLimit: 10,
      energyLimit: 2,
      cigarettePrice: 250,
      energyPrice: 100
    };
  } catch {
    return {
      cigarettes: [],
      energy: [],
      cigaretteLimit: 10,
      energyLimit: 2,
      cigarettePrice: 250,
      energyPrice: 100
    };
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10);

const fmtTime = (date) =>
  new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });

const fmtDate = (date) =>
  new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit"
  });

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("home");
  const [energyMl, setEnergyMl] = useState(450);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const save = (next) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const today = todayKey();

  const cigsToday = data.cigarettes.filter(
    (x) => x.slice(0, 10) === today
  );

  const energyToday = data.energy.filter(
    (x) => x.time.slice(0, 10) === today
  );

  const spentToday =
    cigsToday.length * Number(data.cigarettePrice || 0) +
    energyToday.reduce(
      (sum, x) => sum + Number(x.price || data.energyPrice || 0),
      0
    );

  const addCigarette = () => {
    save({
      ...data,
      cigarettes: [
        ...data.cigarettes,
        new Date().toISOString()
      ]
    });
  };

  const addEnergy = () => {
    save({
      ...data,
      energy: [
        ...data.energy,
        {
          time: new Date().toISOString(),
          ml: Number(energyMl),
          price: Number(data.energyPrice || 0)
        }
      ]
    });
  };

  const lastCig = cigsToday[cigsToday.length - 1];

  const lastEnergy =
    energyToday[energyToday.length - 1];

  const days = useMemo(() => {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      result.push({
        key,
        label: date.toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "numeric"
        }),
        c: data.cigarettes.filter(
          (x) => x.slice(0, 10) === key
        ).length,
        e: data.energy.filter(
          (x) => x.time.slice(0, 10) === key
        ).length
      });
    }

    return result;
  }, [data]);

  const maxC = Math.max(
    1,
    ...days.map((x) => x.c)
  );

  const allHistory = [
    ...data.cigarettes.map((time) => ({
      time,
      type: "🚬 Сигарета"
    })),

    ...data.energy.map((item) => ({
      time: item.time,
      type: `⚡ Энергетик ${item.ml} мл`
    }))
  ].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  return (
    <div className="app">

      <header>
        <div>
          <h1>Мой контроль</h1>

          <div className="sub">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long"
            })}
          </div>
        </div>

        <button
          className="iconBtn"
          onClick={() => setSettingsOpen(true)}
        >
          ⚙️
        </button>
      </header>


      {tab === "home" && (
        <main>

          <section className="cards">

            <div className="card">

              <div className="emoji">🚬</div>

              <div className="label">
                Сигареты
              </div>

              <div className="big">
                {cigsToday.length}
                <span>
                  {" "} / {data.cigaretteLimit}
                </span>
              </div>

              <div className="bar">
                <i
                  style={{
                    width: `${Math.min(
                      100,
                      (cigsToday.length /
                        data.cigaretteLimit) *
                        100
                    )}%`
                  }}
                />
              </div>

              <button
                className="primary cig"
                onClick={addCigarette}
              >
                + Выкурил
              </button>

              {lastCig && (
                <div className="hint">
                  Последняя: {fmtTime(lastCig)}
                </div>
              )}

            </div>


            <div className="card">

              <div className="emoji">⚡</div>

              <div className="label">
                Энергетики
              </div>

              <div className="big">
                {energyToday.length}
                <span>
                  {" "} / {data.energyLimit}
                </span>
              </div>

              <div className="bar">
                <i
                  style={{
                    width: `${Math.min(
                      100,
                      (energyToday.length /
                        data.energyLimit) *
                        100
                    )}%`
                  }}
                />
              </div>

              <div className="selectRow">

                <select
                  value={energyMl}
                  onChange={(e) =>
                    setEnergyMl(e.target.value)
                  }
                >
                  <option value="250">
                    250 мл
                  </option>

                  <option value="330">
                    330 мл
                  </option>

                  <option value="450">
                    450 мл
                  </option>

                  <option value="500">
                    500 мл
                  </option>
                </select>

                <button
                  className="primary energy"
                  onClick={addEnergy}
                >
                  + Выпил
                </button>

              </div>

              {lastEnergy && (
                <div className="hint">
                  Последний: {fmtTime(lastEnergy.time)},{" "}
                  {lastEnergy.ml} мл
                </div>
              )}

            </div>

          </section>


          <section className="summary">

            <div>
              <b>{spentToday.toFixed(0)} ₽</b>
              <span>расходы сегодня</span>
            </div>

            <div>
              <b>
                {cigsToday.length +
                  energyToday.length}
              </b>

              <span>
                всего действий
              </span>
            </div>

          </section>


          <section className="card">

            <h2>
              Последние действия
            </h2>

            {[
              ...cigsToday.map((time) => ({
                time,
                type: "🚬 Сигарета"
              })),

              ...energyToday.map((item) => ({
                time: item.time,
                type: `⚡ Энергетик ${item.ml} мл`
              }))
            ]
              .sort(
                (a, b) =>
                  new Date(b.time) -
                  new Date(a.time)
              )
              .slice(0, 8)
              .map((item, index) => (
                <div
                  className="history"
                  key={index}
                >
                  <span>
                    {item.type}
                  </span>

                  <b>
                    {fmtTime(item.time)}
                  </b>
                </div>
              ))}

            {cigsToday.length +
              energyToday.length ===
              0 && (
              <div className="empty">
                Сегодня записей ещё нет.
              </div>
            )}

          </section>

        </main>
      )}


      {tab === "stats" && (
        <main>

          <section className="card">

            <h2>
              Статистика за 7 дней
            </h2>

            <div className="chart">

              {days.map((day) => (
                <div
                  className="col"
                  key={day.key}
                >

                  <div className="value">
                    {day.c}
                  </div>

                  <div className="barV">

                    <i
                      style={{
                        height: `${day.c /
                          maxC *
                          100}%`
                      }}
                    />

                  </div>

                  <small>
                    {day.label}
                  </small>

                </div>
              ))}

            </div>

          </section>


          <section className="summary">

            <div>
              <b>
                {(
                  days.reduce(
                    (sum, x) => sum + x.c,
                    0
                  ) / 7
                ).toFixed(1)}
              </b>

              <span>
                сигарет/день
              </span>
            </div>

            <div>
              <b>
                {(
                  days.reduce(
                    (sum, x) => sum + x.e,
                    0
                  ) / 7
                ).toFixed(1)}
              </b>

              <span>
                энергетиков/день
              </span>
            </div>

          </section>

        </main>
      )}


      {tab === "history" && (
        <main>

          <section className="card">

            <h2>
              История
            </h2>

            {allHistory
              .slice(0, 50)
              .map((item, index) => (
                <div
                  className="history"
                  key={index}
                >

                  <span>
                    {item.type} ·{" "}
                    {fmtDate(item.time)}
                  </span>

                  <b>
                    {fmtTime(item.time)}
                  </b>

                </div>
              ))}

            {!allHistory.length && (
              <div className="empty">
                История пуста.
              </div>
            )}

          </section>

        </main>
      )}


      <nav>

        <button
          className={
            tab === "home"
              ? "active"
              : ""
          }
          onClick={() => setTab("home")}
        >
          ⌂
          <span>
            Сегодня
          </span>
        </button>


        <button
          className={
            tab === "stats"
              ? "active"
              : ""
          }
          onClick={() => setTab("stats")}
        >
          ▥
          <span>
            Статистика
          </span>
        </button>


        <button
          className={
            tab === "history"
              ? "active"
              : ""
          }
          onClick={() => setTab("history")}
        >
          ☷
          <span>
            История
          </span>
        </button>

      </nav>


      {settingsOpen && (
        <div
          className="modalBg"
          onClick={() =>
            setSettingsOpen(false)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              Настройки
            </h2>


            <label>
              Лимит сигарет в день

              <input
                type="number"
                value={
                  data.cigaretteLimit
                }
                onChange={(e) =>
                  save({
                    ...data,
                    cigaretteLimit:
                      Number(
                        e.target.value
                      )
                  })
                }
              />

            </label>


            <label>
              Лимит энергетиков в день

              <input
                type="number"
                value={
                  data.energyLimit
                }
                onChange={(e) =>
                  save({
                    ...data,
                    energyLimit:
                      Number(
                        e.target.value
                      )
                  })
                }
              />

            </label>


            <label>
              Цена сигарет, ₽

              <input
                type="number"
                value={
                  data.cigarettePrice
                }
                onChange={(e) =>
                  save({
                    ...data,
                    cigarettePrice:
                      Number(
                        e.target.value
                      )
                  })
                }
              />

            </label>


            <label>
              Цена энергетика, ₽

              <input
                type="number"
                value={
                  data.energyPrice
                }
                onChange={(e) =>
                  save({
                    ...data,
                    energyPrice:
                      Number(
                        e.target.value
                      )
                  })
                }
              />

            </label>


            <button
              className="primary"
              onClick={() =>
                setSettingsOpen(false)
              }
            >
              Готово
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);