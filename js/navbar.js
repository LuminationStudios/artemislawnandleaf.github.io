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
// 💌 Quote Modal Trigger Setup
// ===========================
function setupQuoteTriggers() {
  const overlay = document.getElementById("quoteOverlay");
  if (!overlay) return;

  // Any element with data-open-quote opens the modal
  document.querySelectorAll("[data-open-quote]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.classList.add("active");
    });
  });
}

// ===========================
// 🌸 Initialize Site
// ===========================
async function initSite() {
  console.log("🌿 Initializing site...");

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

        // If link is a modal trigger, create a button-like element
        if (link["data-open-quote"]) {
          return `<a ${cls} data-open-quote>${link.text}</a>`;
        }

        // Otherwise normal navigation link
        return `<a href="${link.href}" ${cls}>${link.text}</a>`;
      })
      .join("");

    setupMobileMenu();
    setupQuoteTriggers(); // ✅ enable modal from navbar
  }

  // 🌿 Services
  const servicesGrid = document.getElementById("services-grid");
  if (Array.isArray(servicesData?.services) && servicesGrid) {
    servicesGrid.innerHTML = servicesData.services
      .map(service => `
        <div class="service">
          <h3>${service.title}</h3>
          <p>${service.desc}</p>
        </div>
      `)
      .join("");
  }

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
