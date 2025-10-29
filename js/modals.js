document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------
  // Helper: Initialize a modal
  // ------------------------------
  function initModal(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtn = modal.querySelector(".close");
    const form = modal.querySelector("form");
    const thankYou = modal.querySelector("#thankYou");

    // Close modal on X button
    if (closeBtn) closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.style.display = "none";
    });

    // Close modal on click outside content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
      }
    });

    // Form submission if a form exists
    if (form) {
      const GOOGLE_SCRIPT_URL = options.googleScript || "";
      const DISCORD_WEBHOOK = options.discordWebhook || "";

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
          if (GOOGLE_SCRIPT_URL)
            fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });

          if (DISCORD_WEBHOOK)
            await fetch(DISCORD_WEBHOOK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `📬 **New Quote Request**
**Name:** ${payload.name}
**Contact:** ${payload.contact}
**Service:** ${payload.service}
**Message:** ${payload.message || "No message provided."}`
              })
            });

          if (thankYou) {
            form.style.display = "none";
            thankYou.style.display = "block";
          }

          setTimeout(() => {
            modal.classList.remove("show");
            modal.style.display = "none";
            if (thankYou) thankYou.style.display = "none";
            form.reset();
            form.style.display = "block";
          }, 3000);

        } catch (err) {
          console.error(err);
          alert("There was a problem submitting the form. Please try again later.");
        }
      });
    }

    return modal;
  }

  // ------------------------------
  // Initialize Pricing Modal
  // ------------------------------
  const pricingContainer = document.querySelector(".pricing-cards");
  const priceModal = initModal("price-modal");

  if (pricingContainer && priceModal) {
    const modalTitle = priceModal.querySelector("#modal-title");
    const modalDetails = priceModal.querySelector("#modal-details");

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

        // Event delegation for dynamically created buttons
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
      })
      .catch(err => console.error("Error loading pricing JSON:", err));
  }

  // ------------------------------
  // Initialize Quote Modal
  // ------------------------------
  initModal("quoteModal", {
    googleScript: "https://script.google.com/macros/s/AKfycbwD-Eo5w-kMu1YRXw6-l9ALCliOEPzKBe5G4hxnQ_X3lVXqBbr49SwZTD5oIQi8Pa6kig/exec",
    discordWebhook: "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9"
  });

});
