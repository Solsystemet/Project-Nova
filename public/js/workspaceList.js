document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.querySelectorAll(".open-create-workspace");
  const closeBtn = document.querySelector(".close-create-workspace");
  const form = document.querySelector(".create-pop-up");
  const backdrop = document.querySelector(".backdrop");

  openBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      form.classList.add("active");
      backdrop.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", () => {
    form.classList.remove("active");
    backdrop.classList.remove("active");
  });
});
