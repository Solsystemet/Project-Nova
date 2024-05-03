document.addEventListener("DOMContentLoaded", function () {
  const starContainer = document.querySelector(".star-container");
  const parent = document.querySelector(".toppage");
  var parentPositionInfo = parent.getBoundingClientRect();

  generateStars(parentPositionInfo, starContainer, 200);
  function generateStars(parentInfo, container, numStars) {
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.transform = `rotate(${Math.random() * 360}deg) scale(${
        Math.random() * (1 - 0.2) + 0.2
      }) translate(${Math.random() * parentInfo.height}px, ${
        Math.random() * 100
      }vw   )`;

      container.appendChild(star);
    }
  }
});
