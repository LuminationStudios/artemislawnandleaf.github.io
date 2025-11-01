// seasonal.js

// ===========================
// 🌟 Utility: Fetch JSON with cache-busting
// ===========================
async function loadJSON(path) {
    try {
        const res = await fetch(`${path}?v=${Date.now()}`);
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`Error loading ${path}:`, err);
        return null;
    }
}

// ===========================
// 🌿 Convert MM-DD to number MMDD
// ===========================
function mmddToNumber(str) {
    const [m, d] = str.split('-').map(Number);
    return m * 100 + d;
}

// ===========================
// 🌿 Check if today is in season range
// ===========================
function isInSeason(todayNum, startNum, endNum) {
    return startNum <= endNum ? todayNum >= startNum && todayNum <= endNum : todayNum >= startNum || todayNum <= endNum;
}

// ===========================
// 🌿 Load Seasonal CSS
// ===========================
async function loadSeasonCSS() {
    const data = await loadJSON('json/seasonal-css.json');
    if (!data) return;

    const todayNum = (new Date().getMonth() + 1) * 100 + new Date().getDate();

    for (const season of data.seasons) {
        const startNum = mmddToNumber(season.start);
        const endNum = mmddToNumber(season.end);

        if (isInSeason(todayNum, startNum, endNum)) {
            season.cssFiles.forEach(file => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = file;
                document.head.appendChild(link);
            });
            break;
        }
    }
}

// ===========================
// 🌿 Load Seasonal Services
// ===========================
async function loadSeasonServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;

    const data = await loadJSON("json/seasonal-services.json");
    if (!data) return;

    const todayNum = (new Date().getMonth() + 1) * 100 + new Date().getDate();
    let services = [];

    for (const season of data.seasons) {
        const startNum = mmddToNumber(season.start);
        const endNum = mmddToNumber(season.end);

        if (isInSeason(todayNum, startNum, endNum)) {
            services = season.services || [];
            break;
        }
    }

    grid.innerHTML = services
        .map(s => `<div class="service"><h3>${s.title}</h3><p>${s.desc}</p></div>`)
        .join("");
}

// ===========================
// 🌸 Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    loadSeasonCSS();
    loadSeasonServices();
});
