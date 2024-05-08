document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // Adding scroll reveal to elements
  gsap.from(".reveal", {
    opacity: 0,
    y: -100,
    stagger: 0.5,
    scrollTrigger: {
      trigger: ".reveal-wrapper",
      start: "top 25%",
      end: "bottom 75%",
      scrub: 1,
    },
  });

  // Adding scroll trigger to elements
  const scroll = gsap.utils.toArray(".scroll-trigger");
  scroll.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        start: "top bottom-=20%",
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
