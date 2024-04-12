document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.getElementById("multipleDropdownButton");
  const options = document.getElementById("multipleOptions");
  const selectedItems = document.querySelector(".selected-items");

  dropdownButton.addEventListener("click", toggleDropdown);
  window.addEventListener("click", closeDropdownOutsideClick);

  function toggleDropdown() {
    options.classList.toggle("active");
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
