import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    #projects = [];

    get projects() {
        return Object.freeze([...this.#projects]);
    }

    createNewProject(projectName) {
        const newProject = new Project(projectName);
        this.#projects.push(newProject);
        return newProject.id;
    }

    getProject(projectID) {
        return this.#projects.find(p => p.id === projectID);
    }

    createNewTodo(todoTitle, description, dueDate, priority, projectID) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority);
        const project = this.getProject(projectID);
        project.todoList.push(newTodo);
    }
}