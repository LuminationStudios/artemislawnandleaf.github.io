const scriptURL = "YOUR_GOOGLE_WEB_APP_URL_HERE";

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
