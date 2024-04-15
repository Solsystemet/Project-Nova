// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the dropdown button, menu, items, and selected item
  var dropdownBtn = document.querySelector(".dropdown-btn");
  var dropdownMenu = document.querySelector(".dropdown-menu");
  var items = document.querySelectorAll(".item");
  var selectedItem = document.querySelector(".selected-item");

  // Add a click event listener to the dropdown button to toggle the menu
  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Add a click event listener to each item to handle item selection
  items.forEach((item) => item.addEventListener("click", itemClickHandler));

  // Add a click event listener to the window to close the menu when clicking outside of it
  window.addEventListener("click", function () {
    closeMenu();
  });

  // Function to toggle the visibility of the menu
  function toggleMenu() {
    dropdownMenu.classList.toggle("open");
  }

  // Function to close the menu
  function closeMenu() {
    dropdownMenu.classList.remove("open");
  }

  // Function to handle item selection
  function itemClickHandler(e) {
    // Set the selected item text to the clicked item text
    selectedItem.innerText = e.target.innerText;
    e.stopPropagation();
    // If the clicked item is already active, remove the active class
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
    } else {
      // Otherwise, remove the active class from all items and add it to the clicked item
      items.forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");
    }
    // Close the menu
    closeMenu();
  }
});

//Thanks to https://www.youtube.com/watch?v=BEwDYtY1L8A
