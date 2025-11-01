// seasonal.js

async function loadSeasonCSS() {
    const res = await fetch('json/seasonal-css.json'); // external JSON
    const data = await res.json();
    const today = new Date();

    function parseMD(str) {
        const [m, d] = str.split('-').map(Number);
        return new Date(today.getFullYear(), m - 1, d);
    }

    function inRange(today, start, end) {
        return start <= end ? today >= start && today <= end : today >= start || today <= end;
    }

    for (const season of data.seasons) {
        const start = parseMD(season.start);
        const end = parseMD(season.end);
        if (inRange(today, start, end)) {
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

document.addEventListener('DOMContentLoaded', loadSeasonCSS);
