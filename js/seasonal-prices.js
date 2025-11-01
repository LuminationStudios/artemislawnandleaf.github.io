import prices from './prices.json';

// Season start dates
const FALL_WINTER_START = "09/02"; // MM/DD
const SPRING_SUMMER_START = "03/02"; // MM/DD

// Convert MM/DD to day-of-year
function mmddToDayOfYear(mmdd) {
  const [month, day] = mmdd.split('/').map(Number);
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const today = new Date();
const dayOfYear = mmddToDayOfYear(`${today.getMonth() + 1}/${today.getDate()}`);
const startFallWinter = mmddToDayOfYear(FALL_WINTER_START);
const startSpringSummer = mmddToDayOfYear(SPRING_SUMMER_START);

// Determine current season properly
let currentSeason;
if (dayOfYear >= startFallWinter || dayOfYear < startSpringSummer) {
  // Fall/Winter: from Sep 2 → Dec 31 + Jan 1 → Mar 1
  currentSeason = "fallWinter";
} else {
  // Spring/Summer: from Mar 2 → Sep 1
  currentSeason = "springSummer";
}

// Filter active tiers based on season
function getActiveTiers() {
  return prices.tiers.filter(tier => tier.season === currentSeason);
}

// Render tiers on page
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
