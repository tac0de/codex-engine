// Shared state/storage helpers.
(function () {
  function getNumber(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = parseInt(raw || "", 10);
      return Number.isFinite(parsed) ? parsed : fallbackValue;
    } catch {
      return fallbackValue;
    }
  }

  function setNumber(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  }

  function getJSON(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  }

  function setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  window.DP_STATE = {
    getNumber,
    setNumber,
    getJSON,
    setJSON,
  };
})();

