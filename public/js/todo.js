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

// Event listener for form submission (adding a new task)
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  const modal = document.getElementById("modal"); // Get reference to a modal element
  const value = input.value; // Get the value of the input field
  if (!value) return; // If input value is empty, do nothing

  // Fetch users and open modal
  fetch("/get-users/" + workspaceID)
    .then((res) => res.json())
    .then((data) => {
      CreateUserOptions(data);
      openModal(modal, value); // popup for create issue
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
});

// Event listener for creating a new task when a button is clicked
btnCreateIssue.addEventListener("click", (e) => {
  const value = input.value;

  const labels = document.querySelectorAll(".option");
  let checkedlabels = [];

  labels.forEach((label) => {
    if (label.checked == true) checkedlabels.push(label.value);
  });

  socket.emit(
    "new task",
    value,
    description.value,
    priority.value,
    checkedlabels,
    selectionUserResponsibility.value,
    todoLane.id,
    workspaceID
  );
});

// Socket event listener for new tasks
socket.on("new task", (title, id, createDate) => {
  const newTaskElement = createTaskElement(title, id, createDate);
  todoLane.appendChild(newTaskElement); // Append the new task element to the task lane/container
  UpdateDragAndDrop(); // Update drag and drop functionality for all tasks
  const modal = document.getElementById("modal");
  closeModal(modal); // Close modal after task creation
  description.value = ""; // Reset task description input field
});

// Socket event listener for creating a new board (task lane)
socket.on("create board", (title, id, createDate) => {
  const newTaskLaneElement = createTaskElement(title, id, createDate);
  todoLane.appendChild(newTaskLaneElement); // Append the new task lane element to the task lane/container
  UpdateDragAndDrop(); // Update drag and drop functionality for all tasks
});

function createTaskElement(title, id, createDate) {
  // Create a new task or task lane element with provided data
  const newTask = document.createElement("div");
  newTask.id = id; // Set task or task lane ID
  newTask.classList.add("card"); // Add CSS class for styling
  newTask.setAttribute("draggable", true); // Allow task or task lane to be draggable

  // Create task title element and set its content
  const taskTitle = document.createElement("p");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = title; // Task description/title
  newTask.appendChild(taskTitle); // Append task title to task or task lane element

  // Create task creation date element and set its content
  const createdDate = document.createElement("p");
  createdDate.classList.add("issue-date");
  createdDate.textContent = createDate; // Task creation date
  newTask.appendChild(createdDate); // Append creation date to task or task lane element

  // Assignee
  const createdAssignee = document.createElement("img");
  createdAssignee.classList.add("issue-assignee");
  createdAssignee.src = "../img/User/emptyPicture.png"; // Placeholder image
  newTask.appendChild(createdAssignee);

  // Issue footer
  const issueFooter = document.createElement("div");
  issueFooter.classList.add("issue-footer");
  newTask.appendChild(issueFooter);

  // Priority
  const priorityDiv = document.createElement("div");
  priorityDiv.classList.add("priority");
  issueFooter.appendChild(priorityDiv);

  //Priority icon
  const priorityIcon = document.createElement("img");
  priorityIcon.src = "../img/icons/priority.svg"; // Default priority icon
  priorityDiv.appendChild(priorityIcon);

  // Priority text
  const priorityText = document.createElement("p");
  priorityText.textContent = "High"; // Default priority
  priorityDiv.appendChild(priorityText);

  // Due date
  const dueDateDiv = document.createElement("div");
  dueDateDiv.classList.add("due-date");
  issueFooter.appendChild(dueDateDiv);

  // Due date icon
  const dueDateIcon = document.createElement("img");
  dueDateIcon.src = "../img/icons/due-date-icon.svg"; // Default due date icon
  dueDateDiv.appendChild(dueDateIcon);

  // Due date text
  const dueDateText = document.createElement("p");
  dueDateText.textContent = "03/04/2024"; // Default due date
  dueDateDiv.appendChild(dueDateText);

  // Tag
  const createdTag = document.createElement("p");
  createdTag.classList.add("issue-tag");
  createdTag.textContent = "Bug"; // Default tag
  issueFooter.appendChild(createdTag);

  // Add drag and drop event listeners to the new task or task lane element
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  return newTask; // Return the created task or task lane element
}

function CreateUserOptions(users) {
  selectionUserResponsibility.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.innerText = user;
    selectionUserResponsibility.appendChild(option);
  });
}
