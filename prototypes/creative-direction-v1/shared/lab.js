/*
  DISPOSABLE PROTOTYPE ARTEFACT — palette/typography switcher for evaluation
  only. Not a production feature. Persists choice in localStorage so a
  reviewer can flip palettes/type systems while comparing studies without
  resetting on every page.
*/
(function () {
  var STORAGE_PALETTE = "las-proto-palette";
  var STORAGE_TYPE = "las-proto-type";

  function apply() {
    var p = localStorage.getItem(STORAGE_PALETTE) || "1";
    var t = localStorage.getItem(STORAGE_TYPE) || "1";
    document.documentElement.setAttribute("data-palette", p);
    document.documentElement.setAttribute("data-type", t);
    document.querySelectorAll('[data-palette-btn]').forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-palette-btn") === p ? "true" : "false");
    });
    document.querySelectorAll('[data-type-btn]').forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-type-btn") === t ? "true" : "false");
    });
    var nameEl = document.querySelector('[data-palette-name]');
    if (nameEl) {
      var probe = document.createElement("div");
      probe.style.display = "none";
      document.body.appendChild(probe);
      nameEl.textContent = getComputedStyle(probe).getPropertyValue("--palette-name").replace(/"/g, "").trim();
      probe.remove();
    }
  }

  document.addEventListener("click", function (e) {
    var pBtn = e.target.closest("[data-palette-btn]");
    if (pBtn) {
      localStorage.setItem(STORAGE_PALETTE, pBtn.getAttribute("data-palette-btn"));
      apply();
    }
    var tBtn = e.target.closest("[data-type-btn]");
    if (tBtn) {
      localStorage.setItem(STORAGE_TYPE, tBtn.getAttribute("data-type-btn"));
      apply();
    }
  });

  document.addEventListener("DOMContentLoaded", apply);
})();
