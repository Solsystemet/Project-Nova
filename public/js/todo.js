const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;
  if (!value) return;
  socket.emit("new task", value);
});

socket.on("new task", (value, uuid) => {
  const newTask = document.createElement("p");
  newTask.id = uuid;
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
