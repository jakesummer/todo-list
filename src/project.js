export default class Project {
    #id = crypto.randomUUID();
    #todoIDs = [];
    projectName;

    constructor(projectName) {
        this.projectName = projectName;
    }

    get id() {
        return this.#id;
    }

    get todoIDs() {
        return this.#todoIDs;
    }
}