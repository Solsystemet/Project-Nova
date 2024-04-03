document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.getElementById("dropdownButton");
  const options = document.getElementById("options");
  const selectedItems = document.querySelector(".selected-items");

  dropdownButton.addEventListener("click", toggleDropdown);
  window.addEventListener("click", closeDropdownOutsideClick);

  function toggleDropdown() {
    options.classList.toggle("show");
  }

  function closeDropdownOutsideClick(event) {
    if (!event.target.matches("#dropdownButton")) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  }
});
