import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    #projects = [];

    get projects() {
        return Object.freeze([...this.#projects]);
    }

    createNewTodo(todoTitle, description, dueDate, priority, project) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority);
        project.todoList.push(newTodo);
    }
}