// ===========================
// 🌟 Utility to load JSON with cache-busting
// ===========================
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

// ===========================
// 🍔 Mobile Menu Toggle
// ===========================
function setupMobileMenu() {
  const menuToggle = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.onclick = () => navLinks.classList.toggle("active");
    navLinks.onclick = (e) => {
      if (e.target.tagName === "A") navLinks.classList.remove("active");
    };
  } else {
    setTimeout(setupMobileMenu, 300);
  }
}

// ===========================
// 🌿 Load Seasonal Services
// ===========================
async function loadServices() {
  const servicesGrid = document.getElementById("services-grid");
  if (!servicesGrid) return;

  const servicesData = await loadJSON("json/seasonal-services.json");
  if (!Array.isArray(servicesData?.services)) return;

  servicesGrid.innerHTML = servicesData.services
    .map(service => `
      <div class="service">
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      </div>
    `)
    .join("");
}

// ===========================
// 🌸 Initialize Site
// ===========================
async function initSite() {
  console.log("🌿 Initializing site...");

  const [navbarData, footerData] = await Promise.all([
    loadJSON("json/navbar.json"),
    loadJSON("json/footer.json")
  ]);

  // 🌸 Navbar
  const navEl = document.getElementById("navLinks");
  if (navbarData?.navbar?.links && navEl) {
    const isQuotePage = window.location.pathname.includes("quote"); // Detect quote page

    navEl.innerHTML = navbarData.navbar.links
      .map(link => {
        if (isQuotePage && link["data-open-quote"]) return "";
        const cls = link.class ? `class="${link.class}"` : "";
        if (link["data-open-quote"]) return `<a ${cls} data-open-quote>${link.text}</a>`;
        return `<a href="${link.href}" ${cls}>${link.text}</a>`;
      })
      .join("");

    setupMobileMenu();
  }

  // 🌿 Services
  await loadServices();

  // 🌼 Footer
  const footerEl = document.querySelector("footer");
  if (footerData?.footer && footerEl) {
    footerEl.innerHTML = `
      <div>${footerData.footer.left || ""}</div>
      <div>${footerData.footer.right || ""}</div>
    `;
  }

  console.log("✅ Site initialization complete.");
}

// ===========================
// 📦 Run after DOM is ready
// ===========================
document.addEventListener("DOMContentLoaded", initSite);
