async function loadNav() {
  const res = await fetch('nav.json');
  const data = await res.json();

  const nav = document.getElementById('navbar');
  nav.innerHTML = data.nav.map(item => 
    `<a href="${item.href}" class="btn ${window.location.pathname.endsWith(item.href) ? 'active' : ''}">${item.label}</a>`
  ).join('');

  const footer = document.getElementById('footer');
  footer.innerHTML = `<div>${data.footer.text}</div>`;
}
loadNav();
