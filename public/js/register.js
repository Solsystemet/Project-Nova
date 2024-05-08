// Assuming you have a form with an input field for the file and an image element for displaying the cropped image
const form = document.querySelector("#register-form");
const fileInput = document.querySelector("#profile-picture-input");
const imageElement = document.querySelector("#cropped-profile-picture");

// Event listener for file input change
fileInput.addEventListener("change", (event) => {
  console.log(event);
  const file = event.target.files[0];
  console.log(file);
  const reader = new FileReader();

  reader.onload = (e) => {
    // Set the source of the cropper to the selected image
    console.log(e.target.result);
    cropper.replace(e.target.result);
  };

  reader.readAsDataURL(file);
});

// Event listener for the register button
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  // Get the cropped image data
  const cropperImageData = cropper.getData(true);
  console.log(cropperImageData);

  let formData = new FormData(form);
  formData.append("cropperImageData", JSON.stringify(cropperImageData));

  // Add the form data to the request body
  fetch("/register", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch(function (err) {
      console.info(err + " url: " + url);
    });
});
