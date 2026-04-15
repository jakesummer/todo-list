import Todo from "./todo.js";
import Project from "./project.js";

export default class AppManager {
    createNewTodo(todoTitle, description, dueDate, priority, project) {
        const newTodo = new Todo(todoTitle, description, dueDate, priority);
        project.todoList.push(newTodo);
    }
}