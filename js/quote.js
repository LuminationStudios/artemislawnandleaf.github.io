// quote.js
document.addEventListener("DOMContentLoaded", () => {
  // 🌸 Quote Modal Elements
  const quoteModal = document.getElementById("quoteModal");
  const quoteCloseBtn = quoteModal.querySelector(".close");
  const quoteForm = document.getElementById("quoteForm");
  const thankYou = document.getElementById("thankYou");

  // ------------------------------
  // Close Modal
  // ------------------------------
  quoteCloseBtn.addEventListener("click", () => {
    quoteModal.style.display = "none";
  });

  // Close modal when clicking outside modal content
  quoteModal.addEventListener("click", (e) => {
    if (e.target === quoteModal) quoteModal.style.display = "none";
  });

  // ------------------------------
  // Form Submission
  // ------------------------------
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwD-Eo5w-kMu1YRXw6-l9ALCliOEPzKBe5G4hxnQ_X3lVXqBbr49SwZTD5oIQi8Pa6kig/exec";
  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9";

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Send to Google Script
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      // Send to Discord
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📬 **New Quote Request**
**Name:** ${payload.name}
**Contact:** ${payload.contact}
**Service:** ${payload.service}
**Message:** ${payload.message || "No message provided."}`,
        }),
      });

      // Show thank you message
      quoteForm.style.display = "none";
      thankYou.style.display = "block";

      // Reset modal after 3s
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
