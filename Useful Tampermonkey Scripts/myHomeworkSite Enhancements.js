// ==UserScript==
// @name         myHomeworkSite Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Escape to close, Move to Tomorrow, Sort by Class, and Toggle Completed
// @author       T3 Chat
// @match        *://myhomeworkapp.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Track the state of completed items visibility
  let completedHidden = false;
  const CURRENT_DATE_STORAGE_KEY = "myhomework_current_date";

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

  function formatDateForDue(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  function parseDateFromTaskParam(dateFromUrl) {
    if (!dateFromUrl) {
      throw new Error("Missing task date");
    }

    if (dateFromUrl.includes("-")) {
      const parts = dateFromUrl.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    }

    if (dateFromUrl.includes("/")) {
      const parts = dateFromUrl.split("/").map(Number);
      return new Date(parts[2], parts[0] - 1, parts[1], 12, 0, 0);
    }

    throw new Error(`Unsupported date format: ${dateFromUrl}`);
  }

  function dateFromHeaderText() {
    const title = document.querySelector("#main-content > div.right-col > div > h2");
    if (!title) return null;

    const normalized = title.textContent
      .trim()
      .replace(/(\d+)(st|nd|rd|th)/g, "$1");
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return formatDateForDue(parsed);
  }

  function getCurrentCalendarDate() {
    const pageUrl = new URL(window.location.href);
    const fromUrl = pageUrl.searchParams.get("dt");
    if (fromUrl) return fromUrl;

    const addButton = document.querySelector(
      'a.box-title-button.has-options[href*="/homework/add?"]',
    );
    if (addButton) {
      const addUrl = new URL(addButton.href, window.location.origin);
      const fromAddUrl = addUrl.searchParams.get("dt");
      if (fromAddUrl) return fromAddUrl;
    }

    return dateFromHeaderText();
  }

  function rememberCurrentCalendarDate() {
    const currentDate = getCurrentCalendarDate();
    if (currentDate) {
      localStorage.setItem(CURRENT_DATE_STORAGE_KEY, currentDate);
    }
  }

  async function saveHomeworkDate(hwId, dueDate) {
    const response = await fetch(`https://myhomeworkapp.com/homework/${hwId}/edit`);
    if (!response.ok) {
      throw new Error(`Failed loading edit form for homework ${hwId}`);
    }

    const htmlText = await response.text();
    const doc = new DOMParser().parseFromString(htmlText, "text/html");
    const form = doc.querySelector("form");
    if (!form) {
      throw new Error("Edit form not found");
    }

    const formData = new URLSearchParams(new FormData(form));
    formData.set("due_date", dueDate);
    formData.set("save", "Save");

    const saveResponse = await fetch(`https://myhomeworkapp.com/homework/${hwId}/edit`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-csrftoken": getCookie("csrftoken"),
        "x-requested-with": "XMLHttpRequest",
      },
      body: formData.toString(),
    });

    if (!saveResponse.ok) {
      throw new Error(`Save failed for homework ${hwId}`);
    }
  }

  async function moveTaskByDays(hwId, dateFromUrl, anchorElement, daysToAdd) {
    const icon = anchorElement.querySelector("span");
    const originalContent = icon.innerHTML;
    icon.innerText = "...";

    try {
      const baseDate = parseDateFromTaskParam(dateFromUrl);
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      const newDate = formatDateForDue(baseDate);

      await saveHomeworkDate(hwId, newDate);
      rememberCurrentCalendarDate();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      icon.innerHTML = originalContent;
    }
  }

  function getHomeworkDateFromDeleteLink(deleteLink) {
    const href = deleteLink.getAttribute("href") || "";
    const queryString = href.includes("?") ? href.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    return params.get("dt");
  }

  async function postponeAllToTomorrow(anchorElement) {
    const icon = anchorElement.querySelector("span");
    const originalContent = icon.innerHTML;

    const deleteLinks = Array.from(
      document.querySelectorAll('.h-actions a[id^="lst-auto-delete_"]'),
    ).filter((link) => {
      const row = link.closest("li.hw-row");
      return row ? !row.querySelector(".icon.checked") : true;
    });

    if (deleteLinks.length === 0) {
      alert("No incomplete homework items found to postpone.");
      return;
    }

    if (!window.confirm(`Postpone ${deleteLinks.length} homework item(s) to tomorrow?`)) {
      return;
    }

    anchorElement.style.pointerEvents = "none";
    icon.innerText = "...";

    let updated = 0;
    let failed = 0;

    try {
      for (const deleteLink of deleteLinks) {
        const hwId = deleteLink.id.split("_")[1];
        const currentTaskDate = getHomeworkDateFromDeleteLink(deleteLink);

        if (!hwId || !currentTaskDate) {
          failed += 1;
          continue;
        }

        try {
          const nextDate = parseDateFromTaskParam(currentTaskDate);
          nextDate.setDate(nextDate.getDate() + 1);
          await saveHomeworkDate(hwId, formatDateForDue(nextDate));
          updated += 1;
        } catch (err) {
          console.error(`Failed postponing homework ${hwId}:`, err);
          failed += 1;
        }
      }

      rememberCurrentCalendarDate();

      if (updated === 0) {
        throw new Error("No homework items were updated.");
      }

      if (failed > 0) {
        alert(`Postponed ${updated} item(s). Failed: ${failed}. Refreshing now.`);
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error postponing all items: " + err.message);
      anchorElement.style.pointerEvents = "";
      icon.innerHTML = originalContent;
    }
  }

  // 2. DRAG AND DROP REORDERING
  let dragSrcEl = null;

  function onDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.id);
    this.style.opacity = "0.4";
  }

  function onDragEnd() {
    this.style.opacity = "";
    document.querySelectorAll("li.hw-row").forEach((row) => {
      row.classList.remove("drag-over");
    });
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  }

  function onDragEnter() {
    if (this !== dragSrcEl) {
      this.classList.add("drag-over");
    }
  }

  function onDragLeave() {
    this.classList.remove("drag-over");
  }

  function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    if (dragSrcEl && dragSrcEl !== this) {
      const list = this.parentNode;
      const allItems = Array.from(list.querySelectorAll("li.hw-row"));
      const srcIdx = allItems.indexOf(dragSrcEl);
      const tgtIdx = allItems.indexOf(this);

      if (srcIdx < tgtIdx) {
        list.insertBefore(dragSrcEl, this.nextSibling);
      } else {
        list.insertBefore(dragSrcEl, this);
      }
    }

    this.classList.remove("drag-over");
    return false;
  }

  function enableDragAndDrop() {
    // Inject drag-and-drop styles once
    if (!document.getElementById("t3-dnd-styles")) {
      const style = document.createElement("style");
      style.id = "t3-dnd-styles";
      style.textContent = `
        li.hw-row[draggable="true"] {
          cursor: grab;
        }
        li.hw-row[draggable="true"]:active {
          cursor: grabbing;
        }
        li.hw-row.drag-over {
          outline: 2px dashed #666;
          outline-offset: -2px;
          background-color: rgba(0, 0, 0, 0.05);
        }
      `;
      document.head.appendChild(style);
    }

    const rows = document.querySelectorAll("li.hw-row:not([draggable])");
    rows.forEach((row) => {
      row.setAttribute("draggable", "true");
      row.addEventListener("dragstart", onDragStart);
      row.addEventListener("dragend", onDragEnd);
      row.addEventListener("dragover", onDragOver);
      row.addEventListener("dragenter", onDragEnter);
      row.addEventListener("dragleave", onDragLeave);
      row.addEventListener("drop", onDrop);
    });
  }

  // 3. SORT BY CLASS LOGIC
  function sortHomeworkByClass() {
    const list = document.querySelector(".homework-list");
    if (!list) return;

    const items = Array.from(list.querySelectorAll("li.hw-row"));
    items.sort((a, b) => {
      const classA = a.querySelector(".h-class span")?.innerText.trim() || "";
      const classB = b.querySelector(".h-class span")?.innerText.trim() || "";
      return classA.localeCompare(classB);
    });

    items.forEach((item) => list.appendChild(item));
  }

  // 3. TOGGLE COMPLETED ITEMS LOGIC
  function toggleCompletedItems(e) {
    const btn = e.target;
    completedHidden = !completedHidden;

    // Select rows with the checked icon
    const completedRows = document.querySelectorAll("li.hw-row:has(.icon.checked)");

    completedRows.forEach((row) => {
      row.style.setProperty('display', completedHidden ? 'none' : 'list-item', 'important');
    });

    // Update button text
    btn.innerText = completedHidden ? "Show Completed" : "Hide Completed";
  }

  // 4. MOVE TO TOMORROW LOGIC
  async function moveTaskBackOneDay(hwId, dateFromUrl, anchorElement) {
    await moveTaskByDays(hwId, dateFromUrl, anchorElement, -1);
  }

  async function moveTaskToTomorrow(hwId, dateFromUrl, anchorElement) {
    await moveTaskByDays(hwId, dateFromUrl, anchorElement, 1);
  }

  async function moveTaskThreeDays(hwId, dateFromUrl, anchorElement) {
    await moveTaskByDays(hwId, dateFromUrl, anchorElement, 3);
  }

  async function moveTaskOneWeek(hwId, dateFromUrl, anchorElement) {
    await moveTaskByDays(hwId, dateFromUrl, anchorElement, 7);
  }

  // 5. UI INJECTION
  function injectInterface() {
    const addHomeworkButton = document.querySelector(
      'a.box-title-button.has-options[data-controls-load-lightbox="true"]',
    );
    if (addHomeworkButton && !document.getElementById("t3-postpone-all-btn")) {
      const postponeBtn = document.createElement("a");
      postponeBtn.id = "t3-postpone-all-btn";
      postponeBtn.href = "#";
      postponeBtn.className = "box-title-button";
      postponeBtn.title = "Postpone all to tomorrow";
      postponeBtn.style.right = "42px";
      postponeBtn.style.top = "7px";
      postponeBtn.innerHTML =
        '<span style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;" title="Postpone all to tomorrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,2h-1V1c0-.552-.448-1-1-1s-1,.448-1,1v1H8V1c0-.552-.448-1-1-1s-1,.448-1,1v1h-1C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V7c0-2.757-2.243-5-5-5ZM5,4h14c1.654,0,3,1.346,3,3v1H2v-1c0-1.654,1.346-3,3-3Zm14,18H5c-1.654,0-3-1.346-3-3V10H22v9c0,1.654-1.346,3-3,3Zm-7-8h4v2h-4v-2Z"/></svg></span>';

      postponeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        postponeAllToTomorrow(postponeBtn);
      });

      addHomeworkButton.parentElement?.appendChild(postponeBtn);
    }

    const boxTitle = document.querySelector(".box-title");
    if (boxTitle && !document.getElementById("t3-sort-btn")) {
      // Add Sort Button
      const sortBtn = document.createElement("button");
      sortBtn.id = "t3-sort-btn";
      sortBtn.innerText = "Sort by Class";
      sortBtn.style.marginLeft = "10px";
      sortBtn.style.fontSize = "12px";
      sortBtn.style.cursor = "pointer";
      sortBtn.className = "btn btn-mini";
      sortBtn.onclick = sortHomeworkByClass;
      boxTitle.after(sortBtn);

      // Add Toggle Completed Button
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "t3-toggle-btn";
      toggleBtn.innerText = "Hide Completed";
      toggleBtn.style.marginLeft = "5px";
      toggleBtn.style.fontSize = "12px";
      toggleBtn.style.cursor = "pointer";
      toggleBtn.className = "btn btn-mini";
      toggleBtn.onclick = toggleCompletedItems;
      sortBtn.after(toggleBtn);
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

      const backOneDayLink = document.createElement("a");
      backOneDayLink.href = "#";
      backOneDayLink.className = "back-one-day-btn";
      backOneDayLink.innerHTML =
        '<span class="icon g" title="Move Back 1 Day" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,2h-1V1c0-.552-.448-1-1-1s-1,.448-1,1v1H8V1c0-.552-.448-1-1-1s-1,.448-1,1v1h-1C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V7c0-2.757-2.243-5-5-5ZM5,4h14c1.654,0,3,1.346,3,3v1H2v-1c0-1.654,1.346-3,3-3Zm14,18H5c-1.654,0-3-1.346-3-3V10H22v9c0,1.654-1.346,3-3,3Zm-5.379-6.571l1.571-1.571-1.414-1.414-2.659,2.659c-.731.731-.731,1.92,0,2.651l2.659,2.659,1.414-1.414-1.571-1.571h7.948v-2h-7.948Z"/></svg></span>';

      backOneDayLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveTaskBackOneDay(hwId, dateFromUrl, backOneDayLink);
      });

      const spanBackOneDay = backOneDayLink.querySelector("span");
      backOneDayLink.addEventListener("mouseenter", () =>
        spanBackOneDay.classList.remove("g"),
      );
      backOneDayLink.addEventListener("mouseleave", () =>
        spanBackOneDay.classList.add("g"),
      );

      container.appendChild(backOneDayLink);

      const tomorrowLink = document.createElement("a");
      tomorrowLink.href = "#";
      tomorrowLink.className = "tomorrow-btn";
      tomorrowLink.innerHTML =
        '<span class="icon g" title="Move to Tomorrow" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,2h-1V1c0-.552-.448-1-1-1s-1,.448-1,1v1H8V1c0-.552-.448-1-1-1s-1,.448-1,1v1h-1C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V7c0-2.757-2.243-5-5-5ZM5,4h14c1.654,0,3,1.346,3,3v1H2v-1c0-1.654,1.346-3,3-3Zm14,18H5c-1.654,0-3-1.346-3-3V10H22v9c0,1.654-1.346,3-3,3Zm-3-6c0,.552-.448,1-1,1h-2v2c0,.552-.448,1-1,1s-1-.448-1-1v-2h-2c-.552,0-1-.448-1-1s.448-1,1-1h2v-2c0-.552,.448-1,1-1s1,.448,1,1v2h2c.552,0,1,.448,1,1Z"/></svg></span>';

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

      // Add 3 Days Button
      const threeDaysLink = document.createElement("a");
      threeDaysLink.href = "#";
      threeDaysLink.className = "three-days-btn";
      threeDaysLink.innerHTML =
        '<span class="icon g" title="Move 3 Days" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,2H18V1a1,1,0,0,0-2,0V2H8V1A1,1,0,0,0,6,1V2H5A5.006,5.006,0,0,0,0,7V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7A5.006,5.006,0,0,0,19,2ZM2,7A3,3,0,0,1,5,4H19a3,3,0,0,1,3,3V8H2ZM19,22H5a3,3,0,0,1-3-3V10H22v9A3,3,0,0,1,19,22Z"/><circle cx="12" cy="15" r="1.5"/><circle cx="7" cy="15" r="1.5"/><circle cx="17" cy="15" r="1.5"/></svg></span>';

      threeDaysLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveTaskThreeDays(hwId, dateFromUrl, threeDaysLink);
      });

      const span3Days = threeDaysLink.querySelector("span");
      threeDaysLink.addEventListener("mouseenter", () =>
        span3Days.classList.remove("g"),
      );
      threeDaysLink.addEventListener("mouseleave", () =>
        span3Days.classList.add("g"),
      );

      container.appendChild(threeDaysLink);

      // Add 1 Week Button
      const oneWeekLink = document.createElement("a");
      oneWeekLink.href = "#";
      oneWeekLink.className = "one-week-btn";
      oneWeekLink.innerHTML =
        '<span class="icon g" title="Move 1 Week" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,2h-1V1c0-.552-.448-1-1-1s-1,.448-1,1v1H8V1c0-.552-.448-1-1-1s-1,.448-1,1v1h-1C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V7c0-2.757-2.243-5-5-5ZM5,4h14c1.654,0,3,1.346,3,3v1H2v-1c0-1.654,1.346-3,3-3Zm14,18H5c-1.654,0-3-1.346-3-3V10H22v9c0,1.654-1.346,3-3,3Z"/><rect x="15" y="13" width="2" height="2" rx="0.5"/><rect x="11" y="13" width="2" height="2" rx="0.5"/><rect x="7" y="13" width="2" height="2" rx="0.5"/><rect x="15" y="17" width="2" height="2" rx="0.5"/><rect x="11" y="17" width="2" height="2" rx="0.5"/><rect x="7" y="17" width="2" height="2" rx="0.5"/></svg></span>';

      oneWeekLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveTaskOneWeek(hwId, dateFromUrl, oneWeekLink);
      });

      const spanWeek = oneWeekLink.querySelector("span");
      oneWeekLink.addEventListener("mouseenter", () =>
        spanWeek.classList.remove("g"),
      );
      oneWeekLink.addEventListener("mouseleave", () =>
        spanWeek.classList.add("g"),
      );

      container.appendChild(oneWeekLink);

      container.classList.add("tomorrow-logic-added");
    });

    // Ensure state persists if MutationObserver catches new items while hidden
    if (completedHidden) {
        document.querySelectorAll("li.hw-row:has(.icon.checked)").forEach(row => {
            row.style.setProperty('display', 'none', 'important');
        });
    }

    enableDragAndDrop();
  }

  // Initialize and Observe
  injectInterface();
  const observer = new MutationObserver(injectInterface);
  observer.observe(document.body, { childList: true, subtree: true });

  // Restore date view after reload
  const storedDate = localStorage.getItem(CURRENT_DATE_STORAGE_KEY);
  if (storedDate) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentDate = urlParams.get("dt");
    
    // Only redirect if we're not already on the stored date
    if (currentDate !== storedDate) {
      localStorage.removeItem(CURRENT_DATE_STORAGE_KEY);
      window.location.href = `${window.location.origin}${window.location.pathname}?dt=${storedDate}`;
    } else {
      // Clear the stored date once we're on the right page
      localStorage.removeItem(CURRENT_DATE_STORAGE_KEY);
    }
  }
})();
