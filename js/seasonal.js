<script>
fetch('/seasonal.json')
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

      // Handle seasons that cross the year boundary (like winter)
      let isWinter = start > end;
      let inRange = false;

      if (!isWinter) {
        inRange = todayMD >= start && todayMD <= end;
      } else {
        inRange = todayMD >= start || todayMD <= end;
      }

      if (inRange) {
        season.cssFiles.forEach(file => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = file;
          document.head.appendChild(link);
        });
      }
    });
  });
</script>
