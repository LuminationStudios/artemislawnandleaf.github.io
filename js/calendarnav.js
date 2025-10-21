// ✅ Utility to load JSON with cache-busting
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
  console.log("Initializing site...");

  // Load all JSON concurrently
  const [navbarData, footerData] = await Promise.all([
    loadJSON("json/calendarnav.json"),
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

    // Optional quote button
    const quoteBtn = document.getElementById("quoteBtn");
    const modal = document.getElementById("quoteModal");
    if (quoteBtn && modal) {
      quoteBtn.addEventListener("click", e => {
        e.preventDefault();
        modal.style.display = "flex";
      });
    }
  } else {
    console.warn("Navbar JSON missing or nav element not found.");
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

// ✅ Attach after DOM is ready
document.addEventListener("DOMContentLoaded", initSite);
