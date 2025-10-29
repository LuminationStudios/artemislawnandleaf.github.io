document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const pricingContainer = document.querySelector(".pricing-cards");
  const modal = document.getElementById("price-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDetails = document.getElementById("modal-details");
  const closeBtn = modal.querySelector(".close");

  // Fetch pricing JSON and build cards
  fetch("json/prices.json")
    .then(res => res.json())
    .then(data => {
      // Build cards dynamically
      data.tiers.forEach(tier => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${tier.name}</h3>
          <button class="details-btn" data-tier="${tier.id}">View Details</button>
        `;
        pricingContainer.appendChild(card);
      });

      // Event delegation: handle clicks on buttons
      pricingContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("details-btn")) return;

        const tier = data.tiers.find(t => t.id === e.target.dataset.tier);
        if (!tier) return;

        // Fill modal content
        modalTitle.textContent = tier.name;
        modalDetails.innerHTML = tier.details.map(item => `
          <li>
            <strong>${item.label}</strong><br>
            <strong>Price:</strong> $${item.price}<br>
            ${item.notes ? `<em>${item.notes}</em>` : ""}
          </li>
        `).join("");

        modal.classList.add("show");
      });

      // Close modal button
      closeBtn.addEventListener("click", () => modal.classList.remove("show"));

      // Close modal when clicking outside content
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("show");
      });

    })
    .catch(err => console.error("Error loading pricing JSON:", err));
});
