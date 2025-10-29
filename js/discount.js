// ✅ banner.js
(async function() {
  const bannerEl = document.getElementById("discount");
  if (!bannerEl) return console.warn("Banner element not found in HTML.");

  try {
    const res = await fetch(`json/discount.json?v=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load discount.json: ${res.status}`);
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
      const end = i < banners.length - 1
        ? new Date(banners[i + 1].start.getTime() - 1) // until just before next banner
        : banners[i].end || new Date("2099-12-31");    // last banner

      // Show banner if today >= start OR this is the first banner
      if (today >= start && today <= end) {
        activeBanner = banners[i];
        break;
      }
      // If no active banner yet, show the first banner as placeholder
      if (i === 0 && today < start) {
        activeBanner = banners[i];
        break;
      }
    }

    if (!activeBanner) {
      bannerEl.style.display = "none";
      return;
    }

    // Fade-in function
    bannerEl.style.transition = "opacity 0.5s";
    bannerEl.style.opacity = 0;
    setTimeout(() => {
      bannerEl.textContent = activeBanner.text;
      bannerEl.style.background = activeBanner.background;
      bannerEl.style.display = "block";
      bannerEl.style.opacity = 1;
    }, 50);

  } catch (err) {
    console.error("Error loading banner:", err);
    bannerEl.style.display = "none";
  }
})();
