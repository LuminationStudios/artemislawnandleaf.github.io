import prices from './prices.json';

// Get today's date as MM/DD
const today = new Date();
const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

// Check if a service is in season
function isInSeason(season) {
  if (!season || !season.start || !season.end) return true;

  const start = season.start;
  const end = season.end;

  if (start <= end) {
    // Same-year season
    return mmdd >= start && mmdd <= end;
  } else {
    // Season spans year-end (e.g., 09/02 - 03/01)
    return mmdd >= start || mmdd <= end;
  }
}

// Get active tiers based on current date
function getActiveTiers() {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

// Render tiers on the page
function renderTiers(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // Clear container

  getActiveTiers().forEach(tier => {
    const tierDiv = document.createElement('div');
    tierDiv.className = 'tier-card';

    // Service name and price
    const title = document.createElement('h2');
    title.textContent = `${tier.name} (${tier.price})`;
    tierDiv.appendChild(title);

    // Render each detail
    tier.details.forEach(detail => {
      const detailDiv = document.createElement('div');
      detailDiv.className = 'tier-detail';
      detailDiv.innerHTML = `
        <strong>${detail.label}</strong>: ${detail.price}<br>
        <em>${detail.notes}</em>
      `;
      tierDiv.appendChild(detailDiv);
    });

    container.appendChild(tierDiv);
  });
}

// Example usage: render tiers in a container with id="services"
renderTiers('services');
