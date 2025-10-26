document.addEventListener('DOMContentLoaded', () => {
  const calendarDiv = document.getElementById('calendar');
  const monthYearHeader = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const modalEvents = document.getElementById('modalEvents');
  const closeModal = document.querySelector('#eventModal .close-btn');

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

  // ✅ Load & Normalize Dates From Gist
  async function loadEvents() {
    const GIST_ID = "a5807276447d041a9d6793be134e391c";
    const GIST_FILENAME = "events.json";

    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      const data = await res.json();
      const file = data.files[GIST_FILENAME];
      if (!file || !file.content) throw new Error("No events.json found in Gist");

      // ✅ Normalize all event dates to guaranteed YYYY-MM-DD
      events = JSON.parse(file.content).map(ev => ({
        ...ev,
        date: ev.date.split('T')[0] // Remove any time or timezone component
      }));

      renderCalendar(currentMonth, currentYear);
    } catch (err) {
      console.error("Failed to load events from Gist:", err);
      calendarDiv.innerHTML = '<p class="error">Could not load events.</p>';
    }
  }

  function daysInMonth(m, y) {
    return new Date(y, m + 1, 0).getDate();
  }

  function renderCalendar(month, year) {
    calendarDiv.innerHTML = '';
    monthYearHeader.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('empty-day');
      calendarDiv.appendChild(emptyDiv);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');

      const dn = document.createElement('div');
      dn.classList.add('date-number');
      dn.textContent = d;
      dayDiv.appendChild(dn);

      const dateObj = new Date(year, month, d);

      // ✅ Use local timezone-safe formatting
      const dateStr = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

      if (dateObj.toDateString() === today.toDateString()) dayDiv.classList.add('today');
      if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) dayDiv.classList.add('past');

      const dayEvents = events.filter(ev => ev.date === dateStr);
      dayEvents.forEach(ev => {
        const evDiv = document.createElement('span');
        evDiv.classList.add('event');
        evDiv.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
        evDiv.textContent = ev.title;
        dayDiv.appendChild(evDiv);
      });

      dayDiv.addEventListener('click', () => openModal(dateStr));
      calendarDiv.appendChild(dayDiv);
    }
  }

  function openModal(dateStr) {
    selectedDate = dateStr;
    modal.style.display = 'flex';
    modalDate.textContent = new Date(dateStr).toDateString();
    modalEvents.innerHTML = '';

    const dayEvents = events.filter(ev => ev.date === dateStr);
    if (!dayEvents.length) {
      modalEvents.innerHTML = '<p>No events for this day.</p>';
      return;
    }

    dayEvents.forEach(ev => {
      const div = document.createElement('div');
      div.classList.add('event-item');
      div.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
      div.innerHTML = `<strong>${ev.time || 'All Day'}</strong> - ${ev.title}<br><small>Type: ${ev.type}</small>`;
      modalEvents.appendChild(div);
    });
  }

  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
  });

  loadEvents();
});
