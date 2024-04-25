// import Cropper from "cropperjs";
const cropImage = document.querySelector(".circle-crop");

// Options: https://github.com/fengyuanchen/cropperjs/blob/main/README.md#options
new Cropper(cropImage, {
  aspectRatio: 1,
  guides: false,
  center: false,
  dragMode: "move",
  background: false,
  cropBoxMovable: false,
  cropBoxResizable: false,
});
