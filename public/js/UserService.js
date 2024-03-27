const btnCreateUser = document.querySelector(".btn-create-user");

const txtUserName = document.querySelector(".username");
const txtPassword = document.querySelector(".password");
const txtEmail = document.querySelector(".email");

btnCreateUser.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit(
    "new user",
    txtUserName.textContent,
    txtPassword.textContent,
    txtEmail.textContent
  );
});
