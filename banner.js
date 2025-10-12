fetch('json/banner.json') // adjust path if needed
  .then(res => res.json())
  .then(data => {
    const today = new Date();
    const bannerEl = document.getElementById('banner');

    // Get all banners valid for today
    const activeBanners = data.banners.filter(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return today >= start && today <= end;
    });

    if (activeBanners.length === 0) {
      bannerEl.style.display = 'none';
      return;
    }

    let index = 0;

    const showBanner = () => {
      const banner = activeBanners[index];
      bannerEl.style.opacity = 0; // fade out

      setTimeout(() => {
        bannerEl.textContent = banner.text;
        bannerEl.style.background = banner.background;
        bannerEl.style.opacity = 1; // fade in
      }, 500); // match transition time

      index = (index + 1) % activeBanners.length;
    };

    showBanner(); // show first banner immediately
    setInterval(showBanner, 5000); // rotate every 5 seconds
  })
  .catch(err => console.error("Error loading banner:", err));
