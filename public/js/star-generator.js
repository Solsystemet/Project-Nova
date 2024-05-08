document.addEventListener("DOMContentLoaded", function () {
  // Initializing varibles
  const starContainer = document.querySelector(".star-container");
  const parent = document.querySelector(".toppage");
  var parentPositionInfo = parent.getBoundingClientRect();

  // Running function
  generateStars(parentPositionInfo, starContainer, 100);
});

function generateStars(parentInfo, container, numStars) {
  // calculating vw & vh
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  // Spawning stars randomly
  for (let i = 0; i < numStars; i++) {
    // Creating stars div pr star
    const star = document.createElement("div");

    // calculating random x & y
    const randomX = ((Math.random() * parentInfo.width) / vw) * 100;
    const randomY = ((Math.random() * (parentInfo.height - 150)) / vh) * 100;

    // Adding class to star
    star.classList.add("star");

    // Making it child of container
    container.appendChild(star);

    // Calculating rotation & scale
    star.style.transform = `rotate(${Math.random() * 360}deg) scale(${
      Math.random() * (1.2 - 0.3) + 0.3
    })`;

    // Calulating position with top and left offset
    star.style.left = `calc(${randomX}vw - 50%)`;
    star.style.top = `calc(${randomY}vh - 50%)`;
  }
}
