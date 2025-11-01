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
    let start = season.start.split("-").map(Number);
    let end = season.end.split("-").map(Number);

    let startDate = new Date(today.getFullYear(), start[0] - 1, start[1]);
    let endDate = new Date(today.getFullYear(), end[0] - 1, end[1]);

    // Handle seasons crossing year boundary
    if (endDate < startDate) {
      if (today < startDate) startDate.setFullYear(today.getFullYear() - 1);
      else endDate.setFullYear(today.getFullYear() + 1);
    }

    if (today >= startDate && today <= endDate) {
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
