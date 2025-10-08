async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`); // cache-busting
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return null;
  }
}

async function initSite() {
  const [headerData, bodyData, servicesData, footerData] = await Promise.all([
    loadJSON("header.json"),
    loadJSON("body.json"),
    loadJSON("services.json"),
    loadJSON("footer.json")
  ]);

  // Header
  if (headerData && document.getElementById("brand")) {
    document.getElementById("brand").innerHTML = `
      <div class="logo">${headerData.brand.logo || "🍂"}</div>
      <div>
        <div style="font-weight:700">${headerData.brand.name || "Artemis Lawn & Leaf"}</div>
        <div style="font-size:12px;color:#8b7a6f">${headerData.brand.tagline || "Friendly seasonal yard cleanup"}</div>
      </div>
    `;
  }

  // Hero
  if (bodyData && document.getElementById("hero-text")) {
    document.getElementById("hero-text").innerHTML = `
      <h1>${bodyData.hero.title}</h1>
      <p class="lead">${bodyData.hero.subtitle}</p>
    `;
  }

  // Services
  if (servicesData && document.getElementById("services-grid")) {
    const servicesGrid = document.getElementById("services-grid");
    servicesGrid.innerHTML = "";
    servicesData.services.forEach(s => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
      servicesGrid.appendChild(el);
    });
  }

  // Footer
  if (footerData && document.querySelector("footer")) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
      <div>${footerData.footer.left || "© Artemis Lawn & Leaf"}</div>
      <div>${footerData.footer.right || "Seasonal yard care & leaf removal"}</div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initSite);
