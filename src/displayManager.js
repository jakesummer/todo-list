import { format, isTomorrow, isToday, formatDate } from "date-fns";

export default (function () {
    const _editSVGIcon = '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon> </g> </g> </g> </g></svg>';

    // DOM Elements
    // New todo modal elements
    const _contentContainer = document.getElementById("content");
    const _newTodoModal = document.getElementById("new-todo-modal");
    const _newTodoModalHeader = document.getElementById("new-todo-modal-header");
    const _newTodoForm = document.getElementById("new-todo-form");
    const _newTodoTitleInput = document.getElementById("new-title-input");
    const _newTodoDescInput = document.getElementById("new-description-input");
    const _newTodoDueDateInput = document.getElementById("new-due-date-input");
    const _newTodoProjectDropdown = document.getElementById("new-todo-project-dropdown");
    const _createNewTodoBtn = document.getElementById("create-todo-btn");
    // Todo details elements
    const _todoDetailsModal = document.getElementById("todo-details-modal");
    const _detailsTitleText = document.getElementById("details-title")
    const _detailsProjectText = document.getElementById("details-project");
    const _detailsDueDateText = document.getElementById("details-due-date");
    const _detailsPriorityText = document.getElementById("details-priority");
    const _detailsDescriptionText = document.getElementById("details-description");
    // Sidebar
    const _projectsContainer = document.getElementById("projects-container");
    // New project modal elements
    const _newProjectModal = document.getElementById("new-project-modal");
    const _newProjectForm = document.getElementById("new-project-form");
    const _deleteProjectBtn = document.getElementById("delete-project-btn");
    const _createProjectBtn = document.getElementById("create-project-btn");
    const _projectNameInput = document.getElementById("new-project-name");

    const displayTodos = (project, todoList) => {
        _clearTodos();
        const projectTodoIDs = project.todoIDs;
        for (const id of projectTodoIDs) {
            const todo = todoList.get(id);
            const newTodoCard = _createTodoCard(todo, project.projectName);
            _contentContainer.appendChild(newTodoCard);
        }
    };

    const _clearTodos = () => {
        _contentContainer.textContent = "";
    }

    const _createTodoCard = (todo, projectName) => {
        const todoCard = document.createElement("div");
        todoCard.classList.add("todo-card");
        todoCard.dataset.projectId = todo.projectID;
        todoCard.dataset.todoId = todo.id;

        const checkBox = document.createElement("input")
        checkBox.type = "checkbox";
        checkBox.id = todo.id;

        const title = document.createElement("p");
        title.classList.add("todo-title");
        title.textContent = todo.todoTitle;

        const dueDate = document.createElement("p");
        dueDate.classList.add("todo-due-date");
        const SVGIcon = '<svg width="20" height="20" viewBox="-1 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>calendar</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-309.000000, -359.000000)" fill="#000000"> <path d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 L323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 L315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 L323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 L315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z" id="calendar" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>';
        dueDate.innerHTML = `${SVGIcon} <span>${_formatDate(todo.dueDate)}</span>`;

        const priority = document.createElement("p");
        priority.classList.add("todo-priority");
        priority.classList.add(`priority-${todo.priority}`);
        priority.textContent = todo.priority;

        const editTodoBtn = document.createElement("button");
        editTodoBtn.classList.add("edit-todo-btn");
        editTodoBtn.innerHTML = _editSVGIcon;

        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.classList.add("delete-todo-btn");
        deleteTodoBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';

        todoCard.appendChild(checkBox);
        todoCard.appendChild(title);
        todoCard.appendChild(dueDate);
        todoCard.appendChild(priority);
        todoCard.appendChild(editTodoBtn);
        todoCard.appendChild(deleteTodoBtn);

        todoCard.addEventListener("click", (e) => {
            if (!e.target.closest("input, button")) {
                _viewTodoDetails(todo, projectName);
            }
        });

        return todoCard;
    };

    const openNewTodoModal = (projectList, defaultProjectID, isEditMode = false, editedTodo = null) => {
        _newTodoProjectDropdown.textContent = "";
        projectList.forEach(project => {
            const option = document.createElement("option");
            option.value = project.id;
            option.text = project.projectName;
            _newTodoProjectDropdown.appendChild(option);
        });

        if (isEditMode) {
            _newTodoModalHeader.textContent = "Edit Todo";
            _createNewTodoBtn.textContent = "Save Changes";
            _newTodoTitleInput.value = editedTodo.todoTitle;
            _newTodoDescInput.value = editedTodo.description;
            _newTodoDueDateInput.value = format(editedTodo.dueDate, "yyyy-MM-dd'T'HH:mm");
            document.querySelector(`[name="priority-input"][value="${editedTodo.priority}"]`).checked = true;
        } else {
            _newTodoModalHeader.textContent = "Create New Todo";
            _createNewTodoBtn.textContent = "Create Todo";
        }

        _newTodoForm.dataset.mode = isEditMode ? "edit": "create";
        _newTodoForm.dataset.todoId = editedTodo ? editedTodo.id: "";

        _newTodoProjectDropdown.value = defaultProjectID;

        _newTodoModal.showModal();
    };

    const closeNewTodoModal = () => {
        _newTodoModal.close();
        _newTodoForm.reset();
    };

    const _viewTodoDetails = (todo, projectName) => {
        _detailsTitleText.textContent = todo.todoTitle;
        _detailsPriorityText.textContent = todo.priority;
        _detailsPriorityText.className = `priority-${todo.priority}`;
        _detailsProjectText.textContent = projectName;
        _detailsDueDateText.textContent = _formatDate(todo.dueDate);
        _detailsDescriptionText.textContent = todo.description;
        _todoDetailsModal.showModal();
    }

    const displayProjects = (projectsList) => {
        _clearProjects();
        for (const [id, project] of projectsList) {
            const newProjectBtn = _createNewProjectBtn(project);
            _projectsContainer.appendChild(newProjectBtn);
        }
    }

    const _clearProjects = () => {
        _projectsContainer.textContent = "";
    }

    const _createNewProjectBtn = (project) => {
        const projectLi = document.createElement("li");
        projectLi.dataset.projectId = project.id;

        const projectBtn = document.createElement("button");
        projectBtn.classList.add("project-btn");
        projectBtn.textContent = project.projectName;

        const editBtn = document.createElement("button")
        editBtn.classList.add("edit-project-btn");
        editBtn.innerHTML = _editSVGIcon;

        projectLi.appendChild(projectBtn);
        projectLi.appendChild(editBtn);
        return projectLi;
    }

    const openNewProjectModal = (isEditMode = false, editedProject = null) => {
        if (isEditMode) {
            _deleteProjectBtn.style.display = "initial";
            _projectNameInput.value = editedProject.projectName;
            _createProjectBtn.textContent = "Save Changes";
        } else {
            _deleteProjectBtn.style.display = "none";
            _createProjectBtn.textContent = "Create Project";
        }

        _newProjectForm.dataset.mode = isEditMode ? "edit": "create";
        _newProjectForm.dataset.projectId = editedProject ? editedProject.id: "";

        _newProjectModal.showModal();
    }

    const closeNewProjectModal = () => {
        _newProjectForm.reset();
        _newProjectModal.close();
    }

    const _formatDate = (date) => {
        if (isToday(date)) {
            return `Today, ${format(date, "h:mm a")}`
        }
        else if (isTomorrow(date)) {
            return `Tomorrow, ${format(date, "h:mm a")}`
        } else {
            return format(date, "M/d/yy h:mm a");
        }
    }

    return { displayTodos, openNewTodoModal, closeNewTodoModal, _clearTodos, displayProjects, openNewProjectModal, closeNewProjectModal };
})();