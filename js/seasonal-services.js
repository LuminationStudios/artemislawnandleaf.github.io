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
// 🌿 Convert MM-DD to number MMDD
// ===========================
function mmddToNumber(str) {
  const [m, d] = str.split("-").map(Number);
  return m * 100 + d;
}

// ===========================
// 🌿 Check if today is in season range
// ===========================
function isInSeason(todayNum, startNum, endNum) {
  // If season doesn’t cross year
  if (startNum <= endNum) return todayNum >= startNum && todayNum <= endNum;
  // If season crosses year (e.g., Nov → Mar)
  return todayNum >= startNum || todayNum <= endNum;
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
  const todayNum = (today.getMonth() + 1) * 100 + today.getDate(); // MMDD

  let services = [];

  for (const season of data.seasons) {
    const startNum = mmddToNumber(season.start);
    const endNum = mmddToNumber(season.end);

    if (isInSeason(todayNum, startNum, endNum)) {
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
