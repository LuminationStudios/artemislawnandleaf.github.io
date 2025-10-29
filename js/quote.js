document.addEventListener("DOMContentLoaded", () => {
  const quoteModal = document.getElementById("quoteModal");
  const closeBtn = quoteModal.querySelector(".close");
  const quoteForm = quoteModal.querySelector("#quoteForm");
  const thankYou = quoteModal.querySelector("#thankYou");

  // Close modal
  closeBtn.addEventListener("click", () => quoteModal.style.display = "none");
  quoteModal.addEventListener("click", e => {
    if (e.target === quoteModal) quoteModal.style.display = "none";
  });

  // Form submission
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwD-Eo5w-kMu1YRXw6-l9ALCliOEPzKBe5G4hxnQ_X3lVXqBbr49SwZTD5oIQi8Pa6kig/exec";
  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9";

  quoteForm.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
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

      quoteForm.style.display = "none";
      thankYou.style.display = "block";

      setTimeout(() => {
        quoteModal.style.display = "none";
        thankYou.style.display = "none";
        quoteForm.reset();
        quoteForm.style.display = "block";
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("There was a problem submitting your quote. Please try again later.");
    }
  });
});
