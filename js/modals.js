document.addEventListener("DOMContentLoaded", () => {

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

  // -------------------------
  // Pricing Cards
  // -------------------------
  const pricingContainer = document.querySelector(".pricing-cards");
  const priceModal = initModal("price-modal");
  const quoteModal = initModal("quoteModal", {
    googleScript: "https://script.google.com/macros/s/YOUR_SCRIPT/exec",
    discordWebhook: "https://discord.com/api/webhooks/YOUR_WEBHOOK"
  });

  fetch("json/prices.json")
    .then(res => res.json())
    .then(data => {
      data.tiers.forEach(tier => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${tier.name}</h3>
          <p class="price">$${tier.price || "—"}</p>
          <button class="details-btn" data-tier="${tier.id}">View Details</button>
          <button class="quote-btn" data-service="${tier.name}">Request Quote</button>
        `;
        pricingContainer.appendChild(card);
      });

      // Pricing Details Modal
      pricingContainer.addEventListener("click", e => {
        if (e.target.classList.contains("details-btn")) {
          const tier = data.tiers.find(t => t.id === e.target.dataset.tier);
          if (!tier) return;
          const modalTitle = priceModal.querySelector("#modal-title");
          const modalDetails = priceModal.querySelector("#modal-details");
          modalTitle.textContent = tier.name;
          modalDetails.innerHTML = tier.details.map(d => `<li>${d.label}: $${d.price}</li>`).join("");
          priceModal.classList.add("show");
        }

        // Quote Button
        if (e.target.classList.contains("quote-btn")) {
          const serviceName = e.target.dataset.service;
          const serviceInput = quoteModal.querySelector('[name="service"]');
          if (serviceInput) serviceInput.value = serviceName;
          quoteModal.classList.add("show");
        }
      });

    })
    .catch(err => console.error(err));

});
