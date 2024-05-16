const cropImage = document.querySelector(".circle-crop");

// Options: https://github.com/fengyuanchen/cropperjs/blob/main/README.md#options
const cropper = new Cropper(cropImage, {
  viewMode: 3,
  aspectRatio: 1,
  guides: false,
  center: true, //Satte dette til true
  dragMode: "move",
  background: false,
  cropBoxMovable: false,
  cropBoxResizable: false,
  responsive: true,
  restore: true,
  autoCropArea: 0.9,
});
