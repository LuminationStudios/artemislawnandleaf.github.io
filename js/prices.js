document.addEventListener("DOMContentLoaded", () => {
  const pricingContainer = document.querySelector(".pricing-cards");
  const priceModal = document.getElementById("price-modal");
  const modalTitle = priceModal.querySelector("#modal-title");
  const modalDetails = priceModal.querySelector("#modal-details");
  const closeBtn = priceModal.querySelector(".close");

  // Fetch pricing JSON
  fetch("json/prices.json")
    .then(res => res.json())
    .then(data => {
      data.tiers.forEach(tier => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${tier.name}</h3>
          <button class="details-btn" data-tier="${tier.id}">View Details</button>
        `;
        pricingContainer.appendChild(card);
      });

      // Event delegation: open modal when a details button is clicked
      pricingContainer.addEventListener("click", e => {
        if (!e.target.classList.contains("details-btn")) return;

        const tier = data.tiers.find(t => t.id === e.target.dataset.tier);
        if (!tier) return;

        modalTitle.textContent = tier.name;
        modalDetails.innerHTML = tier.details.map(item => `
          <li>
            <strong>${item.label}</strong><br>
            <strong>Price:</strong> $${item.price}<br>
            ${item.notes ? `<em>${item.notes}</em>` : ""}
          </li>
        `).join("");

        priceModal.classList.add("show");
      });

      // Close modal
      closeBtn.addEventListener("click", () => priceModal.classList.remove("show"));
      priceModal.addEventListener("click", e => {
        if (e.target === priceModal) priceModal.classList.remove("show");
      });
    })
    .catch(err => console.error("Error loading pricing JSON:", err));
});
