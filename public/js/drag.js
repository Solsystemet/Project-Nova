let draggables = document.querySelectorAll(".card");
let droppabls = document.querySelectorAll(".swim-lane");
let bottomTask = null;
let curTask = null;
let curZone = null;

function UpdateDragAndDrop() {
  draggables = document.querySelectorAll(".card");
  droppabls = document.querySelectorAll(".swim-lane");

  draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");

      //console.log(curTask.id);

      if (bottomTask)
        socket.emit(
          "drag ended",
          curTask.id,
          bottomTask.id,
          curZone.id,
          workspaceID
        );
      else socket.emit("drag ended", curTask.id, null, curZone.id, workspaceID);
    });
  });

  droppabls.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      bottomTask = insertAboveTask(zone, e.clientY);
      curTask = document.querySelector(".is-dragging");
      curZone = zone;
      if (!bottomTask) {
        zone.appendChild(curTask);
      } else {
        zone.insertBefore(curTask, bottomTask);
      }
    });
  });
}

socket.on("drag ended", (curTaskID, bottomTaskID, curZoneID) => {
  const cur = document.getElementById(curTaskID);
  const bottom = document.getElementById(bottomTaskID);
  const cZone = document.getElementById(curZoneID);

  if (!bottom) {
    cZone.appendChild(cur);
  } else {
    cZone.insertBefore(cur, bottom);
  }
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".card:not(.is-dragging)");
  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};
