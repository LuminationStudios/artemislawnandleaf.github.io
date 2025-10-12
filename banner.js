fetch('json/banner.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date();
    const bannerEl = document.getElementById('banner');

    // Find the first banner valid for today
    const activeBanner = data.banners.find(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return today >= start && today <= end;
    });

    if (activeBanner) {
      bannerEl.textContent = activeBanner.text;
      bannerEl.style.background = activeBanner.background;
    } else {
      // Optional: hide banner if none are active
      bannerEl.style.display = 'none';
    }
  })
  .catch(err => console.error("Error loading banner:", err));
