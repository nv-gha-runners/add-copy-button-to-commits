// ==UserScript==
// @name         Add Copy Button to PR Commits
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds a copy button to pull-request commit SHAs on GitHub
// @author       AJ Schmidt
// @match        https://github.com/*/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL  https://raw.githubusercontent.com/nv-gha-runners/add-copy-button-to-commits/refs/heads/main/add-button.user.js
// @updateURL    https://raw.githubusercontent.com/nv-gha-runners/add-copy-button-to-commits/refs/heads/main/add-button.user.js
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2025, NVIDIA CORPORATION.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  "use strict";

  function findShaElements() {
    return Array.from(
      document.querySelectorAll(".TimelineItem-body .Link--secondary")
    ).reduce((acc, el) => {
      const re = new RegExp("^[0-9a-f]{7}$");
      if (!el.innerText.trim().match(re)) return acc;
      return [...acc, el];
    }, []);
  }

  function addCopyIconButton(targetElement) {
    if (!targetElement || !(targetElement instanceof HTMLElement)) {
      console.error("Invalid element passed to addCopyIconButton");
      return;
    }

    // SVGs for copy and check icons
    const copySVG = `
  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10 1.5A1.5 1.5 0 0 1 11.5 3v9A1.5 1.5 0 0 1 10 13.5H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 1.5h5zm-5 1a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H5z"/>
    <path d="M3 4.5v7A1.5 1.5 0 0 0 4.5 13H11v1H4.5A2.5 2.5 0 0 1 2 11.5v-7h1z"/>
  </svg>`;

    const checkSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="green" viewBox="0 0 16 16">
    <path d="M13.485 1.929a.75.75 0 0 1 0 1.06l-7.072 7.071L2.515 6.162a.75.75 0 0 1 1.06-1.06l2.837 2.836 6.543-6.544a.75.75 0 0 1 1.06 0z"/>
  </svg>`;

    // Create the button
    const button = document.createElement("button");
    button.innerHTML = copySVG;
    button.style.fontSize = "1em";
    button.style.padding = "2px 6px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.background = "transparent";
    button.style.position = "relative";
    button.style.top = "3px";

    // Click event
    button.addEventListener("click", () => {
      const textToCopy = targetElement.innerText;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          button.innerHTML = checkSVG;
          setTimeout(() => {
            button.innerHTML = copySVG;
          }, 1500);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });

    // Insert button after element
    targetElement.insertAdjacentElement("afterend", button);
  }

  for (const el of findShaElements()) {
    addCopyIconButton(el);
  }
})();
