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
  const menuToggle = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  console.log("Initializing mobile menu...", menuToggle, navLinks);

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link (mobile UX)
    navLinks.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("active");
      }
    });
  } else {
    console.warn("Hamburger or navLinks not found in DOM.");
  }
}

// ===========================
// 💌 Quote Modal
// ===========================
function setupQuoteModal() {
  const modal = document.getElementById("quoteModal");
  const closeBtn = modal?.querySelector(".close");
  const quoteBtn = document.getElementById("quoteBtn");

  if (quoteBtn && modal) {
    quoteBtn.addEventListener("click", e => {
      e.preventDefault();
      modal.style.display = "flex";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", e => {
    if (modal && e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// ===========================
// 🌸 Initialize Site
// ===========================
async function initSite() {
  console.log("Initializing site...");

  // Load JSON data concurrently
  const [navbarData, servicesData, footerData] = await Promise.all([
    loadJSON("json/navbar.json"),
    loadJSON("json/services.json"),
    loadJSON("json/footer.json")
  ]);

  // 🌸 Navbar
  const navEl = document.getElementById("navLinks");
  if (navbarData?.navbar?.links && navEl) {
    navEl.innerHTML = navbarData.navbar.links
      .map(link => {
        const cls = link.class ? `class="${link.class}"` : "";
        const id = link.id ? `id="${link.id}"` : "";
        return `<a href="${link.href}" ${cls} ${id}>${link.text}</a>`;
      })
      .join("");

    // Initialize interactive features AFTER navbar is rendered
    setupMobileMenu();
    setupQuoteModal();
  } else {
    console.warn("Navbar JSON missing or nav element not found.");
  }

  // 🌿 Services
  const servicesGrid = document.getElementById("services-grid");
  if (Array.isArray(servicesData?.services) && servicesGrid) {
    servicesGrid.innerHTML = servicesData.services
      .map(service => `<div class="service"><h3>${service.title}</h3><p>${service.desc}</p></div>`)
      .join("");
  } else {
    console.warn("Services JSON missing or services-grid element not found.");
  }

  // 🌼 Footer
  const footerEl = document.querySelector("footer");
  if (footerData?.footer && footerEl) {
    footerEl.innerHTML = `
      <div>${footerData.footer.left || ""}</div>
      <div>${footerData.footer.right || ""}</div>
    `;
  } else {
    console.warn("Footer JSON missing or footer element not found.");
  }

  console.log("Site initialization complete.");
}

// ===========================
// ✅ Attach after DOM is ready
// ===========================
document.addEventListener("DOMContentLoaded", initSite);
