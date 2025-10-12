async function loadGallery(type) {
  const res = await fetch('gallery.json');
  const data = await res.json();

  const gallery = data[type];
  if (!gallery) return;

  document.getElementById('galleryTitle').textContent = gallery.title;
  const grid = document.getElementById('galleryImages');
  grid.innerHTML = '';

  gallery.images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = gallery.title;
    grid.appendChild(img);
  });

  document.getElementById('galleryModal').style.display = 'flex';
}

document.querySelectorAll('.view-gallery').forEach(btn => {
  btn.addEventListener('click', () => loadGallery(btn.dataset.gallery));
});

document.querySelector('.gallery-close').addEventListener('click', () => {
  document.getElementById('galleryModal').style.display = 'none';
});

window.addEventListener('click', e => {
  const modal = document.getElementById('galleryModal');
  if (e.target === modal) modal.style.display = 'none';
});
