const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

let dragElement = null;
let tasksData = {};

function addTasks(column, title, description) {
  let task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("draggable", "true");

  task.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;

  task.addEventListener("dragstart", () => {
    dragElement = task;
  });

  task.querySelector("button").addEventListener("click", () => {
    task.remove();
    updateAll();
  });

  column.appendChild(task);
}

function updateCount(col) {
  let tasks = col.querySelectorAll(".task");
  let count = col.querySelectorAll(".right");
  count.forEach((c) => {
    c.innerText = tasks.length;
  });
}

function saveToLocalStorage() {
  [todo, progress, done].forEach((col) => {
    let tasks = col.querySelectorAll(".task");
    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      description: t.querySelector("p").innerText,
    }));
  });
  localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

function updateAll() {
  [todo, progress, done].forEach(updateCount);
  saveToLocalStorage();
}

if (localStorage.getItem("tasksData")) {
  const data = JSON.parse(localStorage.getItem("tasksData"));
  for (let colId in data) {
    let column = document.getElementById(colId);
    data[colId].forEach((t) => {
      addTasks(column, t.title, t.description);
    });
  }
  updateAll();
}

function addDragEventOnColumn(column) {
  column.addEventListener("dragenter", () =>
    column.classList.add("hover-over"),
  );
  column.addEventListener("dragleave", () =>
    column.classList.remove("hover-over"),
  );
  column.addEventListener("dragover", (e) => e.preventDefault());
  column.addEventListener("drop", () => {
    if (dragElement) {
      column.appendChild(dragElement);
      column.classList.remove("hover-over");
      updateAll();
    }
  });
}

[todo, progress, done].forEach(addDragEventOnColumn);

const toggleBtn = document.querySelector("nav .btn");
const modal = document.querySelector(".modal");
const modalGlass = document.querySelector(".glass");
const modalBtn = document.querySelector(".modal button");

toggleBtn.addEventListener("click", () => modal.classList.toggle("active"));
modalGlass.addEventListener("click", () => modal.classList.remove("active"));

modalBtn.addEventListener("click", () => {
  let h2 = document.querySelector(".modal input").value.trim();
  let p = document.querySelector(".modal textarea").value.trim();

  if (h2 !== "" || p !== "") {
    addTasks(todo, h2, p);
    updateAll();
    modal.classList.remove("active");
    document.querySelector(".modal input").value = "";
    document.querySelector(".modal textarea").value = "";
  }
});
