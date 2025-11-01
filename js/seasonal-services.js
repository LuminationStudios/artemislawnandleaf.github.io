document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("services-grid");
  if (!grid) return;

  try {
    const res = await fetch("json/seasonal-services.json?v=" + Date.now());
    if (!res.ok) throw new Error("Failed to load JSON");
    const data = await res.json();

    const todayNum = (new Date().getMonth() + 1) * 100 + new Date().getDate();
    let services = [];

    for (const season of data.seasons) {
      const startNum = Number(season.start.replace("-", ""));
      const endNum = Number(season.end.replace("-", ""));
      const inRange = (startNum <= endNum && todayNum >= startNum && todayNum <= endNum) ||
                      (startNum > endNum && (todayNum >= startNum || todayNum <= endNum));
      if (inRange) {
        services = season.services || [];
        break;
      }
    }

    grid.innerHTML = services
      .map(s => `<div class="service"><h3>${s.title}</h3><p>${s.desc}</p></div>`)
      .join("");

  } catch (err) {
    console.error("Error loading seasonal services:", err);
  }
});
