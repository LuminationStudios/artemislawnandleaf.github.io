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

    // Open modal when button clicked
    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = data.tiers.find(t => t.id === btn.dataset.tier);
        if (!tier) return;

        modalTitle.textContent = `${tier.name} Tier Breakdown`;

        // Build modal details dynamically
        modalDetails.innerHTML = tier.details.map(item => {
          let content = '<li>';

          if (item.size) content += `<strong>Size:</strong> ${item.size}<br>`;
          if (item.area) content += `<strong>Area:</strong> ${item.area}<br>`;
          if (item.description) content += `<strong>Description:</strong> ${item.description}<br>`;

          if (item.price) content += `<strong>Price:</strong> $${item.price}<br>`;
          if (item.price_range) content += `<strong>Price Range:</strong> $${item.price_range}<br>`;

          if (item.estimated_time) content += `<strong>Estimated Time:</strong> ${item.estimated_time}<br>`;
          if (item.notes) content += `<strong>Notes:</strong> ${item.notes}<br>`;

          content += '</li>';
          return content;
        }).join('');

        modal.classList.add('show'); // Show modal
      });
    });

    // Close modal on close button
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    // Close modal if clicked outside content
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('show');
    });

  })
  .catch(err => console.error('Error loading pricing JSON:', err));
