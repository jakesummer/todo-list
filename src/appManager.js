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

    createNewTodo(todoTitle, description, dueDate, priority, projectID) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority);
        const project = this.getProject(projectID);
        project.todoList.push(newTodo);
        return newTodo.id;
    }
    
    getProject(projectID) {
        return this.#projects.find(p => p.id === projectID);
    }

    getTodo(todoID, projectID) {
        const todoProject = this.getProject(projectID);
        return todoProject.todoList.find(todo => todo.id === todoID);
    }

    editTodo(todoID, projectID, key, value) {
        const todo = this.getTodo(todoID, projectID);
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

    removeTodo(todoID, projectID) {
        const todoList = this.getProject(projectID).todoList;
        const index = todoList.findIndex(element => element.id === todoID);
        todoList.splice(index, 1);
    }

    removeProject(projectID) {
        const index = this.#projects.findIndex(element => element.id === projectID)
        this.#projects.splice(index, 1);
    }
}