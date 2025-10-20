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
    "Leaf Cleanup": "#FF8C42",
    "Snow Removal": "#42A5FF",
    "Closed": "#db5856",
    "Other": "#FFD27F"
  };

  let events = [];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

  // Load events
  fetch('data/events.json')
    .then(res => res.json())
    .then(data => {
      events = data;
      renderCalendar(currentMonth, currentYear);
    })
    .catch(err => console.error('Failed to load events.json', err));

  function daysInMonth(m, y) {
    return new Date(y, m + 1, 0).getDate();
  }

  function renderCalendar(month, year) {
    calendarDiv.innerHTML = '';
    monthYearHeader.textContent = new Date(year, month)
      .toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    // Empty slots for first day
    for (let i = 0; i < firstDay; i++) calendarDiv.appendChild(document.createElement('div'));

    for (let d = 1; d <= totalDays; d++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');

      const dn = document.createElement('div');
      dn.classList.add('date-number');
      dn.textContent = d;
      dayDiv.appendChild(dn);

      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split('T')[0];

      if (dateObj.toDateString() === today.toDateString()) dayDiv.classList.add('today');

      const dayEvents = events.filter(ev => ev.date === dateStr);
      dayEvents.forEach(ev => {
        const evDiv = document.createElement('span');
        evDiv.classList.add('event');
        evDiv.style.backgroundColor = typeColors[ev.type] || typeColors.Other;
        evDiv.textContent = ev.title;
        dayDiv.appendChild(evDiv);
      });

      // Click to open modal
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
      div.innerHTML = `<strong>${ev.time || 'All Day'}</strong> - ${ev.title} <br>Type: ${ev.type}`;
      modalEvents.appendChild(div);
    });
  }

  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  prevBtn.onclick = () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(currentMonth, currentYear); };
  nextBtn.onclick = () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(currentMonth, currentYear); };
});
