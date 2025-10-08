async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

async function initSite() {
  const [headerData, bodyData, servicesData, footerData] = await Promise.all([
    loadJSON("data/header.json"),
    loadJSON("data/body.json"),
    loadJSON("data/services.json"),
    loadJSON("data/footer.json")
  ]);

  // Header
  document.getElementById("brand").innerHTML = `
    <div class="logo">${headerData.brand.logo}</div>
    <div>
      <div style="font-weight:700">${headerData.brand.name}</div>
      <div style="font-size:12px;color:#8b7a6f">${headerData.brand.tagline}</div>
    </div>
  `;

  // Hero
  document.getElementById("hero-text").innerHTML = `
    <h1>${bodyData.hero.title}</h1>
    <p class="lead">${bodyData.hero.subtitle}</p>
  `;

  // Services
  const servicesGrid = document.getElementById("services-grid");
  servicesData.services.forEach(s => {
    const el = document.createElement("div");
    el.className = "service";
    el.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
    servicesGrid.appendChild(el);
  });

  // Footer
  const footer = document.querySelector("footer");
  footer.innerHTML = `
    <div>${footerData.footer.left}</div>
    <div>${footerData.footer.right}</div>
  `;
}

initSite();
