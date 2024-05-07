document.addEventListener("DOMContentLoaded", function () {
  const starContainer = document.querySelector(".star-container");
  const parent = document.querySelector(".toppage");
  var parentPositionInfo = parent.getBoundingClientRect();

  generateStars(parentPositionInfo, starContainer, 100);
});

function generateStars(parentInfo, container, numStars) {
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    const randomX = Math.random() * parentInfo.width;
    const randomY = Math.random() * (parentInfo.height - 150);

    star.classList.add("star");
    container.appendChild(star);
    star.style.transform = `rotate(${Math.random() * 360}deg) scale(${
      Math.random() * (1.2 - 0.2) + 0.2
    })`;
    star.style.left = `calc(${randomX}px - 50%)`;
    star.style.top = `calc(${randomY}px - 50%)`;
  }
}
