import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    #projects = new Map();
    #todos = new Map();

    constructor() {
        const data = storage.load();  

        // Create projects map from saved data
        if (data["projects"]) {
            for (const arr of data["projects"]) {
                const obj = arr[1];
                this.createNewProject(obj.projectName, obj.id, true);
            }
        }

        // Create default project if it's not already created
        if (this.#projects.size === 0) {
            this.createNewProject("General", "default-project-id");
        }

        // Create todos map from saved data
        if (data["todos"]) {
            for (const arr of data["todos"]) {
                const obj = arr[1];
                const t = this.createNewTodo(obj.todoTitle, obj.description, obj.dueDate, obj.priority, obj.projectID, obj.id, obj.isCompleted, true);
            }
        }
    }

    get projects() {
        return Object.freeze(new Map(this.#projects));
    }

    get todos() {
        return Object.freeze(new Map(this.#todos));
    }

    createNewProject(projectName, id = null, isLoading = false) {
        const newProject = new Project(projectName, id);
        this.#projects.set(newProject.id, newProject);

        if (!isLoading) this.#saveProjects();
        
        return newProject.id;
    }

    createNewTodo(todoTitle, description, dueDate, priority, projectID, id = null, isCompleted = false, isLoading = false) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority, projectID, id, isCompleted);
        const project = this.getProject(projectID);
        project.todoIDs.push(newTodo.id);
        this.#todos.set(newTodo.id, newTodo);

        if (!isLoading) {
            this.#saveTodos();
            this.#saveProjects();
        }

        return newTodo.id;
    }

    getProject(projectID) {
        return this.#projects.get(projectID);
    }

    getTodo(todoID) {
        return this.#todos.get(todoID);
    }

    toggleTodoCompletedStatus(todoID, status) {
        this.editTodo(todoID, { isCompleted:  status});
    }

    editTodo(todoID, updates) {
        const todo = this.getTodo(todoID);

        for (const [key, value] of Object.entries(updates)) {
            if (Object.hasOwn(todo, key)) {
                todo[key] = value;
                this.#saveTodos();
            } else {
                throw new TypeError(`${key} is not a valid key!`);
            }
        }
    }

    editProjectName(projectID, newName) {
        const project = this.getProject(projectID);
        project.projectName = newName;
        this.#saveProjects();
    }

    removeTodo(todoID) {
        const todo = this.getTodo(todoID);
        const project = this.getProject(todo.projectID);
        const index = project.todoIDs.findIndex(element => element === todoID);;
        project.todoIDs.splice(index, 1);
        this.#todos.delete(todoID);
        this.#saveTodos();
    }

    removeProject(projectID) {
        this.#projects.delete(projectID)
        this.#saveProjects();

        for (const [key, value] of this.#todos) {
            if (value.projectID === projectID) {
                this.#todos.delete(key);
            }
        }
        this.#saveTodos();
    }

    #saveTodos() {
        storage.save("todos", Array.from(this.#todos));
    }

    #saveProjects() {
        storage.save("projects", Array.from(this.#projects))
    }
}

const storage = function () {
    const save = (key, value) => {
        key = `todoList_${key}`;
        value = JSON.stringify(value);
        try {
            localStorage.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    };

    const remove = (key) => {
        localStorage.removeItem(`todoList_${JSON.stringify(key)}`);
    };

    const load = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            
            if (!key.startsWith("todoList_")) continue;

            key = key.replace(/^todoList_/, "");

            try {
                value = JSON.parse(value);
                data[key] = value;
            } catch {
                continue;
            }
        }
        return data;
    };

    return { save, remove, load};
}();