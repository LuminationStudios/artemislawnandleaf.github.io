// ===========================
// 🌟 Load JSON with cache-busting
// ===========================
async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return null;
  }
}

// ===========================
// 🌿 Utility: parse MM-DD to Date
// ===========================
function parseMonthDay(str) {
  const [m, d] = str.split('-').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), m - 1, d);
}

// ===========================
// 🌿 Check if today is in range
// ===========================
function isDateInRange(today, start, end) {
  if (start <= end) return today >= start && today <= end;
  // crosses year boundary
  return today >= start || today <= end;
}

// ===========================
// 🌿 Load Seasonal Services
// ===========================
async function loadServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;

  const data = await loadJSON("json/seasonal-services.json");
  if (!data) return;

  const today = new Date();
  let services = [];

  for (const season of data.seasons) {
    const start = parseMonthDay(season.start);
    const end = parseMonthDay(season.end);
    if (isDateInRange(today, start, end)) {
      services = season.services || [];
      break;
    }
  }

  grid.innerHTML = services
    .map(s => `<div class="service"><h3>${s.title}</h3><p>${s.desc}</p></div>`)
    .join("");
}

// ===========================
// 🌸 Initialize Services
// ===========================
document.addEventListener("DOMContentLoaded", loadServices);
