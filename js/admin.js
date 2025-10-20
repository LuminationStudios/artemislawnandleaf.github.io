document.addEventListener('DOMContentLoaded', () => {
  const PASSWORD = 'artielawn2025';

// Elements
const pwOverlay = document.getElementById('pwOverlay');
const unlockBtn = document.getElementById('unlockBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const calendarContainer = document.getElementById('calendar-container');

const calendarDiv = document.getElementById('calendar');
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
  "Leaf Cleanup":"#FF8C42",
  "Snow Removal":"#42A5FF",
  "Closed":"#db5856",
  "Other":"#FFD27F"
};

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

// -------------------------
// PASSWORD MODAL
// -------------------------
unlockBtn.onclick = () => {
  if(adminPasswordInput.value === PASSWORD){
    pwOverlay.style.display = 'none';
    calendarContainer.classList.remove('hidden');
    renderCalendar(currentMonth, currentYear);
  } else {
    alert('❌ Wrong password');
    adminPasswordInput.value='';
    adminPasswordInput.focus();
  }
};

adminPasswordInput.addEventListener('keypress', e => { if(e.key==='Enter') unlockBtn.click(); });

// -------------------------
// CALENDAR FUNCTIONS
// -------------------------
function daysInMonth(m,y){ return new Date(y,m+1,0).getDate(); }

function renderCalendar(month, year){
  calendarDiv.innerHTML='';
  monthYearHeader.textContent=new Date(year,month).toLocaleString('default',{month:'long',year:'numeric'});
  const firstDay=new Date(year,month,1).getDay();
  const totalDays=daysInMonth(month,year);
  for(let i=0;i<firstDay;i++) calendarDiv.appendChild(document.createElement('div'));
  for(let d=1;d<=totalDays;d++){
    const dayDiv=document.createElement('div');
    dayDiv.classList.add('day');
    const dn=document.createElement('div');
    dn.classList.add('date-number'); dn.textContent=d;
    dayDiv.appendChild(dn);

    const dateObj=new Date(year,month,d);
    const dateStr=dateObj.toISOString().split('T')[0];
    if(dateObj.toDateString()===today.toDateString()) dayDiv.classList.add('today');
    if(dateObj<new Date(today.getFullYear(),today.getMonth(),today.getDate())) dayDiv.classList.add('past');

    const dayEvents=events.filter(ev=>ev.date===dateStr);
    dayEvents.forEach(ev=>{
      const evDiv=document.createElement('span');
      evDiv.classList.add('event');
      evDiv.style.backgroundColor=typeColors[ev.type]||typeColors.Other;
      evDiv.textContent=ev.title;
      dayDiv.appendChild(evDiv);
    });

    dayDiv.onclick=()=>openModal(dateStr);
    calendarDiv.appendChild(dayDiv);
  }
}

// -------------------------
// EVENT MODAL
// -------------------------
function openModal(dateStr){
  selectedDate=dateStr;
  modal.style.display='flex';
  modalDate.textContent=new Date(dateStr).toDateString();
  eventDate.value=dateStr;
  eventTitle.value=''; eventTime.value=''; eventType.value='Leaf Cleanup';
  renderModalEvents();
}

function renderModalEvents(){
  modalEvents.innerHTML='';
  events.filter(ev=>ev.date===selectedDate).forEach(ev=>{
    const div=document.createElement('div');
    div.classList.add('event-item');
    div.style.backgroundColor=typeColors[ev.type]||typeColors.Other;
    div.innerHTML=`${ev.time||'All Day'} - ${ev.title} <button class="delete-btn">Delete</button>`;
    div.querySelector('button').onclick=()=>{
      events.splice(events.indexOf(ev),1);
      localStorage.setItem('events',JSON.stringify(events));
      renderCalendar(currentMonth,currentYear);
      renderModalEvents();
    };
    modalEvents.appendChild(div);
  });
}

addEventBtn.onclick=()=>{
  if(!eventTitle.value.trim()) return alert('Enter a title');
  events.push({title:eventTitle.value,date:eventDate.value,time:eventTime.value,type:eventType.value});
  localStorage.setItem('events',JSON.stringify(events));
  renderCalendar(currentMonth,currentYear);
  renderModalEvents();
};

prevBtn.onclick=()=>{
  currentMonth--; if(currentMonth<0){ currentMonth=11; currentYear--; }
  renderCalendar(currentMonth,currentYear);
};
nextBtn.onclick=()=>{
  currentMonth++; if(currentMonth>11){ currentMonth=0; currentYear++; }
  renderCalendar(currentMonth,currentYear);
};
closeModal.onclick=()=>modal.style.display='none';
window.onclick=e=>{ if(e.target===modal) modal.style.display='none'; };

// -------------------------
// EXPORT FUNCTIONS
// -------------------------
function generateICS(events){
  let ics=`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Artemis Lawn & Leaf//EN\n`;
  events.forEach(ev=>{
    const date=ev.date.replace(/-/g,'');
    let start='000000', end='010000';
    if(ev.time){
      const [h,m]=ev.time.split(':'); start=`${h.padStart(2,'0')}${m.padStart(2,'0')}00`;
      const d=new Date(`${ev.date}T${ev.time}`); d.setHours(d.getHours()+1);
      const eh=String(d.getHours()).padStart(2,'0'); const em=String(d.getMinutes()).padStart(2,'0');
      end=`${eh}${em}00`;
    }
    ics+=`BEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${date}T${start}\nDTEND:${date}T${end}\nCATEGORIES:${ev.type}\nEND:VEVENT\n`;
  });
  ics+='END:VCALENDAR'; return ics;
}

exportICSBtn.onclick=()=>{
  const blob=new Blob([generateICS(events)],{type:'text/calendar'});
  const link=document.createElement('a'); link.href=URL.createObjectURL(blob);
  link.download='events.ics'; link.click(); URL.revokeObjectURL(link.href);
  alert('✅ ICS exported!');
};

// -------------------------
// SAVE TO GITHUB VIA API
// -------------------------
saveJSONBtn.onclick=async()=>{
  if(!events.length) return alert("No events to save!");

  try {
    const response = await fetch('/update-events', { // replace with your server endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events })
    });

    if(response.ok){
      alert('💾 Events pushed to GitHub! Actions will run.');
    } else {
      const text = await response.text();
      alert('❌ Failed to push: ' + text);
    }
  } catch(e){
    console.error(e);
    alert('❌ Network error.');
  }
};
