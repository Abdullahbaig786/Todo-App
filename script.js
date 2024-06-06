document.addEventListener("DOMContentLoaded", () => {
  const currentPage = document.body.id;
  switch (currentPage) {
    case "indexPage":
      initializeIndexPage();
      break;
    case "addPage":
      initializeAddPage();
      break;
    case "editPage":
      initializeEditPage();
      break;
    default:
      console.error("Unknown page.");
  }
});

function initializeIndexPage() {
  const taskList = document.getElementById("taskList");

  // Load tasks from localStorage
  loadTasks();

  // Function to load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const listItem = createTaskListItem(task);
      taskList.appendChild(listItem);
    });
  }

  // Function to create a task list item
  function createTaskListItem(task) {
    const listItem = document.createElement("tr");
    listItem.innerHTML = `
            <td>${task.text}</td>
            <td>${task.deadline}</td>
            <td>${task.progress}%</td>
            <td>
                <button class="edit-btn btn btn-sm btn-warning" data-id="${task.id}">Edit</button>
                <button class="delete-btn btn btn-sm btn-danger" data-id="${task.id}">&times;</button>
            </td>
        `;
    return listItem;
  }

  // Event delegation for edit and delete buttons
  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const taskId = event.target.getAttribute("data-id");
      // Redirect to edit page with taskId
      window.location.href = `edit.html?id=${taskId}`;
    } else if (event.target.classList.contains("delete-btn")) {
      const taskId = event.target.getAttribute("data-id");
      deleteTask(taskId);
    }
  });

  // Function to delete a task from localStorage and DOM
  function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload(); // Refresh the page to update the task list
  }
}

function initializeAddPage() {
  const addTaskForm = document.getElementById("addTaskForm");

  // Function to add a new task
  addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = document.getElementById("todoText").value.trim();
    const deadline = document.getElementById("deadline").value;
    const progress = document.getElementById("progress").value;
    if (taskText && deadline && progress !== "") {
      const newTask = {
        id: new Date().getTime().toString(),
        text: taskText,
        deadline: deadline,
        progress: progress,
      };
      addTask(newTask);
      addTaskForm.reset();
    }
  });

  // Function to add a task to localStorage
  function addTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.href = "index.html"; // Redirect to home page after adding task
  }
}

function initializeEditPage() {
  const editTaskForm = document.getElementById("editTaskForm");
  const taskId = new URLSearchParams(window.location.search).get("id");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    // Check if the task exists
    let task = tasks[taskIndex];

    // Populate form fields with task information
    document.getElementById("todoText").value = task.text;
    document.getElementById("deadline").value = task.deadline;
    document.getElementById("progress").value = task.progress;

    // Update task information when form is submitted
    editTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      // Update task object with new values
      task.text = document.getElementById("todoText").value.trim();
      task.deadline = document.getElementById("deadline").value;
      task.progress = document.getElementById("progress").value;
      // Save updated task back to the tasks array
      tasks[taskIndex] = task;
      // Save tasks array back to localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      // Redirect to index page
      window.location.href = "index.html";
    });
  } else {
    console.error("Task not found.");
  }
}
