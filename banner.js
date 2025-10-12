fetch('json/banner.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date();
    const bannerEl = document.getElementById('banner');

    // Sort banners by startDate
    const banners = data.banners.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    let activeBanner = null;

    for (let i = 0; i < banners.length; i++) {
      const start = new Date(banners[i].startDate);
      let end;

      if (i < banners.length - 1) {
        // End at the day before next banner starts
        end = new Date(new Date(banners[i + 1].startDate).getTime() - 86400000);
      } else {
        end = new Date(banners[i].endDate);
      }

      if (today >= start && today <= end) {
        activeBanner = banners[i];
        break;
      }
    }

    if (activeBanner) {
      bannerEl.textContent = activeBanner.text;
      bannerEl.style.background = activeBanner.background;
      bannerEl.style.display = "block";
    } else {
      bannerEl.style.display = "none";
    }
  })
  .catch(err => console.error("Error loading banner:", err));
