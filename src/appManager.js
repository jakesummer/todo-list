import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    #projects = new Map();
    #todos = new Map();

    constructor() {
        const data = storage.load();    

        // Create all projects
        for (const obj of data) {
            if (Object.hasOwn(obj, "projectName")) {
                this.createNewProject(obj.projectName, obj.id, true);
            } 
        }
        
        // Create all todos
        for (const obj of data) {
            if(!Object.hasOwn(obj, "projectName")) {
                this.createNewTodo(obj.todoTitle, obj.description, obj.dueDate, obj.priority, obj.projectID, obj.id, true);
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

        if (!isLoading) storage.save(newProject.id, newProject);
        
        return newProject.id;
    }

    createNewTodo(todoTitle, description, dueDate, priority, projectID, id = null, isLoading = false) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority, projectID, id);
        const project = this.getProject(projectID);
        project.todoIDs.push(newTodo.id);
        this.#todos.set(newTodo.id, newTodo);

        if (!isLoading) {
            storage.save(newTodo.id, newTodo);
            storage.save(projectID, project);
        }

        return newTodo.id;
    }

    getProject(projectID) {
        return this.#projects.get(projectID);
    }

    getTodo(todoID) {
        return this.#todos.get(todoID);
    }

    editTodo(todoID, key, value) {
        const todo = this.getTodo(todoID);
        if (Object.hasOwn(todo, key)) {
            todo[key] = value;
            storage.save(todoID, todo);
        } else {
            throw new TypeError(`${key} is not a valid key!`);
        }
    }

    editProjectName(projectID, newName) {
        const project = this.getProject(projectID);
        project.projectName = newName;
        storage.save(project.id, project);
    }

    removeTodo(todoID) {
        const todo = this.getTodo(todoID);
        const project = this.getProject(todo.projectID);
        const index = project.todoIDs.findIndex(element => element.id === todoID);
        project.todoIDs.splice(index, 1);
        this.#todos.delete(todoID);
        project.remove(todoID);
    }

    removeProject(projectID) {
        this.#projects.delete(projectID)
        storage.remove(projectID);

        for (const [key, value] of this.#todos) {
            if (value.projectID === projectID) {
                this.#todos.delete(key);
                storage.remove(key);
            }
        }
    }
}

const storage = function () {
    const save = (key, value) => {
        key = JSON.stringify(key);
        value = JSON.stringify(value);
        try {
            localStorage.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    };

    const remove = (key) => {
        localStorage.removeItem(key);
    };

    const load = () => {
        const data = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (data.push(JSON.parse(value)));
            else continue;
        }
        return data;
    };

    return { save, remove, load};
}();