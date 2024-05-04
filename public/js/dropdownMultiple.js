// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the dropdown buttons and menus
  var dropdownBtns = document.querySelectorAll(".dropdown-btn");
  var dropdownMenus = document.querySelectorAll(".dropdown-menu");
  var multipleBtns = document.querySelectorAll(".multiple-choice-btn");
  var multipleMenus = document.querySelectorAll(".multiple-choice-menu");

  // Loop through each dropdown button
  dropdownBtns.forEach((dropdownBtn, index) => {
    // Get the items and selected item for this dropdown only
    var items = dropdownBtn.nextElementSibling.querySelectorAll(".item");
    var selectedItem = dropdownBtn.querySelector(".selected-item");

    // Add a click event listener to the dropdown button to toggle the menu
    dropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(index);
      multipleMenus.forEach((multipleMenu) => {
        multipleMenu.classList.remove("open");
      });
    });

    // Add a click event listener to each item to handle item selection
    items.forEach((item) =>
      item.addEventListener("click", (e) => itemClickHandler(e, index))
    );

    // Function to toggle the visibility of the menu
    function toggleMenu(index) {
      for (let i = 0; i < dropdownMenus.length; i++) {
        if (i !== index) {
          dropdownMenus[i].classList.remove("open");
        }
      }

      dropdownMenus[index].classList.toggle("open");
    }

    // Function to handle item selection
    function itemClickHandler(e, index) {
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
      dropdownMenus[index].classList.remove("open");
    }
  });

  // Add a click event listener to the window to close the menu when clicking outside of it
  window.addEventListener("click", function () {
    dropdownMenus.forEach((dropdownMenu) => {
      dropdownMenu.classList.remove("open");
    });
    multipleMenus.forEach((multipleMenu) => {
      multipleMenu.classList.remove("open");
    });
  });

  multipleBtns.forEach((multipleBtn, index) => {
    var options = multipleBtn.nextElementSibling.querySelectorAll(".option");

    // Add a click event listener to the dropdown button to toggle the menu
    multipleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMultiple(index);
      dropdownMenus.forEach((dropdownMenu) => {
        dropdownMenu.classList.remove("open");
      });
    });

    // Add a click event listener to each option to handle option selection
    options.forEach((option) =>
      option.addEventListener(
        "click",
        (e) => optionClickHandler(e, index) // Pass the index instead of options
      )
    );

    // Function to toggle the visibility of the menu
    function toggleMultiple(index) {
      multipleMenus[index].classList.toggle("open");
    }
    // Function to handle option selection
    // Function to handle option selection
    function optionClickHandler(e, index) {
      e.stopPropagation();
      const options = multipleMenus[index].querySelectorAll(".option"); // Retrieve options based on index
      let activeOptions = [];

      // Toggle the active class for the clicked option
      e.target.classList.toggle("active");

      // Check all options for active class and add to activeOptions array
      options.forEach((option) => {
        let checkbox = option.querySelector("input[type='checkbox']"); // Get the checkbox inside the option
        let label = option.querySelector("label"); // Get the label inside the option
        if (checkbox.checked) {
          activeOptions.push(label.innerText); // Save the label text if the checkbox is checked
        }
      });
    }
  });
});
