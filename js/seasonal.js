fetch('json/seasonal-css.json')
  .then(res => res.json())
  .then(data => {
    const today = new Date();
    const month = today.getMonth() + 1; // 0-based
    const day = today.getDate();

    const formatMD = (m, d) => `${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const todayMD = formatMD(month, day);

    data.seasons.forEach(season => {
      let start = season.start;
      let end = season.end;

      // Handle seasons crossing the year boundary (e.g., winter)
      let crossesYear = start > end;
      let inRange = crossesYear ? (todayMD >= start || todayMD <= end) : (todayMD >= start && todayMD <= end);

      if (inRange) {
        season.cssFiles.forEach(file => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = file;
          document.head.appendChild(link);
        });
      }
    });
  })
  .catch(err => console.error('Error loading seasonal CSS:', err));
