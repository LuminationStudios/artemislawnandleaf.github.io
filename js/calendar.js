document.addEventListener('DOMContentLoaded', () => {
  const calendarDiv = document.getElementById('calendar');
  const monthYearHeader = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const modalEvents = document.getElementById('modalEvents');
  const closeModal = document.getElementById('closeModal');

  const typeColors = {
    "Leaf Cleanup": "#FF8C42",
    "Snow Removal": "#42A5FF",
    "Closed": "#db5856",
    "Other": "#FFD27F"
  };

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let events = [];
  let selectedDate = null;

  // Fetch public events JSON
  fetch('data/events.json')
    .then(r => r.json())
    .then(data => {
      events = data;
      renderCalendar(currentMonth, currentYear);
    })
    .catch(err => {
      console.error('Failed to load events.json:', err);
    });

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function renderCalendar(month, year) {
    calendarDiv.innerHTML = '';
    monthYearHeader.textContent = new Date(year, month)
      .toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    for (let i = 0; i < firstDay; i++) calendarDiv.appendChild(document.createElement('div'));

    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');

      const dateNumber = document.createElement('div');
      dateNumber.classList.add('date-number');
      dateNumber.textContent = day;
      dayDiv.appendChild(dateNumber);

      const currentDate = new Date(year, month, day);
      const dateStr = currentDate.toISOString().split('T')[0];

      if (currentDate.toDateString() === today.toDateString()) dayDiv.classList.add('today');

      const dayEvents = events.filter(ev => ev.date === dateStr);
      dayEvents.forEach(ev => {
        const evDiv = document.createElement('span');
        evDiv.classList.add('event');
        evDiv.style.backgroundColor = typeColors[ev.type] || typeColors["Other"];
        evDiv.textContent = ev.title;
        dayDiv.appendChild(evDiv);
      });

      // Open modal on day click
      dayDiv.addEventListener('click', () => openModal(dateStr));

      calendarDiv.appendChild(dayDiv);
    }
  }

  function openModal(dateStr) {
    selectedDate = dateStr;
    modal.style.display = 'flex';
    modalDate.textContent = new Date(dateStr).toDateString();

    modalEvents.innerHTML = '';
    const dayEvents = events.filter(ev => ev.date === selectedDate);

    if (dayEvents.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No events scheduled for this day.';
      modalEvents.appendChild(p);
    } else {
      dayEvents.forEach(ev => {
        const div = document.createElement('div');
        div.classList.add('event-item');
        div.style.backgroundColor = typeColors[ev.type] || typeColors["Other"];
        div.innerHTML = `<strong>${ev.time || 'All Day'}</strong> - ${ev.title} <em>(${ev.type})</em>`;
        modalEvents.appendChild(div);
      });
    }
  }

  // Close modal
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

  // Month navigation
  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
});
