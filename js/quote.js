const scriptURL = "https://script.google.com/macros/s/AKfycbxPu-hx1SV_14NLNiujx37TSXFlzV8xtgTOt0e3ZxywZJBMTS9Qn7MA9KRLv8ZBUdJy/exec";

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
        headers: { "Content-Type": "application/json" }, // ✅ THIS WAS MISSING
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("Thanks! Your quote request has been sent ✅");
        form.reset();
      } else {
        alert("There was an issue — feel free to contact me directly 😓");
      }
    } catch (error) {
      alert("Network error — please try again or text me 😓");
    }
  });
});
