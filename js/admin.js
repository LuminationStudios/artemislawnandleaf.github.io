document.addEventListener("DOMContentLoaded", async () => {
  const PASSWORD = "artielawn2025";
  const GIST_ID = "a5807276447d041a9d6793be134e391c"; // 👈 replace with your gist id
  const GIST_FILENAME = "events.json";

  // DOM Elements
  const pwOverlay = document.getElementById("pwOverlay");
  const unlockBtn = document.getElementById("unlockBtn");
  const calendarContainer = document.getElementById("calendar-container");
  const adminPasswordInput = document.getElementById("adminPassword");

  const calendarDiv = document.getElementById("calendar");
  const monthYearHeader = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");
  const modal = document.getElementById("eventModal");
  const modalDate = document.getElementById("modalDate");
  const modalEvents = document.getElementById("modalEvents");
  const closeModal = document.getElementById("closeModal");
  const eventTitleInput = document.getElementById("eventTitle");
  const eventTimeInput = document.getElementById("eventTime");
  const eventTypeSelect = document.getElementById("eventType");
  const addEventBtn = document.getElementById("addEvent");
  const saveJSONBtn = document.getElementById("saveJSON");

  const typeColors = {
    "Leaf Cleanup": "#ffc78f",
    "Snow Removal": "#c1ebff",
    "Closed": "#f6b2b2",
    "Other": "#faffa8",
    "Quote": "#d9c4ec",
    "Cleanup": "#cbffbb"
  };

  let events = [];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

  // 🟢 Load events from Gist
  async function loadEventsFromGist() {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
      if (!res.ok) throw new Error("Failed to load events from Gist");
      const data = await res.json();
      events = JSON.parse(data.files[GIST_FILENAME].content || "[]");
      console.log("Loaded events:", events);
    } catch (err) {
      console.error(err);
      events = [];
    }
  }

  await loadEventsFromGist();

  // 🧩 Unlock admin panel
  unlockBtn.onclick = () => {
    if (adminPasswordInput.value === PASSWORD) {
      pwOverlay.style.display = "none";
      calendarContainer.classList.remove("hidden");
      renderCalendar(currentMonth, currentYear);
    } else {
      alert("❌ Wrong password");
      adminPasswordInput.value = "";
      adminPasswordInput.focus();
    }
  };
  adminPasswordInput.addEventListener("keypress", e => {
    if (e.key === "Enter") unlockBtn.click();
  });

  // 🗓 Calendar helpers
  function daysInMonth(m, y) {
    return new Date(y, m + 1, 0).getDate();
  }

  function renderCalendar(month, year) {
    calendarDiv.innerHTML = "";
    monthYearHeader.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    for (let i = 0; i < firstDay; i++) calendarDiv.appendChild(document.createElement("div"));

    for (let d = 1; d <= totalDays; d++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      const dn = document.createElement("div");
      dn.classList.add("date-number");
      dn.textContent = d;
      dayDiv.appendChild(dn);

      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split("T")[0];

      if (dateObj.toDateString() === today.toDateString()) dayDiv.classList.add("today");
      if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) dayDiv.classList.add("past");

      const dayEvents = events.filter(ev => ev.date === dateStr);
      dayEvents.forEach(ev => {
        const evDiv = document.createElement("span");
        evDiv.classList.add("event");
        evDiv.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
        evDiv.textContent = ev.title;
        dayDiv.appendChild(evDiv);
      });

      dayDiv.addEventListener("click", () => openModal(dateStr));
      calendarDiv.appendChild(dayDiv);
    }
  }

  function openModal(dateStr) {
    selectedDate = dateStr;
    modal.style.display = "flex";
    modalDate.textContent = new Date(dateStr).toDateString();

    renderModalEvents();
  }

  function renderModalEvents() {
    modalEvents.innerHTML = "";
    let dayEvents = events.filter(ev => ev.date === selectedDate);
    // sort by time (earliest to latest)
    dayEvents.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));

    if (!dayEvents.length) {
      modalEvents.innerHTML = "<p>No events for this day.</p>";
      return;
    }

    dayEvents.forEach((ev, idx) => {
      const div = document.createElement("div");
      div.classList.add("event-item");
      div.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
      div.innerHTML = `<strong>${ev.time || "All Day"}</strong> - ${ev.title} <br>Type: ${ev.type} <button class="delete-btn" data-idx="${idx}">Delete</button>`;
      modalEvents.appendChild(div);
    });

    // Add delete listeners
    modalEvents.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx);
        const globalIdx = events.findIndex(e => e === events.filter(ev => ev.date === selectedDate)[idx]);
        if (globalIdx > -1) {
          events.splice(globalIdx, 1);
          renderCalendar(currentMonth, currentYear);
          renderModalEvents();
        }
      });
    });
  }

  // Modal close
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  // Calendar navigation
  prevBtn.addEventListener("click", () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(currentMonth, currentYear); });
  nextBtn.addEventListener("click", () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(currentMonth, currentYear); });

  // Add event
  addEventBtn.addEventListener("click", () => {
    const title = eventTitleInput.value.trim();
    if (!title) return alert("Enter an event title!");
    const time = eventTimeInput.value;
    const type = eventTypeSelect.value;

    events.push({ date: selectedDate, title, time, type });
    renderCalendar(currentMonth, currentYear);
    renderModalEvents();

    // clear inputs
    eventTitleInput.value = "";
    eventTimeInput.value = "";
  });

  // Save to Gist
  async function saveToGist() {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: { content: JSON.stringify(events, null, 2) }
          }
        })
      });

      if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
      console.log("Events saved to Gist!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("❌ Save failed: " + err.message);
    }
  }

  saveJSONBtn.addEventListener("click", async () => {
    await saveToGist();
    alert("✅ Events saved to Gist!");
  });
});
