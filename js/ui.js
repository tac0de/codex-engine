// Shared UI helpers.
(function () {
  function revealText(text, element) {
    if (!element) return;
    element.innerHTML = "";
    element.classList.remove("reveal");

    const chars = String(text || "").split("");
    const fragment = document.createDocumentFragment();
    chars.forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      span.dataset.index = index;
      span.style.animationDelay = `${0.02 + index * 0.015}s`;
      fragment.appendChild(span);
    });

    element.appendChild(fragment);
    requestAnimationFrame(() => {
      element.classList.add("reveal");
    });
  }

  function showToast(toastEl, messageEl, message, duration) {
    if (!toastEl || !messageEl) return;
    messageEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, duration || 2000);
  }

  window.DP_UI = { revealText, showToast };
})();

