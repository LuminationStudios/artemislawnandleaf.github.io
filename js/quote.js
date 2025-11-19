// Discord webhook URL (unsafe if public)
const discordWebhookURL = "https://discord.com/api/webhooks/1425416157275492456/sOL9u2X6Gj61gFuAPaGXMcRTNhIMiiddF21StQ41530JjDivKmMAXFgSqsA4K6KAVjh9";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      Name: form.Name.value,
      Contact: form.Contact.value,
      Service: form.Service.value,
      Details: form.Details.value
    };

    // Remove previous message
    const existingMsg = document.getElementById("formMsg");
    if (existingMsg) existingMsg.remove();

    try {
      // Send to Discord webhook
      const discordPayload = {
        embeds: [{
          title: "New Quote Request 📬",
          color: 0xffb6c1,
          fields: [
            { name: "Name", value: data.Name },
            { name: "Contact", value: data.Contact },
            { name: "Service", value: data.Service },
            { name: "Details", value: data.Details || "No extra details" }
          ]
        }]
      };

      const res = await fetch(discordWebhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload)
      });

      const msg = document.createElement("p");
      msg.id = "formMsg";
      msg.style.fontWeight = "600";
      msg.style.marginTop = "16px";
      msg.style.textAlign = "center";

      if (res.ok) {
        msg.textContent = "✅ Request Submitted!";
        msg.style.color = "#4CAF50";
        form.reset();
      } else {
        msg.textContent = "⚠️ Request Failed | Please message us @ (208) 994-5679";
        msg.style.color = "#E53935";
      }

      form.appendChild(msg);

    } catch (error) {
      const msg = document.createElement("p");
      msg.id = "formMsg";
      msg.textContent = "⚠️ Network error — could not send.";
      msg.style.color = "#E53935";
      msg.style.fontWeight = "600";
      msg.style.marginTop = "16px";
      msg.style.textAlign = "center";
      form.appendChild(msg);
      console.error(error);
    }
  });
});
