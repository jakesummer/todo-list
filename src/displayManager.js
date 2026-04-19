import { format, isTomorrow, isToday, formatDate } from "date-fns";

export default (function () {
    const _editSVGIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
    const _dueDateSVGIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-today-outline</title><path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.89 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19" /><circle cx="14.5" cy="14.5" r="2" /></svg>';
    const _completedSVGIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-all</title><path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" /></svg>'
    
    let _todoCounter = 0;

    // DOM Elements
    const _projectNameHeading = document.getElementById("project-name-heading");
    const _todoCountText = document.getElementById("todo-count");
    const _todoCountLabel = document.getElementById("todo-count-label");
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
        _todoCounter = 0;
        _clearTodos();
        const projectTodoIDs = project.todoIDs;
        for (const id of projectTodoIDs) {
            const todo = todoList.get(id);
            const newTodoCard = _createTodoCard(todo, project.projectName);
            _contentContainer.appendChild(newTodoCard);
            _todoCounter++;
        }
        _todoCountText.textContent = _todoCounter;
        _todoCountLabel.textContent = _todoCounter === 1 ? "todo": "todos";
    };

    const _clearTodos = () => {
        _contentContainer.textContent = "";
    }

    const _createTodoCard = (todo, projectName) => {
        const todoCard = document.createElement("div");
        todoCard.classList.add("todo-card");
        todoCard.dataset.projectId = todo.projectID;
        todoCard.dataset.todoId = todo.id;

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("todo-check-box-container");
        checkboxContainer.setAttribute("for", todo.id);

        const checkBox = document.createElement("input")
        checkBox.type = "checkbox";
        checkBox.classList.add("todo-check-box");
        checkBox.id = todo.id

        checkboxContainer.appendChild(checkBox);

        const title = document.createElement("p");
        title.classList.add("todo-title");
        title.textContent = todo.todoTitle;

        const dueDate = document.createElement("p");
        dueDate.classList.add("todo-due-date");

        const rightSide = document.createElement("div");
        rightSide.classList.add("todo-card-right");

        const priority = document.createElement("p");
        priority.classList.add("todo-priority");
        priority.classList.add(`priority-${todo.priority}`);
        priority.textContent = todo.priority;

        const editTodoBtn = document.createElement("button");
        editTodoBtn.classList.add("edit-todo-btn");
        editTodoBtn.innerHTML = _editSVGIcon;
        
        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.classList.add("delete-todo-btn");
        deleteTodoBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>';
        
        if (todo.isCompleted) {
            checkBox.checked = true;
            todoCard.classList.add("checked-todo")
            dueDate.innerHTML = `${_completedSVGIcon} <span>FINISHED</span>`;
        } else {
            dueDate.innerHTML = `${_dueDateSVGIcon} <span>${_formatDate(todo.dueDate)}</span>`;
        }

        rightSide.appendChild(priority)
        rightSide.appendChild(editTodoBtn)
        rightSide.appendChild(deleteTodoBtn)

        todoCard.appendChild(checkboxContainer);
        todoCard.appendChild(title);
        todoCard.appendChild(dueDate);
        todoCard.appendChild(rightSide);

        todoCard.addEventListener("click", (e) => {
            if (!e.target.closest("input, button, .todo-check-box-container")) {
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
    };

    const updateDueDateText = (todo) => {
        const todoID = todo.id;
        const todoCard = document.querySelector(`.todo-card[data-todo-id="${todoID}"]`);
        const dueDateText = todoCard.querySelector(".todo-due-date");

        dueDateText.innerHTML = todoCard.classList.contains("checked-todo") ?
            `${_completedSVGIcon} <span>FINISHED</span>`:
            `${_dueDateSVGIcon} <span>${_formatDate(todo.dueDate)}</span>`;
    };

    const displayProjects = (projectsList, selectedProjectID, selectedProjectName) => {
        _clearProjects();
        for (const [id, project] of projectsList) {
            const newProjectBtn = _createNewProjectBtn(project);
            _projectsContainer.appendChild(newProjectBtn);
        }
        updateSelectedProject(selectedProjectID, selectedProjectName);
    }

    const updateSelectedProject = (selectedProjectID, selectedProjectName = "") => {
        document.querySelector(".selected-project").classList.remove("selected-project");
        document.querySelector(`li[data-project-id="${selectedProjectID}"]`).classList.add("selected-project")
        if (selectedProjectName) _projectNameHeading.textContent = selectedProjectName;
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

        let editBtn;
        if (project.id !== "default-project-id") {
            editBtn = document.createElement("button")
            editBtn.classList.add("edit-project-btn");
            editBtn.innerHTML = _editSVGIcon;
        } else {
            projectLi.classList.add("selected-project");
        }

        projectLi.appendChild(projectBtn);
        editBtn ? projectLi.appendChild(editBtn): "";
        return projectLi;
    }

    const openNewProjectModal = (isEditMode = false, editedProject = null) => {
        if (isEditMode) {
            _deleteProjectBtn.style.display = "flex";
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

    return { displayTodos, openNewTodoModal, closeNewTodoModal, _clearTodos, updateDueDateText, displayProjects, updateSelectedProject, openNewProjectModal, closeNewProjectModal };
})();