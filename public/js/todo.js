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

// Socket event listener for receiving a new task created by another user
socket.on("new task", (title, id, createDate) => {
  // Create a new task element with provided data
  const newTask = document.createElement("p");
  newTask.id = id; // Set task ID
  newTask.classList.add("card"); // Add CSS class for styling
  newTask.setAttribute("draggable", true); // Allow task to be draggable

  // Create task title element and set its content
  const taskTitle = document.createElement("p");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = title; // Task description/title
  newTask.appendChild(taskTitle); // Append task title to task element

  // Create task creation date element and set its content
  const createdDate = document.createElement("p");
  createdDate.classList.add("create-date");
  createdDate.textContent = createDate; // Task creation date
  newTask.appendChild(createdDate); // Append creation date to task element

  //priority
  const createdPriority = document.createElement("p");
  createdPriority.classList.add("create-priority");

  //! Add connection to database & creation of the task
  //? This is a test solution
  createdPriority.textContent = "High";
  newTask.appendChild(createdPriority);

  //Due date
  const createdDue = document.createElement("p");
  createdDue.classList.add("create-due");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdDue.textContent = "03/04/2024";
  newTask.appendChild(createdDue);

  //Assignee
  const createdAssignee = document.createElement("p");
  createdAssignee.classList.add("create-assignee");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdAssignee.textContent = "John Doe";
  newTask.appendChild(createdAssignee);

  //Tag
  const createdTag = document.createElement("p");
  createdTag.classList.add("create-tag");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdTag.textContent = "Bug";
  newTask.appendChild(createdTag);

  // Add drag and drop event listeners to the new task element
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  // Append the new task element to the task lane/container
  todoLane.appendChild(newTask);

  // Update drag and drop functionality for all tasks
  UpdateDragAndDrop();

  // Close modal after task creation
  const modal = document.getElementById("modal");
  closeModal(modal);

  // Reset task description input field
  description.textContent = "";
});

// Socket event listener for creating a new board (task lane)
socket.on("create board", (title, id, createDate) => {
  // Create a new task lane element with provided data (similar to creating a new task)
  const newTask = document.createElement("p");
  newTask.id = id;
  newTask.classList.add("card");
  newTask.setAttribute("draggable", true);

  // Create task lane title element and set its content
  const taskTitle = document.createElement("p");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = title; // Task lane title
  newTask.appendChild(taskTitle);

  // Create task lane creation date element and set its content
  const createdDate = document.createElement("p");
  createdDate.classList.add("create-date");
  createdDate.textContent = createDate; // Task lane creation date
  newTask.appendChild(createdDate);

  const createdPriority = document.createElement("p");
  createdPriority.classList.add("create-priority");

  //! Add connection to database & creation of the task
  //? This is a test solution
  createdPriority.textContent = "High";
  newTask.appendChild(createdPriority);

  //Due date
  const createdDue = document.createElement("p");
  createdDue.classList.add("create-due");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdDue.textContent = "03/04/2024";
  newTask.appendChild(createdDue);

  //Assignee
  const createdAssignee = document.createElement("p");
  createdAssignee.classList.add("create-assignee");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdAssignee.textContent = "John Doe";
  newTask.appendChild(createdAssignee);

  //Tag
  const createdTag = document.createElement("p");
  createdTag.classList.add("create-tag");
  //! Add connection to database & creation of the task
  //? This is a test solution
  createdTag.textContent = "Bug";
  newTask.appendChild(createdTag);

  // Add drag and drop event listeners to the new task lane element
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  // Append the new task lane element to the task lane/container
  todoLane.appendChild(newTask);

  // Update drag and drop functionality for all tasks
  UpdateDragAndDrop();
});

//Thx Chatgpt for comment
