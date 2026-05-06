/**
 * ============================================================
 *  data-cursor.js — v1.1
 *  Terminal-style blinking cursor on the last character of
 *  any element marked with the [data-cursor] attribute.
 * ============================================================
 *
 *  Made by Casey Muns — https://caseymuns.com
 *  with assistance from Claude AI (Anthropic — claude.ai)
 *
 *  Part of the Webflow Clonables collection by Casey Muns.
 *  Free to use, fork, and adapt. Credit appreciated.
 *  License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
 *
 * ------------------------------------------------------------
 *  USAGE
 * ------------------------------------------------------------
 *
 *    <span data-cursor>Hello, World!</span>       default speed
 *    <span data-cursor="fast">Loading</span>      named: fast / slow
 *    <span data-cursor="400">$ npm start</span>   custom milliseconds
 *
 * ------------------------------------------------------------
 *  SPEED VALUES
 * ------------------------------------------------------------
 *
 *    (none)   530ms   default, general purpose
 *    "fast"   200ms   alerts, active states
 *    "slow"   850ms   headings, calm tone
 *    "400"    any number = interval in milliseconds
 *
 * ------------------------------------------------------------
 *  INSTALLATION (Webflow)
 * ------------------------------------------------------------
 *
 *  Project Settings > Custom Code > Footer Code:
 *    <script src="your-cdn-url/data-cursor.js"></script>
 *
 *  Or paste the contents of this file directly into a
 *  Webflow Embed block wrapped in <script></script> tags.
 *
 *  Works with Webflow CMS - MutationObserver watches for
 *  dynamically rendered elements automatically.
 *
 * ============================================================
 */

(function () {

  var DEFAULT_SPEED = 530;
  var NAMED = { fast: 200, slow: 850 };

  function resolveSpeed(val) {
    if (val === null || val === '') return DEFAULT_SPEED;
    var lower = val.toLowerCase();
    if (NAMED[lower] !== undefined) return NAMED[lower];
    var n = Number(val);
    return isNaN(n) ? DEFAULT_SPEED : n;
  }

  function initCursor(el) {
    if (el.dataset.cursorInit) return;
    el.dataset.cursorInit = '1';

    var speed  = resolveSpeed(el.getAttribute('data-cursor'));
    var text   = el.textContent;
    var body   = text.slice(0, -1);
    var cursor = text.slice(-1);

    el.innerHTML =
      body +
      '<span data-cursor-char style="visibility:visible">' + cursor + '</span>';

    var span    = el.querySelector('[data-cursor-char]');
    var visible = true;

    setInterval(function () {
      visible = !visible;
      span.style.visibility = visible ? 'visible' : 'hidden';
    }, speed);
  }

  function initAll() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-cursor]'));
    for (var i = 0; i < els.length; i++) {
      initCursor(els[i]);
    }

    new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var added = mutations[m].addedNodes;
        for (var n = 0; n < added.length; n++) {
          var node = added[n];
          if (node.nodeType !== 1) continue;
          if (node.hasAttribute('data-cursor')) initCursor(node);
          var children = Array.prototype.slice.call(node.querySelectorAll('[data-cursor]'));
          for (var c = 0; c < children.length; c++) {
            initCursor(children[c]);
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
