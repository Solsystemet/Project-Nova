document.addEventListener("DOMContentLoaded", function () {
  const starContainer = document.querySelector(".star-container");
  const parent = document.querySelector(".toppage");
  var parentPositionInfo = parent.getBoundingClientRect();

  generateStars(parentPositionInfo, starContainer, 100);
});

function generateStars(parentInfo, container, numStars) {
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    const randomX = ((Math.random() * parentInfo.width) / vw) * 100;
    const randomY = ((Math.random() * (parentInfo.height - 150)) / vh) * 100;

    star.classList.add("star");
    container.appendChild(star);
    star.style.transform = `rotate(${Math.random() * 360}deg) scale(${
      Math.random() * (1.2 - 0.3) + 0.3
    })`;
    star.style.left = `calc(${randomX}vw - 50%)`;
    star.style.top = `calc(${randomY}vh - 50%)`;
  }
}
