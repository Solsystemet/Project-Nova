document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  gsap.from(".reveal", {
    opacity: 0, // start from fully transparent
    y: -100, // start from 50px below the original position
    stagger: 0.5, // delay of 0.5 seconds between each element
    scrollTrigger: {
      trigger: ".reveal-wrapper", // use the wrapper as the trigger
      start: "top 25%",
      end: "bottom 75%",
      scrub: 1,
    },
  });

  const scroll = gsap.utils.toArray(".scroll-trigger");
  scroll.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        start: "top bottom", // Changed this line
        trigger: element,
        onEnter: () => {
          element.classList.add("visible");
        },
        onEnterBack: () => {
          element.classList.add("visible");
        },
      },
    });
  });
});
