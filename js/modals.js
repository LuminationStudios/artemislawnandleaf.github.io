document.addEventListener("DOMContentLoaded", () => {

  // Generic modal initializer
  function initModal(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtn = modal.querySelector(".close");
    const form = modal.querySelector("form");
    const thankYou = modal.querySelector("#thankYou");

    // Close modal
    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

    // Form submission
    if (form) {
      const GOOGLE_SCRIPT_URL = options.googleScript || "";
      const DISCORD_WEBHOOK = options.discordWebhook || "";

      form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
          if (GOOGLE_SCRIPT_URL)
            fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(data) });

          if (DISCORD_WEBHOOK)
            await fetch(DISCORD_WEBHOOK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `📬 **New Quote Request**
**Name:** ${data.name}
**Contact:** ${data.contact}
**Service:** ${data.service}
**Message:** ${data.message || "No message provided."}`
              })
            });

          if (thankYou) {
            form.style.display = "none";
            thankYou.style.display = "block";
          }

          setTimeout(() => {
            modal.classList.remove("show");
            if (thankYou) thankYou.style.display = "none";
            form.reset();
            form.style.display = "block";
          }, 3000);

        } catch (err) {
          console.error(err);
          alert("Error submitting form.");
        }
      });
    }

    return modal;
  }

  // Pricing modal setup
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

          // ✅ Added Request Quote button with auto-fill service name
          card.innerHTML = `
            <h3>${tier.name}</h3>
            <button class="details-btn" data-tier="${tier.id}">View Details</button>
            <button class="quote-btn" data-service="${tier.name}">Request Quote</button>
          `;

          pricingContainer.appendChild(card);
        });

        pricingContainer.addEventListener("click", e => {
          if (e.target.classList.contains("details-btn")) {
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
          }
        });
      })
      .catch(err => console.error("Error loading pricing JSON:", err));
  }

  // Quote modal setup
  const quoteModal = initModal("quoteModal", {
    googleScript: "https://script.google.com/macros/s/AKfycbwD-Eo5w-kMu1YRXw6-l9ALCliOEPzKBe5G4hxnQ_X3lVXqBbr49SwZTD5oIQi8Pa6kig/exec",
    discordWebhook: "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9"
  });

  // ✅ Open Quote Modal from service/pricing cards + auto-fill service field
  document.addEventListener("click", e => {
    const btn = e.target.closest(".quote-btn");
    if (!btn) return;

    const serviceName = btn.dataset.service;
    const serviceField = quoteModal.querySelector("[name='service']");

    if (serviceField) serviceField.value = serviceName;

    quoteModal.classList.add("show");
  });

});
