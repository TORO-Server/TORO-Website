"use strict";
(() => {
  // src/sw-register.ts
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
})();
