const modalEdit = document.getElementById("modal-edit");
const modalTitle = document.querySelector(".modal-title-edit");
const btnCloseModal = document.querySelector(".close-button-edit");
const modalEditDescription = document.querySelector(".issue-description-edit");
const modalEditLabels = document.querySelectorAll("#options-edit > input ");
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
  console.log(checkedlabels);
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

  CreateUserOptionsEdit();
  selectionEditUserResponsibility.value = issue.assignee;
  modalEdit.classList.add("active");
  overlay.classList.add("active");
}

btnCloseModal.addEventListener("click", () => {
  closeModal(modalEdit);
});

function CreateUserOptionsEdit() {
  //console.log("users: " + users);
  selectionEditUserResponsibility.innerHTML = "";
  memberMap.forEach((member) => {
    const option = document.createElement("option");
    option.value = member._id;
    option.innerText = member.username;
    selectionEditUserResponsibility.appendChild(option);
  });
}

socket.on(
  "modify issue",
  (id, title, description, priority, labels, assignee) => {
    const issue = issueMap.get(id);

    const el = document.getElementById(id);

    const arr = el.innerHTML.split('<p class="create-date" id="nopointer">');
    el.innerHTML = title + '<p class="create-date" id="nopointer">' + arr[1];
    issue.title = title;
    issue.description = description;
    issue.priority = priority;
    issue.labels = labels;
    issue.assignee = assignee;
  }
);
