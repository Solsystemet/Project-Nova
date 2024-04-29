// Assuming you have a form with an input field for the file and an image element for displaying the cropped image
const form = document.querySelector("#register-form");
const fileInput = document.querySelector("#profile-picture-input");
const imageElement = document.querySelector("#cropped-profile-picture");

// Event listener for file input change
fileInput.addEventListener("change", (event) => {
  const cropperImageMaskElement =
    document.querySelector(".cropper-view-box").children[0];
  const cropperImageElement =
    document.querySelector(".cropper-canvas").children[0];
  console.log(cropperImageElement);
  console.log(event);
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    // Set the source of the cropper to the selected image
    console.log(e.target.result);
    imageElement.src = e.target.result;
    cropperImageElement.src = e.target.result;
    cropperImageMaskElement.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// Event listener for the register button
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  // Get the cropped image data
  const cropperImageData = cropper.getData();
  console.log(cropperImageData);

  let formData = new FormData(form);

  formData.append("cropperImageData", JSON.stringify(cropperImageData));

  form.formData = formData;
  // Submit the form
  form.submit();
});
