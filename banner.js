// ✅ banner.js
(async function() {
  const bannerEl = document.getElementById("banner");
  if (!bannerEl) return console.warn("Banner element not found in HTML.");

  try {
    const res = await fetch(`json/banner.json?v=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load banner.json: ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data.banners) || data.banners.length === 0) {
      bannerEl.style.display = "none";
      return console.warn("No banners found in JSON.");
    }

    const today = new Date();

    // Sort banners by startDate
    const banners = data.banners
      .map(b => ({
        ...b,
        start: new Date(b.startDate),
        end: b.endDate ? new Date(b.endDate) : null
      }))
      .sort((a, b) => a.start - b.start);

    let activeBanner = null;

    for (let i = 0; i < banners.length; i++) {
      const start = banners[i].start;
      let end;

      if (i < banners.length - 1) {
        // End at the day before next banner starts
        end = new Date(banners[i + 1].start.getTime() - 86400000);
      } else {
        // Last banner uses its endDate or forever if null
        end = banners[i].end || new Date("2099-12-31");
      }

      if (today >= start && today <= end) {
        activeBanner = banners[i];
        break;
      }
    }

    if (!activeBanner) {
      bannerEl.style.display = "none";
      return;
    }

    // Fade-in function
    const showBanner = banner => {
      bannerEl.style.transition = "opacity 0.5s";
      bannerEl.style.opacity = 0;
      setTimeout(() => {
        bannerEl.textContent = banner.text;
        bannerEl.style.background = banner.background;
        bannerEl.style.display = "block";
        bannerEl.style.opacity = 1;
      }, 50);
    };

    showBanner(activeBanner);

  } catch (err) {
    console.error("Error loading banner:", err);
    bannerEl.style.display = "none";
  }
})();
