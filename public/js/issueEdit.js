const modalEdit = document.getElementById("modal-edit");
const modalTitle = document.querySelector(".modal-title-edit");
const btnCloseModal = document.querySelector(".close-button-edit");
const modalEditDescription = document.querySelector(".issue-description-edit");
const modalEditLabels = document.querySelectorAll("#options > input ");
const modalEditPrio = document.querySelector(".modal-priority-edit");
const selectionEditUserResponsibility = document.querySelector(
  ".modal-lead-responsibility-edit"
);

let curIssue = null;

const btnConfirm = document.getElementById("btn-issue-confirm-edit");
console.log(btnConfirm);
btnConfirm.addEventListener("click", function () {
  let checkedlabels = [];
  modalEditLabels.forEach((label) => {
    if (label.checked == true) checkedlabels.push(label.value);
  });

  socket.emit(
    "modify issue",
    curIssue.id,
    modalTitle.textContent,
    modalEditDescription.value,
    modalEditPrio.value,
    checkedlabels,
    selectionEditUserResponsibility.value,
    workspaceID
  );

  curIssue.labels.forEach((label) =>
    modalEditLabels.forEach((checkbox) => {
      if (label == checkbox.value) checkbox.checked = false;
    })
  );

  closeModal(modalEdit);
});

function openModalEdit(issue) {
  curIssue = issue;
  console.log(issue);
  modalTitle.textContent = issue.title;
  modalEditDescription.value = issue.description;
  console.log(modalEditPrio);
  modalEditPrio.value = issue.priority;

  issue.labels.forEach((label) =>
    modalEditLabels.forEach((checkbox) => {
      if (label == checkbox.value) checkbox.checked = true;
    })
  );

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
