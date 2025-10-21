document.addEventListener("DOMContentLoaded", async () => {
  const PASSWORD = "artielawn2025";
  const GIST_ID = "a5807276447d041a9d6793be134e391c"; // Your public Gist ID
  const GIST_FILENAME = "events.json";

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
  const addEventBtn = document.getElementById("addEvent");
  const eventTitleInput = document.getElementById("eventTitle");
  const eventTimeInput = document.getElementById("eventTime");
  const eventTypeSelect = document.getElementById("eventType");

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

  // Load events from Gist (read-only)
  async function loadEventsFromGist() {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      events = JSON.parse(data.files[GIST_FILENAME].content || "[]");

      // Merge with localStorage events (if any)
      const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
      events = [...events, ...storedEvents];

    } catch (err) {
      console.error("Failed to load events:", err);
      events = JSON.parse(localStorage.getItem("events") || "[]");
    }
  }

  await loadEventsFromGist();

  // Unlock admin panel
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
  adminPasswordInput.addEventListener("keypress", e => { if (e.key === "Enter") unlockBtn.click(); });

  function daysInMonth(m, y) { return new Date(y, m + 1, 0).getDate(); }

  function renderCalendar(month, year) {
    calendarDiv.innerHTML = "";
    monthYearHeader.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    // blank boxes for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("empty-day");
      calendarDiv.appendChild(emptyDiv);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");

      const dn = document.createElement("div");
      dn.classList.add("date-number");
      dn.textContent = d;
      dayDiv.appendChild(dn);

      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split("T")[0];

      // style for today & past
      if (dateObj.toDateString() === today.toDateString()) dayDiv.classList.add("today");
      if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) dayDiv.classList.add("past");

      // show events
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
    modalEvents.innerHTML = "";

    const dayEvents = events.filter(ev => ev.date === dateStr);
    if (!dayEvents.length) {
      modalEvents.innerHTML = "<p>No events for this day.</p>";
      return;
    }

    dayEvents.forEach(ev => {
      const div = document.createElement("div");
      div.classList.add("event-item");
      div.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
      div.innerHTML = `<strong>${ev.time || "All Day"}</strong> - ${ev.title}<br><small>Type: ${ev.type}</small>`;
      modalEvents.appendChild(div);
    });
  }

  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  prevBtn.addEventListener("click", () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(currentMonth, currentYear); });
  nextBtn.addEventListener("click", () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(currentMonth, currentYear); });

  // Add new event from modal
  addEventBtn.onclick = () => {
    const title = eventTitleInput.value.trim();
    const time = eventTimeInput.value;
    const type = eventTypeSelect.value;

    if (!title) return alert("Enter an event title!");

    const newEvent = { date: selectedDate, title, time, type };
    events.push(newEvent);

    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(events));

    // Update modal and calendar immediately
    openModal(selectedDate);
    renderCalendar(currentMonth, currentYear);

    // Clear inputs
    eventTitleInput.value = "";
    eventTimeInput.value = "";
  };

});
