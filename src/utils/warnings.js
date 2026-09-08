export function getWarning(type, count, limit) {
  if (!limit || count <= 0) {
    return null;
  }

  const ratio = count / limit;

  // 1×
  if (ratio >= 1 && ratio < 1.5) {
    return "Неплохо брат, на этом и тормознем";
  }

  // 1.5×
  if (ratio >= 1.5 && ratio < 2) {
    if (type === "cigarette") {
      return "побереги лёгкие";
    }

    if (type === "energy") {
      return "побереги сердечко";
    }
  }

  // 2×
  if (ratio >= 2 && ratio < 2.5) {
    if (type === "cigarette") {
      return "я конечно понимаю, что ты заядлый курильщик, но всё-таки хватит";
    }

    if (type === "energy") {
      return "ну все теперь ты монстр энергии, тормози, разобьётся";
    }
  }

  // 2.5×
  if (ratio >= 2.5 && ratio < 3) {
    if (type === "cigarette") {
      return "ооооо, вижу уже дым из ушей пошел";
    }

    if (type === "energy") {
      return "такими темпами сердце выпрыгнет и убежит";
    }
  }

  // 3×
  if (ratio >= 3 && ratio < 4) {
    if (type === "cigarette") {
      return "импотенция брат, не забывай";
    }

    if (type === "energy") {
      return "теперь тебе передвигаться исключительно колесом, иначе зачем это вообще";
    }
  }

  // 4× и выше
  if (ratio >= 4) {
    return "зря ты думаешь, что будешь жить вечно";
  }

  return null;
}