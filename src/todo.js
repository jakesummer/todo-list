export default class Todo {
    #id
    todoTitle;
    description;
    dueDate;
    priority;
    projectID;
    isCompleted;

    constructor(todoTitle, description, dueDate, priority, projectID, id = null, isCompleted = false) {
        this.#id = id || crypto.randomUUID();
        this.todoTitle = todoTitle;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.projectID = projectID;
        this.isCompleted = isCompleted;
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
            isCompleted: this.isCompleted
        }
    }
}