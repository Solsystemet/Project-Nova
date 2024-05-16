const modalEdit = document.getElementById("modal-edit");
const modalTitle = document.querySelector(".modal-title-edit");
const btnCloseModal = document.querySelector(".close-button-edit");
const modalEditDescription = document.querySelector(".issue-description-edit");
const modalEditLabels = document.querySelectorAll(".option-edit");
const modalEditPrio = document.getElementById("selected-priority-edit");
const selectionEditUserResponsibility = document.querySelector(
  ".select-user-on-issue-edit-dropdown"
);
const selectedUserResponsibilityEdit = document.getElementById(
  "selected-responsibility-edit"
);
let leadResponsibilityEdit = null;
let curIssue = null;
let selectedLabelsEdit = [];
const btnConfirm = document.getElementById("btn-issue-confirm-edit");
console.log(modalEditLabels);
modalEditLabels.forEach((label) => {
  label.addEventListener("click", () => {
    const labelSelect = label.querySelector("label");
    if (selectedLabelsEdit.includes(labelSelect.textContent)) {
      const index = selectedLabelsEdit.indexOf(labelSelect.textContent);
      selectedLabelsEdit.splice(index, 1);
    } else selectedLabelsEdit.push(labelSelect.textContent);
    console.log(selectedLabelsEdit);
  });
});

btnConfirm.addEventListener("click", function () {
  console.log(modalEditPrio);

  socket.emit(
    "modify issue",
    curIssue.id,
    modalTitle.textContent,
    modalEditDescription.value,
    modalEditPrio.textContent,
    selectedLabelsEdit,
    leadResponsibilityEdit,
    workspaceID
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

function CreateUserOptionsEdit(users) {
  selectionEditUserResponsibility.innerHTML = "";
  memberMap.forEach((member) => {
    const option = document.createElement("div");
    option.classList.add("item");
    option.textContent = member.username;
    option.id = member._id;
    option.addEventListener("click", () => {
      leadResponsibilityEdit = option.id;
      selectedUserResponsibilityEdit.textContent = option.textContent;
    });
    selectionEditUserResponsibility.appendChild(option);
  });
}

socket.on(
  "modify issue",
  (id, title, description, priority, labels, assigneeID) => {
    issueMap.delete(id);
    const el = document.getElementById(id);
    const lane = el.parentElement;
    el.remove();
    const assignee = memberMap.get(assigneeID);
    const newTaskElement = createTaskElement(
      title,
      id,
      "08/05/2024",
      priority,
      labels,
      assignee
    );
    lane.appendChild(newTaskElement);
  }
);
