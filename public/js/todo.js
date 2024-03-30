const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

// Modal
const description = document.querySelector(".issue-description");
const priority = document.querySelector(".modal-priority");
const label = document.querySelector(".modal-label");
const btnCreateIssue = document.getElementById("btn-issue-create");
const selectionUserResponsibility = document.querySelector(
  ".modal-lead-responsibility"
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const modal = document.getElementById("modal");
  const value = input.value;
  if (!value) return;

  // we get the users
  fetch("/get-users")
    .then((res) => res.json())
    .then((data) => CreateUserOptions(data));
  openModal(modal, value); // popup for create issue

  //
});

btnCreateIssue.addEventListener("click", (e) => {
  const value = input.value;
  socket.emit(
    "new task",
    value,
    description.value,
    priority.value,
    label.value,
    selectionUserResponsibility.value
  );
});

socket.on("new task", (value, id, createDate) => {
  const newTask = document.createElement("p");
  newTask.id = id;
  newTask.classList.add("task");
  newTask.setAttribute("draggable", true);
  newTask.innerText = value;

  const createdDate = document.createElement("p");
  createdDate.classList.add("create-date");
  createdDate.textContent = createDate;
  newTask.appendChild(createdDate);

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  todoLane.appendChild(newTask);
  UpdateDragAndDrop();
  const modal = document.getElementById("modal");
  closeModal(modal);
  description.textContent = "";
});

socket.on("create board", (title, id, createDate) => {
  const newTask = document.createElement("p");
  newTask.id = id;
  newTask.classList.add("task");
  newTask.setAttribute("draggable", true);
  newTask.innerText = title;

  const createdDate = document.createElement("p");
  createdDate.classList.add("create-date");
  createdDate.textContent = createDate;
  newTask.appendChild(createdDate);

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  todoLane.appendChild(newTask);
  UpdateDragAndDrop();
});

function CreateUserOptions(users) {
  //console.log("users: " + users);
  selectionUserResponsibility.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.innerText = user;
    selectionUserResponsibility.appendChild(option);
  });
}
