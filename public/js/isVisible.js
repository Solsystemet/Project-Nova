function isInViewport(element, visibilityThreshold = 1) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  const vertVisible =
    rect.height * visibilityThreshold <= rect.bottom - Math.max(0, rect.top) &&
    rect.height * visibilityThreshold <=
      Math.min(rect.bottom, windowHeight) - rect.top;
  const horVisible =
    rect.width * visibilityThreshold <= rect.right - Math.max(0, rect.left) &&
    rect.width * visibilityThreshold <=
      Math.min(rect.right, windowWidth) - rect.left;

  return vertInView && horInView && vertVisible && horVisible;
}

var scrollTriggers = document.querySelectorAll(".scroll-trigger");

window.addEventListener("scroll", function () {
  scrollTriggers.forEach(function (scrollTrigger) {
    if (isInViewport(scrollTrigger, 0.7)) {
      scrollTrigger.classList.add("visible");
    } else {
      console.log("Element is not visible");
    }
  });
});
