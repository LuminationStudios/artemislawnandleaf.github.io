document.addEventListener("DOMContentLoaded", async () => {
  const PASSWORD = "artielawn2025";
  const GIST_ID = "a5807276447d041a9d6793be134e391c";
  const GIST_FILENAME = "events.json";

  // 🔗 Elements
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

  // 🟢 Load events
  async function loadEvents() {
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
      const data = await res.json();
      events = JSON.parse(data.files[GIST_FILENAME].content || "[]");
      renderCalendar(currentMonth, currentYear);
    } catch (err) {
      console.error("Failed to load:", err);
      events = [];
    }
  }

  await loadEvents();

  // 🔓 Password unlock
  unlockBtn.onclick = () => {
    if (adminPasswordInput.value === PASSWORD) {
      pwOverlay.style.display = "none";
      calendarContainer.classList.remove("hidden");
    } else alert("❌ Wrong password");
  };

  // 📅 Calendar rendering
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
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split("T")[0];
      const dn = document.createElement("div");
      dn.textContent = d;
      dayDiv.appendChild(dn);

      const dayEvents = events.filter(e => e.date === dateStr);
      dayEvents.forEach(ev => {
        const eDiv = document.createElement("span");
        eDiv.textContent = ev.title;
        eDiv.classList.add("event");
        eDiv.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
        dayDiv.appendChild(eDiv);
      });

      dayDiv.addEventListener("click", () => openModal(dateStr));
      calendarDiv.appendChild(dayDiv);
    }
  }

  // 🪟 Open modal
  function openModal(dateStr) {
    selectedDate = dateStr;
    modal.style.display = "flex";
    modalDate.textContent = new Date(dateStr).toDateString();
    renderModal(dateStr);
  }

  function renderModal(dateStr) {
    modalEvents.innerHTML = "";
    const dayEvents = events.filter(e => e.date === dateStr);
    if (!dayEvents.length) {
      modalEvents.innerHTML = "<p>No events for this day.</p>";
      return;
    }

    dayEvents.forEach((ev, i) => {
      const div = document.createElement("div");
      div.classList.add("event-item");
      div.innerHTML = `
        <strong>${ev.time || "All Day"}</strong> - ${ev.title}<br>
        <small>${ev.type}</small>
      `;
      modalEvents.appendChild(div);
    });
  }

  // 🧩 Add Event button
  addEventBtn.onclick = async () => {
    if (!selectedDate) return alert("Please select a date.");
    const title = eventTitleInput.value.trim();
    const time = eventTimeInput.value;
    const type = eventTypeSelect.value;

    if (!title) return alert("Please enter a title.");

    const newEvent = { date: selectedDate, title, time, type };
    events.push(newEvent);
    console.log("Added new event:", newEvent);

    // Update UI immediately
    renderModal(selectedDate);
    renderCalendar(currentMonth, currentYear);

    // Save to Gist
    await saveToGist();

    // Reset inputs
    eventTitleInput.value = "";
    eventTimeInput.value = "";
  };

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
      console.log("✅ Saved to Gist");
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Failed to save: " + err.message);
    }
  }

  // 🔻 Close modal
  closeModal.onclick = () => (modal.style.display = "none");
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  prevBtn.onclick = () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
  };

  nextBtn.onclick = () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
  };
});
