import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    #projects = [];
    #todos = new Map();

    get projects() {
        return Object.freeze([...this.#projects]);
    }

    get todos() {
        return Object.freeze([...this.#todos])
    }

    createNewProject(projectName) {
        const newProject = new Project(projectName);
        this.#projects.push(newProject);
        return newProject.id;
    }

    createNewTodo(todoTitle, description, dueDate, priority, projectID) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority, projectID);
        const project = this.getProject(projectID);
        project.todoIDs.push(newTodo.id);
        this.#todos.set(newTodo.id, newTodo);
        return newTodo.id;
    }

    getProject(projectID) {
        return this.#projects.find(p => p.id === projectID);
    }

    getTodo(todoID) {
        return this.#todos.get(todoID);
    }

    editTodo(todoID, key, value) {
        const todo = this.getTodo(todoID);
        if (Object.hasOwn(todo, key)) {
            todo[key] = value;
        } else {
            throw new TypeError(`${key} is not a valid key!`);
        }
    }

    editProjectName(projectID, newName) {
        const project = this.getProject(projectID);
        project.projectName = newName;
    }

    removeTodo(todoID) {
        const todo = this.getTodo(todoID);
        const project = this.getProject(todo.projectID);
        const index = project.todoIDs.findIndex(element => element.id === todoID);
        project.todoIDs.splice(index, 1);
        this.#todos.delete(todoID);
    }

    removeProject(projectID) {
        const index = this.#projects.findIndex(element => element.id === projectID)
        this.#projects.splice(index, 1);

        for (const [key, value] of this.#todos) {
            if (value.projectID === projectID) {
                this.#todos.delete(key);
            }
        }
    }
}