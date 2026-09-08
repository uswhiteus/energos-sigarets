import React from "react";

export default function Settings({
  settings = {},
  setSettings = () => {},
}) {
  const {
    cigaretteLimit = 10,
    energyLimit = 2,
    cigarettePrice = 250,
    energyPrice = 100,
    reductionEnabled = false,
    reductionStep = 1,
    reductionDays = 7,
  } = settings;

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className="page">
      <h2>Настройки</h2>

      <p className="page-subtitle">
        Настрой приложение под себя.
      </p>

      <section className="settings-section">
        <h3>🚬 Сигареты</h3>

        <label className="setting-row">
          <span>Дневной лимит</span>

          <input
            type="number"
            min="1"
            value={cigaretteLimit}
            onChange={(e) =>
              update(
                "cigaretteLimit",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label className="setting-row">
          <span>Цена пачки</span>

          <input
            type="number"
            min="0"
            value={cigarettePrice}
            onChange={(e) =>
              update(
                "cigarettePrice",
                Number(e.target.value)
              )
            }
          />
        </label>
      </section>

      <section className="settings-section">
        <h3>⚡ Энергетики</h3>

        <label className="setting-row">
          <span>Дневной лимит</span>

          <input
            type="number"
            min="1"
            value={energyLimit}
            onChange={(e) =>
              update(
                "energyLimit",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label className="setting-row">
          <span>Цена банки</span>

          <input
            type="number"
            min="0"
            value={energyPrice}
            onChange={(e) =>
              update(
                "energyPrice",
                Number(e.target.value)
              )
            }
          />
        </label>
      </section>

      <section className="settings-section">
        <h3>📉 Постепенное снижение</h3>

        <label className="setting-toggle">
          <span>Включить снижение</span>

          <input
            type="checkbox"
            checked={reductionEnabled}
            onChange={(e) =>
              update(
                "reductionEnabled",
                e.target.checked
              )
            }
          />
        </label>

        {reductionEnabled && (
          <>
            <label className="setting-row">
              <span>Уменьшать на</span>

              <input
                type="number"
                min="1"
                value={reductionStep}
                onChange={(e) =>
                  update(
                    "reductionStep",
                    Number(e.target.value)
                  )
                }
              />
            </label>

            <label className="setting-row">
              <span>Период, дней</span>

              <input
                type="number"
                min="1"
                value={reductionDays}
                onChange={(e) =>
                  update(
                    "reductionDays",
                    Number(e.target.value)
                  )
                }
              />
            </label>
          </>
        )}
      </section>

      <section className="settings-section settings-info">
        <h3>💡 Совет</h3>

        <p>
          Не пытайся изменить всё за один день.
          Главное — видеть реальные цифры и постепенно
          двигаться вниз.
        </p>
      </section>
    </main>
  );
}