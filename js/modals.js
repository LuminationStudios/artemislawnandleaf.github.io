document.addEventListener("DOMContentLoaded", () => {

  // Generic modal initializer
  function initModal(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const modalContent = modal.querySelector(".modal-content");
    const closeBtn = modal.querySelector(".close");
    const form = modal.querySelector("form");
    const thankYou = modal.querySelector("#thankYou");

    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

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

  const quoteModal = initModal("quoteModal", {
    googleScript: "https://script.google.com/macros/s/AKfycbwD-Eo5w-kMu1YRXw6-l9ALCliOEPzKBe5G4hxnQ_X3lVXqBbr49SwZTD5oIQi8Pa6kig/exec",
    discordWebhook: "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9"
  });

  // Open from any button with `data-open-quote`
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-quote], .quote-btn");
    if (!trigger) return;
    e.preventDefault();

    // Auto-fill service if available
    const serviceInput = quoteModal.querySelector('[name="service"]');
    if (serviceInput && trigger.dataset.service) serviceInput.value = trigger.dataset.service;

    quoteModal.classList.add("show");
  });

});
