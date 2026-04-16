export default class Todo {
    #id
    todoTitle;
    description;
    dueDate;
    priority;
    projectID;

    constructor(todoTitle, description, dueDate, priority, projectID, id = null) {
        this.#id = id || crypto.randomUUID();
        this.todoTitle = todoTitle;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectID = projectID;
    }

    get id() {
        return this.#id;
    }

    toJSON() {
        return {
            id: this.#id,
            todoTitle: this.todoTitle,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            projectID: this.projectID,
        }
    }
}