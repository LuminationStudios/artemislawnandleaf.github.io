// Define what your seasons mean
const SEASON_RANGES = {
  fallWinter: { start: "09/02", end: "03/01" },
  springSummer: { start: "03/02", end: "09/01" }
};

function mmddToDate(mmdd) {
  const [month, day] = mmdd.split('/').map(Number);
  const now = new Date();
  let year = now.getFullYear();
  if (month < 3 && now.getMonth() + 1 >= 9) year += 1;
  return new Date(year, month - 1, day);
}

function isInSeason(seasonKey) {
  const range = SEASON_RANGES[seasonKey];
  if (!range) return true;

  const startDate = mmddToDate(range.start);
  const endDate = mmddToDate(range.end);
  const today = new Date();

  if (startDate <= endDate) {
    return today >= startDate && today <= endDate;
  } else {
    return today >= startDate || today <= endDate;
  }
}

function getActiveTiers(prices) {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

function renderTiers(containerId, prices) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  getActiveTiers(prices).forEach(tier => {
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

// ✅ Load JSON (instead of import)
fetch("./json/prices.json")
  .then(res => res.json())
  .then(data => renderTiers("services", data))
  .catch(err => console.error("Error loading prices:", err));
