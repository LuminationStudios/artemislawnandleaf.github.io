// prices.js (or main.js)
import prices from './prices.json'; // Make sure your JSON is in the same folder or adjust path

// Get today's date as MM/DD
const today = new Date();
const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

// Function to check if a service is in season
function isInSeason(season) {
  if (!season || !season.start || !season.end) return true; // Always available if no season specified
  const start = season.start;
  const end = season.end;

  if (start <= end) {
    // Season within the same year
    return mmdd >= start && mmdd <= end;
  } else {
    // Season wraps over year-end (e.g., 12/01 - 03/31)
    return mmdd >= start || mmdd <= end;
  }
}

// Filter active tiers based on season
function getActiveTiers() {
  return prices.tiers.filter(tier => isInSeason(tier.season));
}

// Example: Display active tiers in console
const activeTiers = getActiveTiers();
console.log('Active Services Today:', activeTiers);

// Optional: Function to render tiers on a webpage
function renderTiers(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // Clear container

  getActiveTiers().forEach(tier => {
    const tierDiv = document.createElement('div');
    tierDiv.className = 'tier-card';

    const title = document.createElement('h2');
    title.textContent = `${tier.name} (${tier.price})`;
    tierDiv.appendChild(title);

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
