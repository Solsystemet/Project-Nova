const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const btnCreateIssue = document.getElementById("btn-issue-create");
const description = document.querySelector(".issue-description");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const modal = document.getElementById("modal");
  const value = input.value;
  if (!value) return;

  openModal(modal, value); // popup for create issue

  //
});

btnCreateIssue.addEventListener("click", (e) => {
  const value = input.value;
  socket.emit("new task", value, description.textContent);
});

socket.on("new task", (value, id) => {
  const newTask = document.createElement("p");
  newTask.id = id;
  newTask.classList.add("task");
  newTask.setAttribute("draggable", true);
  newTask.innerText = value;

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

socket.on("create board", (title, id) => {
  const newTask = document.createElement("p");
  newTask.id = id;
  newTask.classList.add("task");
  newTask.setAttribute("draggable", true);
  newTask.innerText = title;

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  todoLane.appendChild(newTask);
  UpdateDragAndDrop();
});
