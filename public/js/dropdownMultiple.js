document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.querySelectorAll(".dropdown-button");
  const options = document.querySelectorAll(".dropdown-content");
  const selectedItems = document.querySelector(".selected-items");

  dropdownButton.forEach((btn) => {
    btn.addEventListener("click", toggleDropdown);
  });

  window.addEventListener("click", closeDropdownOutsideClick);

  function toggleDropdown() {
    options.forEach((option) => {
      option.classList.toggle("active");
    });
  }

  function closeDropdownOutsideClick(event) {
    if (event.target.matches("#overlay")) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("active")) {
          openDropdown.classList.remove("active");
        }
      }
    }
  }
});
