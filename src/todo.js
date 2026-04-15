export default class Todo {
    #id = crypto.randomUUID();
    todoTitle;
    description;
    dueDate;
    priority;
    projectID;

    constructor(todoTitle, description, dueDate, priority, projectID) {
        this.todoTitle = todoTitle;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectID = projectID;
    }

    get id() {
        return this.#id;
    }
}