import "./style.css"
import { format } from "date-fns";
import AppManager from "./appManager.js";
import Project from "./project.js";
import Todo from "./todo.js"
import DisplayManager from "./displayManager.js";

const appManager = new AppManager();
const displayManager = DisplayManager;

function initApp() {
    // Dom Elements
    const contentContainer = document.getElementById("content");
    // New todo modal
    const newTodoBtn = document.getElementById("new-todo-btn");
    const newTodoForm = document.getElementById("new-todo-form");
    const todoTitleInput = document.getElementById("new-title-input");
    const todoDescInput = document.getElementById("new-description-input");
    const todoDueDateInput = document.getElementById("new-due-date-input");
    const todoProjectDropdown = document.getElementById("new-todo-project-dropdown");
    // Todo details
    const cancelTodoBtn = document.getElementById("cancel-todo-btn");
    const todoDetailsModal = document.getElementById("todo-details-modal");
    const closeTodoDetailsBtn = document.getElementById("close-todo-details-btn")

    // Event Listeners
    newTodoBtn.addEventListener("click", () => displayManager.openNewTodoModal(appManager.projects, "default-project-id"));

    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTodoPriority = document.querySelector('[name="priority-input"]:checked').value;
        const newTodoProject = todoProjectDropdown.value;
        const newTodoDueDate = new Date(todoDueDateInput.value);
        appManager.createNewTodo(todoTitleInput.value, todoDescInput.value, newTodoDueDate, newTodoPriority, newTodoProject);
        displayManager.displayTodos(appManager.projects.get(newTodoProject), appManager.todos);
        displayManager.closeNewTodoModal();
    });

    cancelTodoBtn.addEventListener("click", () => {
        displayManager.closeNewTodoModal();
    });

    newTodoBtn.addEventListener("click", () => newTodoForm.reset());

    closeTodoDetailsBtn.addEventListener("click", () => todoDetailsModal.close());

    // Event Listener for pressing the delete or edit button on a todo card
    contentContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".delete-todo-btn") || e.target.closest(".edit-todo-btn")
        
        // Check if clicked item is the button to delete or edit a todo
        if (btn) {
            const todoCard = btn.closest(".todo-card");
            const todoID = todoCard.dataset.todoId;

            if (btn.classList.contains("delete-todo-btn")) {
                appManager.removeTodo(todoID);
                displayManager.displayTodos(appManager.projects.get("default-project-id"), appManager.todos);
            } else {
                const todo = appManager.getTodo(todoID);
                todoTitleInput.value = todo.todoTitle;
                todoDescInput.value = todo.description;
                // 2026-04-24T14:52
                todoDueDateInput.value = format(todo.dueDate, "yyyy-MM-dd'T'HH:mm");
                document.querySelector(`[name="priority-input"][value="${todo.priority}"]`).checked = true;
                
                displayManager.openNewTodoModal(appManager.projects, todo.projectID, true);
            }
        } 
    });
}

displayManager.displayTodos(appManager.projects.get("default-project-id"), appManager.todos);
initApp();