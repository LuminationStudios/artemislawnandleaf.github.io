(function() {
  // Synchronously load JSON
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'json/seasonal-css.json', false);
  xhr.send(null);

  if (xhr.status === 200) {
    try {
      const data = JSON.parse(xhr.responseText);
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const formatMD = (m, d) => `${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const todayMD = formatMD(month, day);

      data.seasons.forEach(season => {
        let start = season.start;
        let end = season.end;
        let crossesYear = start > end;
        let inRange = crossesYear ? (todayMD >= start || todayMD <= end) : (todayMD >= start && todayMD <= end);

        if (inRange) {
          // Preload all CSS files
          season.cssFiles.forEach(file => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = file;
            preloadLink.as = 'style';
            preloadLink.onload = () => {
              const styleLink = document.createElement('link');
              styleLink.rel = 'stylesheet';
              styleLink.href = file;
              document.head.appendChild(styleLink);
            };
            document.head.appendChild(preloadLink);
          });
        }
      });
    } catch (e) {
      console.error('Error parsing seasonal JSON:', e);
    }
  } else {
    console.error('Error loading seasonal JSON:', xhr.status);
  }
})();
