export default class Todo {
    #id = crypto.randomUUID();
    todoTitle;
    description;
    dueDate;
    priority;

    constructor(todoTitle, description, dueDate, priority) {
        this.todoTitle = todoTitle;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    get id() {
        return this.#id;
    }
}