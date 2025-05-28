class Project {

    constructor(name) {
        if (name === undefined || typeof (name) != 'string' || name.length < 1) {
            throw new Error("Needs name and name needs to be a string of at least 1 character.")
        }
        this._name = name;
        this._itemList = [];
        this._complete = false;
        this._id = crypto.randomUUID();
        this.dueDate;
    }

    addItem(newItem) {
        this._itemList.push(newItem)
    }
    removeItem(index) {
        this._itemList.splice(index, 1)
    }

    get itemList() {
        return [...this._itemList]
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
        return this._id;
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