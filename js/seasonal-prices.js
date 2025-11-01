import prices from './prices.json';

// Get today's day-of-year
const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 0);
const diff = today - startOfYear;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);

// Convert MM/DD string to day-of-year
function mmddToDayOfYear(mmdd) {
  const [month, day] = mmdd.split('/').map(Number);
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Check if today is in season
function isInSeason(season) {
  if (!season || !season.start || !season.end) return true;

  const startDay = mmddToDayOfYear(season.start);
  const endDay = mmddToDayOfYear(season.end);

  if (startDay <= endDay) {
    // Season within same year
    return dayOfYear >= startDay && dayOfYear <= endDay;
  } else {
    // Season wraps over year-end
    return dayOfYear >= startDay || dayOfYear <= endDay;
  }
}

// Filter active tiers
function getActiveTiers() {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

// Render tiers in the page
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
