const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

closeModalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    closeModal(modal);
  });
});
function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("active");
  overlay.classList.remove("active");
  description.textContent = "";
}
function openModal(modal, title, value) {
  if (!modal) return;

  title.textContent = value;
  modal.classList.add("active");
  overlay.classList.add("active");
}
