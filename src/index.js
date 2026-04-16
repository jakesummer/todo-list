import AppManager from "./appManager.js";
import Project from "./project.js";
import Todo from "./todo.js"
import DisplayManager from "./displayManager.js";
import "./style.css"

const appManager = new AppManager();

function initApp() {
    // Dom Elements
    const newTodoBtn = document.getElementById("new-todo-btn");
    const newTodoForm = document.getElementById("new-todo-form");
    const todoTitleInput = document.getElementById("new-title-input");
    const todoDescInput = document.getElementById("new-description-input");
    const todoDueDateInput = document.getElementById("new-due-date-input");
    const todoProjectDropdown = document.getElementById("new-todo-project-dropdown");

    // Event Listeners
    newTodoBtn.addEventListener("click", () => DisplayManager.openNewTodoModal(appManager.projects));

    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTodoPriority = document.querySelector('[name="priority-input"]:checked').value;
        const newTodoProject = todoProjectDropdown.value;
        appManager.createNewTodo(todoTitleInput.value, todoDescInput.value, todoDueDateInput.value, newTodoPriority, newTodoProject);
        DisplayManager.displayTodos(appManager.projects.get(newTodoProject), appManager.todos);
        DisplayManager.closeNewTodoModal();
    })
}

DisplayManager.displayTodos(appManager.projects.get("default-project-id"), appManager.todos);
initApp();