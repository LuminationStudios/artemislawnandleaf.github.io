import prices from './prices.json';

// Define what your season strings mean
const SEASON_RANGES = {
  fallWinter: { start: "09/02", end: "03/01" },   // fall → winter
  springSummer: { start: "03/02", end: "09/01" }  // spring → summer
};

// Convert MM/DD to day-of-year
function mmddToDayOfYear(mmdd) {
  const [month, day] = mmdd.split('/').map(Number);
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Check if today is in the given season
function isInSeason(seasonKey) {
  if (!SEASON_RANGES[seasonKey]) return true;

  const { start, end } = SEASON_RANGES[seasonKey];
  const startDay = mmddToDayOfYear(start);
  const endDay = mmddToDayOfYear(end);
  const todayDay = mmddToDayOfYear(`${new Date().getMonth() + 1}/${new Date().getDate()}`);

  if (startDay <= endDay) {
    return todayDay >= startDay && todayDay <= endDay;
  } else {
    // Wrap-around (e.g., 09/02 → 03/01)
    return todayDay >= startDay || todayDay <= endDay;
  }
}

// Filter active tiers
function getActiveTiers() {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

// Render tiers
function renderTiers(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  getActiveTiers().forEach(tier => {
    const tierDiv = document.createElement('div');
    tierDiv.className = 'tier-card';

    const title = document.createElement('h2');
    title.textContent = `${tier.name} (${tier.price})`;
    tierDiv.appendChild(title);

    tier.details.forEach(detail => {
      const detailDiv = document.createElement('div');
      detailDiv.className = 'tier-detail';
      detailDiv.innerHTML = `<strong>${detail.label}</strong>: ${detail.price}<br><em>${detail.notes}</em>`;
      tierDiv.appendChild(detailDiv);
    });

    container.appendChild(tierDiv);
  });
}

// Example usage
renderTiers('services');
