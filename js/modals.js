document.addEventListener("DOMContentLoaded", () => {

  // Generic modal initializer
  function initModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return null;

    const closeBtn = modal.querySelector(".close");

    // Close when clicking the X
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
      });
    }

    // Close when clicking outside the modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });

    return modal;
  }

  const pricingContainer = document.querySelector(".pricing-cards");
  const priceModal = initModal("price-modal");

  // Load pricing tiers
  fetch("json/prices.json")
    .then((res) => res.json())
    .then((data) => {
      data.tiers.forEach((tier) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h3>${tier.name}</h3>
          <p class="price">$${tier.price || "—"}</p>
          <button class="details-btn" data-tier="${tier.id}">View Details</button>
        `;

        pricingContainer.appendChild(card);
      });

      // Handle details button click → Open modal with details
      pricingContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("details-btn")) {
          const tier = data.tiers.find((t) => t.id === e.target.dataset.tier);
          if (!tier) return;

          const modalTitle = priceModal.querySelector("#modal-title");
          const modalDetails = priceModal.querySelector("#modal-details");

          modalTitle.textContent = tier.name;
          modalDetails.innerHTML = tier.details
            .map((d) => `<li>${d.label}: $${d.price}</li>`)
            .join("");

          priceModal.classList.add("show");
        }
      });
    })
    .catch((err) => console.error("Error loading pricing data:", err));

});
