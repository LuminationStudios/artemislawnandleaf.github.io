async function loadBanner() {
  try {
    const res = await fetch("json/banner.json");
    if (!res.ok) throw new Error("Failed to load banner.json");
    const data = await res.json();

    const banners = data.banners || [];
    const rotationInterval = data.rotationInterval || 7000;

    if (banners.length === 0) return;

    const banner = document.createElement("div");
    banner.className = "banner fade";
    document.body.insertBefore(banner, document.querySelector("main"));

    let index = 0;
    let interval;

    const updateBanner = () => {
      const b = banners[index];
      banner.style.background = b.background || "linear-gradient(90deg, #FFB88C, #FFD27F)";
      banner.innerHTML = b.text;
      banner.style.opacity = 0;
      setTimeout(() => (banner.style.opacity = 1), 200);
      index = (index + 1) % banners.length;
    };

    const startRotation = () => {
      updateBanner();
      interval = setInterval(updateBanner, rotationInterval);
    };

    const stopRotation = () => clearInterval(interval);

    banner.addEventListener("mouseenter", stopRotation);
    banner.addEventListener("mouseleave", startRotation);

    startRotation();

    document.addEventListener("click", e => {
      if (e.target && e.target.id === "quoteBannerBtn") {
        const modal = document.getElementById("quoteModal");
        if (modal) modal.style.display = "flex";
      }
    });

  } catch (err) {
    console.error("Banner error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadBanner);
