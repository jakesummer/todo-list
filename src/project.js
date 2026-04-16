export default class Project {
    #id
    #todoIDs = [];
    projectName;

    constructor(projectName, id = null) {
        this.#id = id || crypto.randomUUID();;
        this.projectName = projectName;
    }

    get id() {
        return this.#id;
    }

    get todoIDs() {
        return this.#todoIDs;
    }

    toJSON() {
        return {
            id: this.#id,
            todoIDs: this.todoIDs,
            projectName: this.projectName,
        }
    }
}