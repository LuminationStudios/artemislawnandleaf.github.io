import prices from 'json/prices.json';

// Define what your seasons mean
const SEASON_RANGES = {
  fallWinter: { start: "09/02", end: "03/01" },
  springSummer: { start: "03/02", end: "09/01" }
};

// Convert MM/DD to a Date object for the current or next year if needed
function mmddToDate(mmdd) {
  const [month, day] = mmdd.split('/').map(Number);
  const now = new Date();
  let year = now.getFullYear();

  // If the date is in the first part of the year but represents a wrap-around, add 1 to year
  if (month < 3 && now.getMonth() + 1 >= 9) year += 1;

  return new Date(year, month - 1, day);
}

// Check if today is in the given season
function isInSeason(seasonKey) {
  const range = SEASON_RANGES[seasonKey];
  if (!range) return true;

  const startDate = mmddToDate(range.start);
  const endDate = mmddToDate(range.end);
  const today = new Date();

  // If season wraps around the year
  if (startDate <= endDate) {
    return today >= startDate && today <= endDate;
  } else {
    return today >= startDate || today <= endDate;
  }
}

// Filter active tiers
function getActiveTiers() {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

// Render tiers on the page
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
