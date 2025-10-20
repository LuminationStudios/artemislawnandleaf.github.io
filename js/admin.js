const PASSWORD = 'artielawn2025'; // Admin password

// Elements
const pwOverlay = document.getElementById('pwOverlay');
const unlockBtn = document.getElementById('unlockBtn');
const adminPasswordInput = document.getElementById('adminPassword');

const calendarDiv = document.getElementById('calendar');
const calendarContainer = document.getElementById('calendar-container');
const monthYearHeader = document.getElementById('monthYear');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

const modal = document.getElementById('eventModal');
const modalDate = document.getElementById('modalDate');
const modalEvents = document.getElementById('modalEvents');
const closeModal = document.getElementById('closeModal');

const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventType = document.getElementById('eventType');
const addEventBtn = document.getElementById('addEvent');

const exportICSBtn = document.getElementById('exportICS');
const saveJSONBtn = document.getElementById('saveJSON');

let events = JSON.parse(localStorage.getItem('events')) || [];

const typeColors = {
  "Leaf Cleanup": "#FF8C42",
  "Snow Removal": "#42A5FF",
  "Closed": "#db5856",
  "Other": "#FFD27F"
};

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

// -------------------------
// PASSWORD MODAL HANDLING
// -------------------------
unlockBtn.onclick = () => {
  if (adminPasswordInput.value === PASSWORD) {
    pwOverlay.style.display = 'none';
    calendarContainer.classList.remove('hidden');
    renderCalendar(currentMonth, currentYear);
  } else {
    alert('❌ Wrong password');
    adminPasswordInput.value = '';
    adminPasswordInput.focus();
  }
};

adminPasswordInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') unlockBtn.click();
});

// -------------------------
// CALENDAR FUNCTIONS
// -------------------------
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
    if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      dayDiv.classList.add('past');

    const dayEvents = events.filter(ev => ev.date === dateStr);
    dayEvents.forEach(ev => {
      const evDiv = document.createElement('span');
      evDiv.classList.add('event');
      evDiv.style.backgroundColor = typeColors[ev.type] || typeColors["Other"];
      evDiv.textContent = ev.title;
      dayDiv.appendChild(evDiv);
    });

    dayDiv.onclick = () => openModal(dateStr);
    calendarDiv.appendChild(dayDiv);
  }
}

// -------------------------
// EVENT MODAL FUNCTIONS
// -------------------------
function openModal(dateStr) {
  selectedDate = dateStr;
  modal.style.display = 'flex';
  modalDate.textContent = new Date(dateStr).toDateString();
  eventDate.value = dateStr;
  eventTitle.value = '';
  eventTime.value = '';
  eventType.value = 'Leaf Cleanup';
  renderModalEvents();
}

function renderModalEvents() {
  modalEvents.innerHTML = '';
  const dayEvents = events.filter(ev => ev.date === selectedDate);
  dayEvents.forEach(ev => {
    const evDiv = document.createElement('div');
    evDiv.classList.add('event-item');
    evDiv.style.backgroundColor = typeColors[ev.type] || typeColors["Other"];
    evDiv.innerHTML = `${ev.time || 'All Day'} - ${ev.title} <button class="delete-btn">Delete</button>`;
    evDiv.querySelector('button').onclick = () => {
      events.splice(events.indexOf(ev), 1);
      localStorage.setItem('events', JSON.stringify(events));
      renderCalendar(currentMonth, currentYear);
      renderModalEvents();
    };
    modalEvents.appendChild(evDiv);
  });
}

addEventBtn.onclick = () => {
  if (!eventTitle.value.trim()) return alert('Enter a title');
  const newEv = {
    title: eventTitle.value,
    date: eventDate.value,
    time: eventTime.value,
    type: eventType.value
  };
  events.push(newEv);
  localStorage.setItem('events', JSON.stringify(events));
  renderCalendar(currentMonth, currentYear);
  renderModalEvents();
};

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

closeModal.onclick = () => (modal.style.display = 'none');
window.onclick = e => {
  if (e.target === modal) modal.style.display = 'none';
};

// -------------------------
// EXPORT FUNCTIONS
// -------------------------
function generateICS(events) {
  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Artemis Lawn & Leaf//EN\n`;
  events.forEach(ev => {
    const date = ev.date.replace(/-/g, '');
    let startTime = '000000';
    let endTime = '010000';
    if (ev.time) {
      const [h, m] = ev.time.split(':');
      startTime = `${h.padStart(2, '0')}${m.padStart(2, '0')}00`;
      const dateObj = new Date(`${ev.date}T${ev.time}`);
      dateObj.setHours(dateObj.getHours() + 1);
      const endH = String(dateObj.getHours()).padStart(2, '0');
      const endM = String(dateObj.getMinutes()).padStart(2, '0');
      endTime = `${endH}${endM}00`;
    }
    ics += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${date}T${startTime}\nDTEND:${date}T${endTime}\nCATEGORIES:${ev.type}\nEND:VEVENT\n`;
  });
  ics += 'END:VCALENDAR';
  return ics;
}

exportICSBtn.onclick = () => {
  const blob = new Blob([generateICS(events)], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'events.ics';
  link.click();
  URL.revokeObjectURL(link.href);
  alert('✅ ICS exported!');
};

saveJSONBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'events.json';
  link.click();
  URL.revokeObjectURL(link.href);
  alert('💾 JSON downloaded! Upload to GitHub manually to sync.');
};
