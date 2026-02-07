// Shared rarity helpers.
(function () {
  function generateRarity(rarityTable, combo) {
    const table = rarityTable || {};
    const common = table.COMMON || { name: "common", weight: 60 };
    const rare = table.RARE || { name: "rare", weight: 25 };
    const epic = table.EPIC || { name: "epic", weight: 12 };
    const legendary = table.LEGENDARY || { name: "legendary", weight: 3 };

    const roll = Math.random() * 100;
    const legendaryBonus = Math.min(combo * 0.5, 10);
    const epicBonus = Math.min(combo * 1, 20);
    const rareBonus = Math.min(combo * 2, 30);

    const legendaryThreshold = legendary.weight + legendaryBonus;
    const epicThreshold = legendaryThreshold + epic.weight + epicBonus;
    const rareThreshold = epicThreshold + rare.weight + rareBonus;

    if (roll < legendaryThreshold) return legendary;
    if (roll < epicThreshold) return epic;
    if (roll < rareThreshold) return rare;
    return common;
  }

  function getRarityColor(rarityTable, rarityName) {
    const table = rarityTable || {};
    const list = Object.values(table);
    const found = list.find((entry) => entry && entry.name === rarityName);
    return found ? found.color : "#ffffff";
  }

  window.DP_RARITY = {
    generateRarity,
    getRarityColor,
  };
})();

