// ===============================
// Load Websites Projects
// ===============================
fetch("./websites.json")
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector("#websites-grid");
    if (container) {
      data.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-card", "glow-box");
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank" class="btn">View Project</a>
        `;
        container.appendChild(card);
      });
    }
  })
  .catch(err => console.error("Error loading websites.json:", err));

// ===============================
// Load Roblox Projects
// ===============================
fetch("./roblox.json")
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector("#roblox-grid");
    if (container) {
      data.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-card", "glow-box");
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank" class="btn">View Project</a>
        `;
        container.appendChild(card);
      });
    }
  })
  .catch(err => console.error("Error loading roblox.json:", err));


// ===============================
// Load Footer
// ===============================
fetch("./footer.json")
  .then(response => response.json())
  .then(data => {
    const footer = document.querySelector(".site-footer");
    if (footer) {
      let html = `<p>${data.text}</p>`;

      if (data.links && data.links.length > 0) {
        html += `<div class="footer-links">`;
        data.links.forEach(link => {
          html += `<a href="${link.url}" target="_blank">${link.name}</a>`;
        });
        html += `</div>`;
      }

      footer.innerHTML = html;
    }
  })
  .catch(err => console.error("Error loading footer.json:", err));

// ===============================
// Add Sparkles to Glow Boxes
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const glowBoxes = document.querySelectorAll(".glow-box");

  glowBoxes.forEach(box => {
    const sparkleContainer = document.createElement("div");
    sparkleContainer.classList.add("sparkle-container");
    box.appendChild(sparkleContainer);

    const colors = ["pink", "blue"];
    const sparkles = 20;

    for (let i = 0; i < sparkles; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle", colors[Math.floor(Math.random() * colors.length)]);

      const side = Math.floor(Math.random() * 4);
      let pos = Math.random() * 100;

      if (side === 0) { // top
        sparkle.style.top = "0%";
        sparkle.style.left = `${pos}%`;
      } else if (side === 1) { // right
        sparkle.style.top = `${pos}%`;
        sparkle.style.right = "0%";
      } else if (side === 2) { // bottom
        sparkle.style.bottom = "0%";
        sparkle.style.left = `${pos}%`;
      } else { // left
        sparkle.style.top = `${pos}%`;
        sparkle.style.left = "0%";
      }

      sparkle.style.animationDelay = `${Math.random() * 3}s`;
      sparkle.style.animationDuration = `${4 + Math.random() * 3}s`;

      sparkleContainer.appendChild(sparkle);
    }
  });
});
