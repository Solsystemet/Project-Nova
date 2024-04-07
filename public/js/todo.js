// Get references to necessary elements in the HTML DOM
const form = document.getElementById("todo-form"); // Form for adding tasks
const input = document.getElementById("todo-input"); // Input field for task description
const todoLane = document.getElementById("todo-lane"); // Container for tasks on the board
const btnCreateIssue = document.getElementById("btn-issue-create"); // Button for creating a new task
const description = document.querySelector(".issue-description"); // Description of the task

// Event listener for form submission (adding a new task)
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  const modal = document.getElementById("modal"); // Get reference to a modal element
  const value = input.value; // Get the value of the input field
  if (!value) return; // If input value is empty, do nothing

  openModal(modal, value); // Call a function to open a modal for creating the task
  // Additional actions can be added here if needed
});

// Event listener for creating a new task when a button is clicked
btnCreateIssue.addEventListener("click", (e) => {
  const value = input.value; // Get the value of the input field
  // Emit a socket event to create a new task with the task description and additional description
  socket.emit("new task", value, description.textContent);
});

// Function to create a new task or task lane element

// Socket event listener for new tasks
socket.on("new task", (title, id, createDate) => {
  const newTaskElement = createTaskElement(title, id, createDate);
  todoLane.appendChild(newTaskElement); // Append the new task element to the task lane/container
  UpdateDragAndDrop(); // Update drag and drop functionality for all tasks
  const modal = document.getElementById("modal");
  closeModal(modal); // Close modal after task creation
  description.textContent = ""; // Reset task description input field
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
  const priority = document.createElement("div");
  priority.classList.add("priority");
  issueFooter.appendChild(priority);

  //Priority icon
  const priorityIcon = document.createElement("img");
  priorityIcon.classList.add("priority-icon");
  priorityIcon.src = "../img/(NameofIcon)"; // Default priority icon
  priority.appendChild(priorityIcon);

  // Priority text
  const priorityText = document.createElement("p");
  priorityText.classList.add("priority-text");
  priorityText.textContent = "High"; // Default priority
  priority.appendChild(priorityText);

  // Due date
  const dueDate = document.createElement("div");
  dueDate.classList.add("due-date");
  issueFooter.appendChild(dueDate);

  // Due date icon
  const dueDateIcon = document.createElement("img");
  dueDateIcon.classList.add("due-date-icon");
  dueDateIcon.src = "../img/(NameofIcon)"; // Default due date icon
  dueDate.appendChild(dueDateIcon);

  // Due date text
  const dueDateText = document.createElement("p");
  dueDateText.classList.add("due-date-text");
  dueDateText.textContent = "03/04/2024"; // Default due date
  dueDate.appendChild(dueDateText);

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
//Thx Chatgpt for comment
