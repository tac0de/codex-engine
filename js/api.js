// Shared API client for generate endpoint.
(function () {
  async function generateAbility(payload) {
    const endpoint =
      (window.DP_CONFIG && window.DP_CONFIG.API_ENDPOINT) || "/api/generate";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  window.DP_API = { generateAbility };
})();

