const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
//const todoLane = document.getElementById("todo-lane");
let currentLane = null;
let leadResponsibility = null;
let selectedLabels = [];
// Modal
const description = document.getElementById("todo-description");
const priorityElement = document.getElementById("selected-priority");
const selectLabels = document.getElementById("labelMultipleChoice");
const labels = selectLabels.querySelectorAll(".option");
const btnCreateIssue = document.getElementById("btn-issue-create");
const selectionUserResponsibility = document.getElementById("select-user");
const selectedUserResponsibility = document.getElementById(
  "selected-responsibility"
);
const issueMap = new Map();
const memberMap = new Map();

console.log(labels);

labels.forEach((label) => {
  label.addEventListener("click", () => {
    const labelSelect = label.querySelector("label");
    if (selectedLabels.includes(labelSelect.textContent)) {
      const index = selectedLabels.indexOf(labelSelect.textContent);
      selectedLabels.splice(index, 1);
    } else selectedLabels.push(labelSelect.textContent);
    console.log(selectedLabels);
  });
});

const adds = document.querySelectorAll(".add-card");
adds.forEach((add) => {
  add.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title"); // Get reference to a modal element

    currentLane = document.getElementById(add.value);
    // Fetch users and open modal
    fetch("/get-users/" + workspaceID)
      .then((res) => res.json())
      .then((data) => {
        CreateUserOptions(data);
        openModal(modal, modalTitle, ""); // popup for create issue
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  });
});

// Event listener for creating a new task when a button is clicked
btnCreateIssue.addEventListener("click", (e) => {
  const issueTitle = document.querySelector(".modal-title");

  console.log(selectedLabels);

  // This is a safe guard that returns so issue can't be created if these values are the defaults
  // In future make function that makes a popup that tells user to fill out the contents before returning
  if (
    issueTitle.innerText == "" ||
    priorityElement.innerText == "Priority" ||
    leadResponsibility == null
  )
    return;

  socket.emit(
    "new task",
    issueTitle.innerText,
    description.innerText,
    priorityElement.innerText,
    selectedLabels,
    leadResponsibility,
    currentLane.id,
    workspaceID
  );
});

// Socket event listener for new tasks
socket.on(
  "new task",
  (id, title, description, createDate, laneID, labels, assignee, priority) => {
    const issue = new Issue(
      id,
      title,
      description,
      createDate,
      laneID,
      labels,
      assignee,
      priority
    );
    issueMap.set(id, issue);

    const newTaskElement = createTaskElement(
      title,
      id,
      createDate,
      priority,
      labels,
      assignee
    );

    newTaskElement.addEventListener("click", async (e) => {
      console.log(e.target);
      const issue = await issueMap.get(e.target.id);
      openModalEdit(issue);
    });
    const laneParent = document.getElementById(laneID);
    laneParent.appendChild(newTaskElement); // Append the new task element to the task lane/container
    UpdateDragAndDrop(); // Update drag and drop functionality for all tasks
    const modal = document.getElementById("modal");
    closeModal(modal); // Close modal after task creation
    description.innerHTML = ""; // Reset task description input field
    priorityElement.innerText = "Priority";
    selectedUserResponsibility.innerText = "Assignee";
    leadResponsibility = null;
  }
);

// Socket event listener for creating a new board (task lane)
socket.on("create board", (workspace) => {
  workspace.members.forEach((member) => {
    memberMap.set(member._id, member);
  });
  workspace.issues.forEach((DBIssue) => {
    assignee = memberMap.get(DBIssue.assignee._id);
    const issue = new Issue(
      DBIssue._id,
      DBIssue.title,
      DBIssue.description,
      DBIssue.createDate,
      DBIssue.status,
      DBIssue.labels,
      assignee,
      DBIssue.priority
    );
    const newTaskElement = createTaskElement(
      DBIssue.title,
      DBIssue._id,
      DBIssue.createDate,
      DBIssue.priority,
      DBIssue.labels,
      assignee
    );
    issueMap.set(DBIssue._id, issue);

    newTaskElement.addEventListener("click", async (e) => {
      console.log(e.target);
      const issue = await issueMap.get(e.target.id);
      openModalEdit(issue);
    });
    const lane = document.getElementById(DBIssue.status);
    lane.appendChild(newTaskElement); // Append the new task lane element to the task lane/container
    UpdateDragAndDrop(); // Update drag and drop functionality for all tasks
  });
});

function createTaskElement(title, id, createDate, priority, labels, assignee) {
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
  createdAssignee.src = assignee.profilePicture.url; // Placeholder image
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
  priorityText.innerText = priority;
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
  const createdLabels = document.createElement("p");
  if (labels.length > 0) {
    createdLabels.textContent = labels; // Default tag
    createdLabels.classList.add("created-labels");
    issueFooter.appendChild(createdLabels);
  }
  // Add drag and drop event listeners to the new task or task lane element
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  return newTask; // Return the created task or task lane element
}

function CreateUserOptions(users) {
  selectionUserResponsibility.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("div");
    option.classList.add("item");
    option.textContent = user;
    option.addEventListener("click", () => {
      leadResponsibility = option.textContent;
      selectedUserResponsibility.textContent = leadResponsibility;
    });
    selectionUserResponsibility.appendChild(option);
  });
}

socket.on("error", (err) => {
  alert(`Socket error: ${err.message}`);
  console.error(err);
});
