class Project {

    #itemList
    #id
    constructor(name) {
        if (name === undefined || typeof (name) != 'string' || name.length < 1) {
            throw new Error("Needs name and name needs to be a string of at least 1 character.")
        }
        this._name = name;
        this.#itemList = [];
        this._complete = false;
        this.#id = crypto.randomUUID();

    }

    addItem(newItem) {
        this.#itemList.push(newItem)
    }
    removeItem(index) {
        this.#itemList.splice(index, 1)
    }

    get itemList() {
        return [...this.#itemList]
    }

    get complete() {
        return this._complete
    }

    set complete(val) {
        if (val != true && val != false) {
            throw new Error("Need a value of true or false")
        }
        this._complete = val;
    }

    get name() {
        return this._name
    }

    set name(val) {
        if (val === undefined || typeof (val) != 'string' || val.length < 1) {
            throw new Error("Needs name and name needs to be a string of at least 1 character.")
        }
        this._name = val;
    }

    get id() {
        return this.#id;
    }
}

const newProject = (name) => {
    if (name === undefined || typeof (name) != 'string' || name.length < 1) {
        throw new Error("Needs name and name needs to be a string of at least 1 character.")
    }
    const proj = new Project(name)
    return proj
}

export { newProject }