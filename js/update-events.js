// ===== CONFIG =====
const REPO = 'LuminationStudios/artemislawnandleaf.github.io';
const WORKFLOW = 'update-events.yml';
const BRANCH = 'main';
const EVENTS_JSON_PATH = 'data/events.json';

// ===== FETCH EVENTS FOR CALENDAR =====
async function fetchEvents() {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${EVENTS_JSON_PATH}?t=${Date.now()}`); // cache-bust
    if (!res.ok) throw new Error('Failed to fetch events.json');
    return await res.json();
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

// ===== RENDER PUBLIC CALENDAR =====
async function renderPublicCalendar() {
  const events = await fetchEvents();
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';

  events.forEach(event => {
    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `<strong>${event.date}</strong>: ${event.title} ${event.description ? '- ' + event.description : ''}`;
    container.appendChild(div);
  });
}

// ===== TRIGGER GITHUB ACTION TO UPDATE EVENTS =====
// ⚠️ Your GitHub Actions workflow uses the secret GH_TOKEN; no personal token is exposed
async function updateEvents(events) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${await getActionToken()}` // see note below
      },
      body: JSON.stringify({
        ref: BRANCH,
        inputs: { events_json: JSON.stringify(events) }
      })
    });

    if (!res.ok) throw new Error(await res.text());
    alert('Events update triggered successfully!');
  } catch (err) {
    console.error('Error updating events:', err);
    alert('Failed to update events: ' + err.message);
  }
}

// ===== ADMIN FUNCTIONS =====
async function addEvent(newEvent) {
  const events = await fetchEvents();
  events.push(newEvent);
  await updateEvents(events);
  renderPublicCalendar();
}

// ===== USAGE =====
// Render public calendar on page load
document.addEventListener('DOMContentLoaded', renderPublicCalendar);

// Example: add new event from admin page
// addEvent({ date: '2025-10-21', title: 'Yard Cleanup', description: 'Front yard cleanup' });
