const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");

// Load tasks on startup
window.onload = loadTasks;

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    let text = taskInput.value.trim();
    let date = dateInput.value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    let task = {
        text,
        date,
        completed: false
    };

    createTaskElement(task);
    saveTask(task);

    taskInput.value = "";
    dateInput.value = "";
}

function createTaskElement(task) {
    let li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <div>
            <span class="task-text">${task.text}</span>
            ${
                task.date
                ? `<div class="task-date">Due: ${task.date}</div>`
                : ""
            }
        </div>
        <div class="btn-group">
            <button class="edit-btn">✎</button>
            <button class="complete-btn">✓</button>
            <button class="delete-btn">✕</button>
        </div>
    `;

    // Edit task
    li.querySelector(".edit-btn").addEventListener("click", () => {
        const textSpan = li.querySelector(".task-text");

        const input = document.createElement("input");
        input.type = "text";
        input.value = textSpan.innerText;
        input.className = "edit-input";

        textSpan.replaceWith(input);
        input.focus();

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit();
        });

        input.addEventListener("blur", saveEdit);

        function saveEdit() {
            const newText = input.value.trim();
            if (newText === "") {
                alert("Task cannot be empty!");
                return input.focus();
            }

            const newSpan = document.createElement("span");
            newSpan.className = "task-text";
            newSpan.innerText = newText;
            input.replaceWith(newSpan);

            updateLocalStorage();
        }
    });

    // Toggle complete
    li.querySelector(".complete-btn").addEventListener("click", () => {
        li.classList.toggle("completed");
        task.completed = !task.completed;
        updateLocalStorage();
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.classList.add("removing");
        setTimeout(() => {
            li.remove();
            deleteTask(task);
        }, 250);
    });

    taskList.appendChild(li);
}

// Save tasks
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Local Storage
function updateLocalStorage() {
    let tasks = [];

    document.querySelectorAll(".task").forEach((li) => {
        let text = li.querySelector(".task-text").innerText;
        let dateEl = li.querySelector(".task-date");

        tasks.push({
            text,
            date: dateEl ? dateEl.innerText.replace("Due: ", "") : "",
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task from storage
function deleteTask(taskToDelete) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let updated = tasks.filter(t =>
        t.text !== taskToDelete.text || t.date !== taskToDelete.date
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
}

// Load tasks
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task));
}

