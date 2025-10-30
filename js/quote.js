const scriptURL = "https://script.google.com/macros/s/AKfycbxVkZHbsPC48yV0G6V1nLGRTz-mVe48f-wL2jZSs1PfylkeybJrOLza8TFt1PpfDpY/exec";

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

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        // ✅ Show success message
        const successMsg = document.createElement("p");
        successMsg.textContent = "✅ Thanks! Your quote request has been sent.";
        successMsg.style.color = "#4CAF50";
        successMsg.style.fontWeight = "600";
        successMsg.style.marginTop = "16px";
        form.appendChild(successMsg);

        // Reset form fields
        form.reset();
      } else {
        alert("There was an issue — feel free to contact me directly 😓");
      }
    } catch (error) {
      alert("Network error — please try again or text me 😓");
    }
  });
});
