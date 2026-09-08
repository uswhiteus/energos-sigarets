const STORAGE_KEY = "my-control-v2";

const defaultData = {
  settings: {
    cigaretteLimit: 10,
    energyLimit: 2,
    cigarettePrice: 250,
    energyPrice: 100,
    reductionEnabled: false,
    reductionStep: 1,
    reductionDays: 7,
  },

  history: {},
};

export function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultData;
    }

    const parsed = JSON.parse(saved);

    return {
      settings: {
        ...defaultData.settings,
        ...(parsed.settings || {}),
      },

      history: parsed.history || {},
    };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);

    return defaultData;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Ошибка сохранения данных:", error);
  }
}

export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
  }
}