async function loadGallery(type) {
  try {
    const res = await fetch('json/gallery.json');
    if (!res.ok) throw new Error(`Failed to load gallery.json: ${res.status}`);
    const data = await res.json();

    const gallery = data[type];
    if (!gallery) return;

    const titleEl = document.getElementById('galleryTitle');
    const grid = document.getElementById('galleryImages');
    const modal = document.getElementById('galleryModal');

    titleEl.textContent = gallery.title || "Gallery";
    grid.innerHTML = ''; // clear previous

    // 🌸 Render Images
    if (gallery.images && gallery.images.length > 0) {
      gallery.images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = gallery.title;
        img.loading = "lazy";
        grid.appendChild(img);
      });
    }

    // 🌿 Render Text Items
    if (gallery.items && gallery.items.length > 0) {
      gallery.items.forEach(text => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        div.textContent = text;
        grid.appendChild(div);
      });
    }

    modal.style.display = 'flex';

  } catch (err) {
    console.error("Error loading gallery:", err);
  }
}

// 🌟 Button triggers
document.querySelectorAll('.view-gallery').forEach(btn => {
  btn.addEventListener('click', () => loadGallery(btn.dataset.gallery));
});

// ❌ Close button
document.querySelector('.gallery-close').addEventListener('click', () => {
  document.getElementById('galleryModal').style.display = 'none';
});

// 💨 Click outside to close
window.addEventListener('click', e => {
  const modal = document.getElementById('galleryModal');
  if (e.target === modal) modal.style.display = 'none';
});
