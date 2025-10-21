document.addEventListener('DOMContentLoaded', () => {
  const PASSWORD = 'artielawn2025';
  const pwOverlay = document.getElementById('pwOverlay');
  const unlockBtn = document.getElementById('unlockBtn');
  const calendarContainer = document.getElementById('calendar-container');
  const adminPasswordInput = document.getElementById('adminPassword');

  const calendarDiv = document.getElementById('calendar');
  const monthYearHeader = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const modalEvents = document.getElementById('modalEvents');
  const closeModal = document.getElementById('closeModal');
  const saveJSONBtn = document.getElementById('saveJSON');

  const typeColors = {
    "Leaf Cleanup": "#ffc78f",
    "Snow Removal": "#c1ebff",
    "Closed": "#f6b2b2",
    "Other": "#faffa8",
    "Quote": "#d9c4ec",
    "Cleanup": "#cbffbb"
  };

  let events = JSON.parse(localStorage.getItem('events')) || [];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

  unlockBtn.onclick = () => {
    if(adminPasswordInput.value === PASSWORD){
      pwOverlay.style.display='none';
      calendarContainer.classList.remove('hidden');
      renderCalendar(currentMonth, currentYear);
    } else { 
      alert('❌ Wrong password'); 
      adminPasswordInput.value=''; 
      adminPasswordInput.focus(); 
    }
  };
  adminPasswordInput.addEventListener('keypress', e => { if(e.key==='Enter') unlockBtn.click(); });

  function daysInMonth(m,y){return new Date(y,m+1,0).getDate();}

  function renderCalendar(month,year){
    calendarDiv.innerHTML='';
    monthYearHeader.textContent=new Date(year,month).toLocaleString('default',{month:'long',year:'numeric'});
    const firstDay = new Date(year,month,1).getDay();
    const totalDays = daysInMonth(month,year);

    for(let i=0;i<firstDay;i++){calendarDiv.appendChild(document.createElement('div'));}
    for(let d=1;d<=totalDays;d++){
      const dayDiv=document.createElement('div'); dayDiv.classList.add('day');
      const dn=document.createElement('div'); dn.classList.add('date-number'); dn.textContent=d; dayDiv.appendChild(dn);
      const dateObj = new Date(year,month,d);
      const dateStr = dateObj.toISOString().split('T')[0];
      if(dateObj.toDateString()===today.toDateString()) dayDiv.classList.add('today');
      if(dateObj<new Date(today.getFullYear(),today.getMonth(),today.getDate())) dayDiv.classList.add('past');

      const dayEvents = events.filter(ev=>ev.date===dateStr);
      dayEvents.forEach(ev=>{
        const evDiv=document.createElement('span');
        evDiv.classList.add('event');
        evDiv.style.backgroundColor=typeColors[ev.type]||typeColors.Other;
        evDiv.textContent=ev.title;
        dayDiv.appendChild(evDiv);
      });

      dayDiv.addEventListener('click',()=>openModal(dateStr));
      calendarDiv.appendChild(dayDiv);
    }
  }

  function openModal(dateStr){
    selectedDate=dateStr;
    modal.style.display='flex';
    modalDate.textContent=new Date(dateStr).toDateString();
    modalEvents.innerHTML='';
    const dayEvents=events.filter(ev=>ev.date===dateStr);
    if(!dayEvents.length){modalEvents.innerHTML='<p>No events for this day.</p>';return;}
    dayEvents.forEach(ev=>{
      const div=document.createElement('div'); div.classList.add('event-item');
      div.style.backgroundColor=typeColors[ev.type]||typeColors.Other;
      div.innerHTML=`<strong>${ev.time||'All Day'}</strong> - ${ev.title} <br>Type: ${ev.type}`;
      modalEvents.appendChild(div);
    });
  }

  closeModal.addEventListener('click',()=>modal.style.display='none');
  window.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none';});

  prevBtn.addEventListener('click',()=>{currentMonth--; if(currentMonth<0){currentMonth=11; currentYear--;} renderCalendar(currentMonth,currentYear);});
  nextBtn.addEventListener('click',()=>{currentMonth++; if(currentMonth>11){currentMonth=0; currentYear++;} renderCalendar(currentMonth,currentYear);});

saveJSONBtn.onclick = async () => {
  if (!events.length) return alert("No events to save!");

  // Your limited-scope GitHub token
  const GITHUB_TOKEN = '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';
  const REPO = 'LuminationStudios/artemislawnandleaf';
  const url = `https://api.github.com/repos/${REPO}/dispatches`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'update-events',       // Name of the workflow trigger
        client_payload: { events: events } // Send your events array
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Error ${response.status}`);
    }

    alert('✅ GitHub Action triggered successfully!');
  } catch (err) {
    console.error(err);
    alert('❌ Failed to trigger update: ' + err.message);
  }
};
});
