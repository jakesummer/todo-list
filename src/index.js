import "./style.css"
import { format } from "date-fns";
import AppManager from "./appManager.js";
import Project from "./project.js";
import Todo from "./todo.js"
import DisplayManager from "./displayManager.js";

const appManager = new AppManager();
const displayManager = DisplayManager;

const DEFAULT_PROJECT_ID = "default-project-id";

let selectedProjectID = DEFAULT_PROJECT_ID;

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
    // Sidebar
    const sidebar = document.getElementById("sidebar");
    const newProjectBtn = document.getElementById("new-project-btn");
    // New project modal 
    const newProjectForm = document.getElementById("new-project-form");
    const projectNameInput = document.getElementById("new-project-name");
    const cancelProjectBtn = document.getElementById("cancel-project-btn");
    const deleteProjectBtn = document.getElementById("delete-project-btn");

    // Event Listeners
    newTodoBtn.addEventListener("click", () => {
        newTodoForm.reset();
        displayManager.openNewTodoModal(appManager.projects, selectedProjectID);
    });
    cancelTodoBtn.addEventListener("click", () => displayManager.closeNewTodoModal());

    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const todoPriority = document.querySelector('[name="priority-input"]:checked').value;
        const todoProject = todoProjectDropdown.value;
        const todoDueDate = new Date(todoDueDateInput.value);

        if (e.target.dataset.mode === "create") {
            appManager.createNewTodo(todoTitleInput.value, todoDescInput.value, todoDueDate, todoPriority, todoProject);
        } else {
            appManager.editTodo(e.target.dataset.todoId, {
                todoTitle: todoTitleInput.value,
                description: todoDescInput.value,
                dueDate: todoDueDate,
                priority: todoPriority,
                projectID: todoProject,
            });
        }

        displayManager.displayTodos(appManager.projects.get(todoProject), appManager.todos);
        displayManager.closeNewTodoModal();
    });

    closeTodoDetailsBtn.addEventListener("click", () => todoDetailsModal.close());

    // Event Listener for pressing the delete, edit, or checkbox button on a todo card
    contentContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".delete-todo-btn") || e.target.closest(".edit-todo-btn") || e.target.closest(".todo-check-box");
        
        // Check if clicked item is the button to delete or edit a todo
        if (btn) {
            const todoCard = btn.closest(".todo-card");
            const todoID = todoCard.dataset.todoId;
            const todoObj = appManager.getTodo(todoID);
            
            if (btn.classList.contains("delete-todo-btn")) {
                const todoProjectID = todoObj.projectID;
                appManager.removeTodo(todoID);
                displayManager.displayTodos(appManager.projects.get(todoProjectID), appManager.todos);
            } else if(btn.classList.contains("edit-todo-btn")) {
                const todo = appManager.getTodo(todoID);
                displayManager.openNewTodoModal(appManager.projects, todo.projectID, true, todo);
            } else {
                const isChecked = btn.checked;
                appManager.toggleTodoCompletedStatus(todoID, isChecked);

                if (isChecked) todoCard.classList.add("checked-todo");
                else todoCard.classList.remove("checked-todo");

                displayManager.updateDueDateText(appManager.getTodo(todoID));
            }
        } 
    });

    newProjectBtn.addEventListener("click", () => { 
        newProjectForm.reset();
        displayManager.openNewProjectModal()
    });
    cancelProjectBtn.addEventListener("click", () => displayManager.closeNewProjectModal());

    newProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (e.target.dataset.mode === "create") {
            appManager.createNewProject(projectNameInput.value);
        } else {
            const projectID = e.target.dataset.projectId
            appManager.editProjectName(projectID, projectNameInput.value);
            if (projectID === selectedProjectID) displayManager.updateSelectedProject(projectID, projectNameInput.value);
        }
        displayManager.displayProjects(appManager.projects, selectedProjectID);
        displayManager.closeNewProjectModal();
    });

    // Event listener for pressing the project or edit project button
    sidebar.addEventListener("click", (e) => {
        const btn =  e.target.closest(".project-btn") || e.target.closest(".edit-project-btn");

        if (btn) {
            const projectID = btn.closest("li").dataset.projectId;
            const project = appManager.getProject(projectID);

            if (btn.classList.contains("project-btn")) {
                displayManager.displayTodos(project, appManager.todos);
                selectedProjectID = projectID;
                displayManager.updateSelectedProject(selectedProjectID, project.projectName)
            } else {
                displayManager.openNewProjectModal(true, project);
            }
        }
    });

    deleteProjectBtn.addEventListener("click", (e) => {
        const projectID = newProjectForm.dataset.projectId;
        appManager.removeProject(projectID);
        selectedProjectID = DEFAULT_PROJECT_ID
        displayManager.displayTodos(appManager.getProject(DEFAULT_PROJECT_ID), appManager.todos);
        displayManager.displayProjects(appManager.projects, selectedProjectID, appManager.getProject(selectedProjectID).projectName);
        displayManager.closeNewProjectModal();
    });
}

displayManager.displayTodos(appManager.projects.get(DEFAULT_PROJECT_ID), appManager.todos);
displayManager.displayProjects(appManager.projects, selectedProjectID);
initApp();