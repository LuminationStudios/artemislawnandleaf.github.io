async function loadBanner() {
  try {
    const res = await fetch('banner.json');
    if (!res.ok) throw new Error('Failed to load banner.json');
    const data = await res.json();
    const bannerData = data.banner;

    const banner = document.createElement('div');
    banner.className = 'banner';
    banner.style.background = bannerData.background;
    banner.innerHTML = `<a href="${bannerData.link}" style="color:white;text-decoration:none;">${bannerData.text}</a>`;

    document.body.insertBefore(banner, document.querySelector('main'));
  } catch (err) {
    console.error('Error loading banner:', err);
  }
}
document.addEventListener('DOMContentLoaded', loadBanner);
