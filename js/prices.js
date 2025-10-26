// Fetch pricing JSON and build cards
fetch('json/prices.json')
  .then(res => res.json())
  .then(data => {
    const pricingContainer = document.querySelector('.pricing-cards');
    if (!pricingContainer) return;

    data.tiers.forEach(tier => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${tier.name}</h3>
        <p>$${tier.price}</p>
        <button class="details-btn" data-tier="${tier.id}">View Details</button>
      `;
      pricingContainer.appendChild(card);
    });

    // Modal functionality
    const modal = document.getElementById('price-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = data.tiers.find(t => t.id === btn.dataset.tier);
        if (!tier) return;
        modalTitle.textContent = `${tier.name} Tier Breakdown`;
        modalDetails.innerHTML = tier.details.map(item => `<li>${item}</li>`).join('');
        modal.style.display = 'block';
      });
    });

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  })
  .catch(err => console.error('Error loading pricing JSON:', err));
