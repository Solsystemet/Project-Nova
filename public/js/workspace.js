const shareElement = document.getElementById("share-workspace");
const shareModal = document.querySelector(".modal-share");
const closeShareModel = document.querySelector(".close-button-share");
const searchFilter = document.querySelector(".share-search-filter");
const searchButton = document.querySelector(".share-search-button");
const selectElement = document.querySelector(".user-options-share");
const shareCollection = document.querySelector(".share-collection");
const confirmButton = document.querySelector(".confirm-button");
let usernames = [];

shareElement.addEventListener("click", () => {
  usernames = [];
  shareCollection.textContent = "";
  searchFilter.value = "";
  selectElement.innerHTML = "";
  openShareModal(shareModal);
});

closeShareModel.addEventListener("click", () => {
  closeModal(shareModal);
});

searchButton.addEventListener("click", () => {
  fetch("/search-users/" + searchFilter.value)
    .then((res) => res.json())
    .then((data) => createOptions(data));
});

confirmButton.addEventListener("click", async () => {
  if (selectElement.innerHTML == "") return;
  if (usernames.includes(selectElement.value)) return;

  console.log(selectElement.value);
  usernames.push(selectElement.value);
  const userElement = document.createElement("p");
  userElement.textContent = selectElement.value;

  shareCollection.appendChild(userElement);

  console.log(usernames);
  try {
    const response = await fetch(
      "/share-workspace/" + workspaceID + "/" + usernames,
      {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // The response should contain users for who is getting shared so it can be added to the hashmap
    const result = await response.json();

    result.forEach((user) => {
      memberMap.set(user._id, user);
      console.log(user);
    });

    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }

  closeModal(shareModal);
});

function openShareModal(modal) {
  if (!modal) return;

  modal.classList.add("active");
  overlay.classList.add("active");
}

function createOptions(users) {
  selectElement.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = user;

    selectElement.appendChild(option);
  });
}
