document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const filterCompletedBtn = document.getElementById("filterCompleted");
  const sortByPriorityBtn = document.getElementById("sortByPriority");
  const emptyMessage = document.getElementById("emptyMessage");

  let tasks = [];
  let isFilterActive = false;
  let sortOrder = "asc";

  function updateEmptyMessage() {
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      const title = taskTitle.value.trim();
      const description = taskDescription.value.trim();
      const priorityElement = document.querySelector(
        'input[name="priority"]:checked'
      );

      if (!priorityElement) {
        throw new Error("Please select a priority!");
      }

      const priority = priorityElement.value;
      const task = { title, description, priority, completed: false };
      tasks.push(task);

      renderTasks();
      taskForm.reset();
      taskTitle.focus();
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  });

  function updateTaskItem(taskItem, task, index) {
    taskItem.innerHTML = `
    <div>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Priority: <strong>${task.priority}</strong></p>
    </div>
    <div class="task-actions">
      <button class="complete-btn">${
        task.completed ? "Undo" : "Complete"
      }</button>
      <button class="delete-btn">Delete</button>
    </div>`;
    taskItem.classList.toggle("completed", task.completed);
    taskItem.dataset.index = index;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if (!isFilterActive || task.completed) {
        const taskItem = document.createElement("li");
        updateTaskItem(taskItem, task, index);
        taskList.appendChild(taskItem);
      }
    });
    updateEmptyMessage();
  }

  //Task List için olay dinleyici
  taskList.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target;
    console.log("Clicked element:", target);
    console.log("Clicked element class list:", target.classList);

    if (target.matches(".complete-btn, .delete-btn")) {
      const taskItem = target.closest("li");
      if (!taskItem) return;
      const taskIndex = parseInt(taskItem.dataset.index, 10); //

      if (target.classList.contains("complete-btn")) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        if (isFilterActive && !tasks[taskIndex].completed) {
          taskItem.remove();
        } else {
          updateTaskItem(taskItem, tasks[taskIndex], taskIndex);
        }
      } else if (target.classList.contains("delete-btn")) {
        tasks.splice(taskIndex, 1);
        taskItem.remove();
        renderTasks();
      }
    }
  });

  filterCompletedBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isFilterActive = !isFilterActive;
    filterCompletedBtn.classList.toggle("active");
    isFilterActive
      ? renderFilteredTasks(tasks.filter((task) => task.completed))
      : renderTasks();
  });

  sortByPriorityBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const priorityOrder = { Low: 1, Medium: 2, High: 3 };
    tasks.sort((a, b) =>
      sortOrder === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByPriorityBtn.innerHTML = `Priority <i class="fas fa-sort-${
      sortOrder === "asc" ? "up" : "down"
    }"></i>`;
    renderTasks();
  });

  function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = "";
    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      const index = tasks.findIndex((t) => t === task);
      updateTaskItem(taskItem, task, index);
      taskList.appendChild(taskItem);
    });
  }
});
