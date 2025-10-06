async function loadNavbar() {
  try {
    const res = await fetch("nav.json");
    const data = await res.json();
    const navContainer = document.getElementById("navbar");

    if (!navContainer) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    let html = "";

    data.links.forEach(link => {
      const isActive =
        currentPage === link.href ||
        (currentPage === "index.html" && link.href === "index.html");

      html += `
        <a class="btn${isActive ? " active" : ""}" href="${link.href}">
          ${link.text}
        </a>`;
    });

    navContainer.innerHTML = html;
  } catch (error) {
    console.error("Navbar failed to load:", error);
  }
}

loadNavbar();
