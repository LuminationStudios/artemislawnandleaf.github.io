fetch('data/events.json')
  .then(r => r.json())
  .then(events => {
    const calendarDiv = document.getElementById('calendar');
    const monthYearHeader = document.getElementById('monthYear');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const typeColors = {
      "Leaf Cleanup": "#FF8C42",
      "Snow Removal": "#42A5FF",
      "Closed": "#db5856",
      "Other": "#FFD27F"
    };

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

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

        calendarDiv.appendChild(dayDiv);
      }
    }

    prevBtn.onclick = () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
    };

    nextBtn.onclick = () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
    };

    renderCalendar(currentMonth, currentYear);
  })
  .catch(err => {
    console.error('Failed to load events.json:', err);
  });
