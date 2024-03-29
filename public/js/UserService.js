const btnCreateUser = document.querySelector(".btn-create-user");
const Username = document.querySelector(".username");
const Password = document.querySelector(".password");
const Email = document.querySelector(".email");

btnCreateUser.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(
    `register-user/${Username.value}/${Password.value}/${Email.value}`
  ).then((window.location.href = "/workspaces/69420"));
});
