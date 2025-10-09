async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return null;
  }
}

async function initSite() {
  const [navbarData, servicesData, footerData] = await Promise.all([
    loadJSON("navbar.json"),
    loadJSON("services.json"),
    loadJSON("footer.json")
  ]);

  // 🌸 Navbar
  if (navbarData && navbarData.navbar && document.getElementById("navLinks")) {
    const nav = document.getElementById("navLinks");
    nav.innerHTML = navbarData.navbar.links.map(link => {
      const cls = link.class ? `class="${link.class}"` : "";
      const id = link.id ? `id="${link.id}"` : "";
      return `<a href="${link.href}" ${cls} ${id}>${link.text}</a>`;
    }).join("");

    // Quote modal trigger
    const quoteBtn = document.getElementById("quoteBtn");
    const modal = document.getElementById("quoteModal");
    if (quoteBtn && modal) {
      quoteBtn.addEventListener("click", e => {
        e.preventDefault();
        modal.style.display = "flex";
      });
    }
  }

  // 🌿 Services
  if (servicesData && servicesData.services && document.getElementById("services-grid")) {
    const servicesGrid = document.getElementById("services-grid");
    servicesGrid.innerHTML = servicesData.services.map(service => `
      <div class="service">
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      </div>
    `).join("");
  }

  // 🌼 Footer
  if (footerData && footerData.footer && document.querySelector("footer")) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
      <div>${footerData.footer.left}</div>
      <div>${footerData.footer.right}</div>
    `;
  }

  // 📱 Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", initSite);
