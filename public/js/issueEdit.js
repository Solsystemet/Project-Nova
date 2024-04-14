const modalEdit = document.getElementById("modal-edit");
const modalTitle = document.querySelector(".modal-title-edit");
const btnCloseModal = document.querySelector(".close-button-edit");
const modalEditDescription = document.querySelector(".issue-description-edit");
const modalEditPrio = document.querySelector(".modal-priority-edit");
const selectionEditUserResponsibility = document.querySelector(
  ".modal-lead-responsibility-edit"
);
const dropdownSelection = document.getElementById("options-edit");

function openModalEdit(issue) {
  console.log(issue);
  modalTitle.textContent = issue.title;
  modalEditDescription.value = issue.description;
  console.log(modalEditPrio);
  modalEditPrio.value = issue.priority;
  fetch("/get-users/" + workspaceID)
    .then((res) => res.json())
    .then((data) => CreateUserOptionsEdit(data));
  selectionEditUserResponsibility.value = issue.assignee;
  modalEdit.classList.add("active");
  overlay.classList.add("active");
}

btnCloseModal.addEventListener("click", () => {
  closeModal(modalEdit);
});

function CreateUserOptionsEdit(users) {
  //console.log("users: " + users);
  selectionEditUserResponsibility.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.innerText = user;
    selectionEditUserResponsibility.appendChild(option);
  });
}
