
// Replace with your deployed Google Apps Script Web App URL
const scriptURL = "https://script.google.com/macros/s/AKfycbxVkZHbsPC48yV0G6V1nLGRTz-mVe48f-wL2jZSs1PfylkeybJrOLza8TFt1PpfDpY/exec";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const data = {
      Name: form.Name.value,
      Contact: form.Contact.value,
      Service: form.Service.value,
      Details: form.Details.value
    };

    // Remove previous messages
    const existingMsg = document.getElementById("formMsg");
    if (existingMsg) existingMsg.remove();

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const msg = document.createElement("p");
      msg.id = "formMsg";
      msg.style.fontWeight = "600";
      msg.style.marginTop = "16px";
      msg.style.textAlign = "center";

      if (res.ok) {
        // Success
        msg.textContent = "✅ Thanks! Your quote request has been sent.";
        msg.style.color = "#4CAF50";
        form.reset();
      } else {
        // Error from server
        msg.textContent = "⚠️ There was an issue — please contact directly.";
        msg.style.color = "#E53935";
      }

      form.appendChild(msg);

    } catch (error) {
      // Network / CORS error
      const msg = document.createElement("p");
      msg.id = "formMsg";
      msg.textContent = "⚠️ Network error — please try again or text me.";
      msg.style.color = "#E53935";
      msg.style.fontWeight = "600";
      msg.style.marginTop = "16px";
      msg.style.textAlign = "center";
      form.appendChild(msg);
      console.error(error);
    }
  });
});
