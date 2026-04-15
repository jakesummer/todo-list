export default class Project {
    #id = crypto.randomUUID();
    #todoList = [];
    projectName;

    constructor(projectName) {
        this.projectName = projectName;
    }

    get id() {
        return this.#id;
    }

    get todoList() {
        return this.#todoList
    }
}