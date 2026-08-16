/*
  DISPOSABLE PROTOTYPE ARTEFACT — mobile nav toggle + a reviewer-only
  "prototype date" test switch (16 Aug / 27 Aug) standing in for the real
  NOTICE auto-expiry behaviour described in the content model (§12): a real
  build excludes an expired NOTICE at build time. This prototype has no
  build step, so the same before/after states are shown via a manual test
  switch instead of duplicate pages.
*/
(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-primary-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var STORAGE_DATE = 'las-proto-date';
  function applyDate() {
    var d = localStorage.getItem(STORAGE_DATE) || '16aug';
    document.documentElement.setAttribute('data-date', d);
    document.querySelectorAll('[data-date-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-date-btn') === d ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-date-btn]');
    if (btn) {
      localStorage.setItem(STORAGE_DATE, btn.getAttribute('data-date-btn'));
      applyDate();
    }
  });
  document.addEventListener('DOMContentLoaded', applyDate);
})();
