// ==UserScript==
// @name         myHomeworkSite Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Escape to close, Move to Tomorrow, and Sort by Class
// @author       T3 Chat
// @match        *://myhomeworkapp.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 1. ESCAPE KEY TO CLOSE LIGHTBOX
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const closeBtn = document.querySelector(
        "body > div.modal.fade.in > div > div.lightbox-header > a",
      );
      if (closeBtn) closeBtn.click();
    }
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // 2. SORT BY CLASS LOGIC
  function sortHomeworkByClass() {
    const list = document.querySelector(".homework-list");
    if (!list) return;

    const items = Array.from(list.querySelectorAll("li.hw-row"));
    items.sort((a, b) => {
      const classA = a.querySelector(".h-class span")?.innerText.trim() || "";
      const classB = b.querySelector(".h-class span")?.innerText.trim() || "";
      return classA.localeCompare(classB);
    });

    // Re-append items in sorted order
    items.forEach((item) => list.appendChild(item));
  }

  // 3. MOVE TO TOMORROW LOGIC
  async function moveTaskToTomorrow(hwId, dateFromUrl, anchorElement) {
    const icon = anchorElement.querySelector("span");
    const originalContent = icon.innerHTML;
    icon.innerText = "...";

    try {
      const dateParts = dateFromUrl.split("-");
      const baseDate = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        12,
        0,
        0,
      );
      baseDate.setDate(baseDate.getDate() + 1);
      const tomorrowStr = `${baseDate.getMonth() + 1}/${baseDate.getDate()}/${baseDate.getFullYear()}`;

      const response = await fetch(
        `https://myhomeworkapp.com/homework/${hwId}/edit`,
      );
      const htmlText = await response.text();
      const doc = new DOMParser().parseFromString(htmlText, "text/html");
      const form = doc.querySelector("form");

      if (!form) throw new Error("Edit form not found");

      const formData = new URLSearchParams(new FormData(form));
      formData.set("due_date", tomorrowStr);
      formData.set("save", "Save");

      const saveResponse = await fetch(
        `https://myhomeworkapp.com/homework/${hwId}/edit`,
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-csrftoken": getCookie("csrftoken"),
            "x-requested-with": "XMLHttpRequest",
          },
          body: formData.toString(),
        },
      );

      if (saveResponse.ok) {
        window.location.reload();
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      icon.innerHTML = originalContent;
    }
  }

  // 4. UI INJECTION (Buttons & Icons)
  function injectInterface() {
    // Add Sort Button next to the "Add" button in the header
    const boxTitle = document.querySelector(".box-title");
    if (boxTitle && !document.getElementById("t3-sort-btn")) {
      const sortBtn = document.createElement("button");
      sortBtn.id = "t3-sort-btn";
      sortBtn.innerText = "Sort by Class";
      sortBtn.style.marginLeft = "10px";
      sortBtn.style.fontSize = "12px";
      sortBtn.style.cursor = "pointer";
      sortBtn.className = "btn btn-mini"; // Attempting to use site's bootstrap styles
      sortBtn.onclick = sortHomeworkByClass;
      boxTitle.after(sortBtn);
    }

    // Add Tomorrow Buttons
    const actionContainers = document.querySelectorAll(
      ".h-actions:not(.tomorrow-logic-added)",
    );

    actionContainers.forEach((container) => {
      const deleteLink = container.querySelector('a[id^="lst-auto-delete_"]');
      if (!deleteLink) return;

      const hwId = deleteLink.id.split("_")[1];
      const urlParams = new URLSearchParams(deleteLink.href.split("?")[1]);
      const dateFromUrl = urlParams.get("dt");

      const tomorrowLink = document.createElement("a");
      tomorrowLink.href = "#";
      tomorrowLink.className = "tomorrow-btn";
      tomorrowLink.innerHTML =
        '<span class="icon g" title="Move to Tomorrow" style="filter: hue-rotate(180deg); font-weight:bold; font-size: 1.2em; display: inline-block; transform: translateY(2px);">➔</span>';

      tomorrowLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveTaskToTomorrow(hwId, dateFromUrl, tomorrowLink);
      });

      const span = tomorrowLink.querySelector("span");
      tomorrowLink.addEventListener("mouseenter", () =>
        span.classList.remove("g"),
      );
      tomorrowLink.addEventListener("mouseleave", () =>
        span.classList.add("g"),
      );

      container.appendChild(tomorrowLink);
      container.classList.add("tomorrow-logic-added");
    });
  }

  // Initialize and Observe
  injectInterface();
  const observer = new MutationObserver(injectInterface);
  observer.observe(document.body, { childList: true, subtree: true });
})();