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

  // Determine season
  const month = new Date().getMonth() + 1;
  const season = (month >= 9 || month <= 2) ? "fallWinter" : "springSummer";
  const services = data[season]?.services || [];

  grid.innerHTML = services
    .map(s => `<div class="service"><h3>${s.title}</h3><p>${s.desc}</p></div>`)
    .join("");
}

// ===========================
// 🌸 Initialize Services
// ===========================
document.addEventListener("DOMContentLoaded", loadServices);
