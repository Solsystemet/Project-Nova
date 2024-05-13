document.addEventListener("DOMContentLoaded", () => {
  const openBtns = document.querySelectorAll(".open-create-workspace");
  const closeBtns = document.querySelectorAll(".close-create-workspace");
  const createPopUp = document.querySelector(".create-pop-up");
  const backdrop = document.querySelector(".backdrop");

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      createPopUp.classList.add("active");
      backdrop.style.display = "block";
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      createPopUp.classList.remove("active");
      backdrop.style.display = "none";
    });
  });
});
