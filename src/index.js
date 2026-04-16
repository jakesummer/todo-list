import AppManager from "./appManager.js";
import Project from "./project.js";
import Todo from "./todo.js"
import DisplayManager from "./displayManager.js";
import "./style.css"

const appManager = new AppManager();
const displayManager = DisplayManager;

function initApp() {
    // Dom Elements
    const contentContainer = document.getElementById("content");
    const newTodoBtn = document.getElementById("new-todo-btn");
    const newTodoForm = document.getElementById("new-todo-form");
    const todoTitleInput = document.getElementById("new-title-input");
    const todoDescInput = document.getElementById("new-description-input");
    const todoDueDateInput = document.getElementById("new-due-date-input");
    const todoProjectDropdown = document.getElementById("new-todo-project-dropdown");
    const cancelTodoBtn = document.getElementById("cancel-todo-btn");
    const todoDetailsModal = document.getElementById("todo-details-modal");
    const closeTodoDetailsBtn = document.getElementById("close-todo-details-btn")

    // Event Listeners
    newTodoBtn.addEventListener("click", () => displayManager.openNewTodoModal(appManager.projects));

    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTodoPriority = document.querySelector('[name="priority-input"]:checked').value;
        const newTodoProject = todoProjectDropdown.value;
        appManager.createNewTodo(todoTitleInput.value, todoDescInput.value, todoDueDateInput.value, newTodoPriority, newTodoProject);
        displayManager.displayTodos(appManager.projects.get(newTodoProject), appManager.todos);
        displayManager.closeNewTodoModal();
    });

    cancelTodoBtn.addEventListener("click", () => {
        displayManager.closeNewTodoModal();
    });

    newTodoBtn.addEventListener("click", () => newTodoForm.reset());

    closeTodoDetailsBtn.addEventListener("click", () => todoDetailsModal.close());

    // Event Listener for pressing the delete button on a todo card
    contentContainer.addEventListener("click", (e) => {
        // Check if clicked item is the button to delete a todo
        const deleteBtn = e.target.closest(".delete-todo-btn")
        if (deleteBtn) {
            const todoID = deleteBtn.dataset.todoId;
            appManager.removeTodo(todoID);
            displayManager.displayTodos(appManager.projects.get("default-project-id"), appManager.todos);
        }
    });
}

displayManager.displayTodos(appManager.projects.get("default-project-id"), appManager.todos);
initApp();