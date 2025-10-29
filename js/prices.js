// Fetch pricing JSON and build cards
fetch('json/prices.json')
  .then(res => res.json())
  .then(data => {
    const pricingContainer = document.querySelector('.pricing-cards');
    if (!pricingContainer) return;

    // Create cards dynamically
    data.tiers.forEach(tier => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${tier.name}</h3>
        <button class="details-btn" data-tier="${tier.id}">View Details</button>
      `;
      pricingContainer.appendChild(card);
    });

    // Modal elements
    const modal = document.getElementById('price-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = modal.querySelector('.close');

    // Open modal when View Details is clicked
    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = data.tiers.find(t => t.id === btn.dataset.tier);
        if (!tier) return;

        modalTitle.textContent = tier.name;

        // Build tier details (using your actual JSON structure)
        modalDetails.innerHTML = tier.details.map(item => `
          <li>
            <strong>${item.label}</strong><br>
            <strong>Price:</strong> $${item.price}<br>
            ${item.notes ? `<em>${item.notes}</em>` : ""}
          </li>
        `).join("");

        modal.classList.add('show');
      });
    });

    // Close modal button
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));

    // Close modal if clicking outside content
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('show');
    });

  })
  .catch(err => console.error('Error loading pricing JSON:', err));
