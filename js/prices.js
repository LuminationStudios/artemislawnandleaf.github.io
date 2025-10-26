
fetch('prices.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.pricing-grid');
    container.innerHTML = '';

    data.prices.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${item.title}</h2>
        <div class="price">${item.price}</div>
        <button class="open-price-modal" data-id="${item.id}">More Info</button>
      `;
      container.appendChild(card);
    });

    document.addEventListener('click', e => {
      if (e.target.classList.contains('open-price-modal')) {
        const id = e.target.dataset.id;
        const item = data.prices.find(p => p.id === id);

        document.getElementById('priceModalTitle').textContent = item.title;
        document.getElementById('priceModalDetails').textContent = item.details;
        document.getElementById('priceModal').classList.add('active');
      }
    });

    document.getElementById('closePriceModal').addEventListener('click', () => {
      document.getElementById('priceModal').classList.remove('active');
    });
  });
