/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */

function handleMobMenu() {
  // Open button
  const openButton = document.querySelector("#open-mobile-menu");
  openButton.addEventListener("click", toggleMobMenu);

  // Close button
  const closeButton = document.querySelector("#close-mobile-menu");
  closeButton.addEventListener("click", toggleMobMenu);
  function toggleMobMenu() {
    // Toggle class
    const body = document.querySelector("body");

    // Transition height
    const ul = document.querySelector("nav ul");
    if (!body.classList.contains("menu-open")) {
      // Glide Open
      body.classList.add("menu-open");
      ul.classList.add("visible");
      setTimeout(() => {
        ul.classList.add("anim");
      }, 10);
    } else {
      // Glide Closed
      ul.classList.remove("anim");
      setTimeout(() => {
        body.classList.remove("menu-open");
        ul.classList.remove("visible");
      }, 300);
    }
  }
}
window.addEventListener("DOMContentLoaded", handleMobMenu);

/* eslint-enable no-console */
/******/ })()
;
//# sourceMappingURL=view.js.map