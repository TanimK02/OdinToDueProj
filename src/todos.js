class Item {
    #id
    constructor(title, dueDate, description = null, priority = 3) {
        if (title === undefined || dueDate === undefined) {
            throw new Error('Need at least a title and due date.')
        }
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._notes;
        this._checklist;
        this._completed = false;
        this.#id = crypto.randomUUID();
    }

    get title() {
        return this._title
    }

    set title(replacement) {
        if (replacement.length > 1) {
            throw new Error("Need at least 1 character")
        }
        this._title = replacement;
    }

    get description() {
        return this._description
    }

    set description(replacement) {
        if (typeof (replacement) !== 'string') {
            throw new Error("Description must be string")
        }
        this._description = replacement;
    }

    get priority() {
        return this._priority
    }

    set priority(num) {
        if (num < 1 && num > 3) {
            throw new Error("Needs to be 1,2, or 3")
        }
        this._priority = num;
    }

    set completed(val) {
        if (val != true && val != false) {
            throw new Error("Need a value of true or false")
        }
        this._completed = val;
    }

    get completed() {
        return this._completed;
    }

    get id() {
        return this.#id;
    }
}

const makeNewTodo = (title, dueDate, description = null, priority = 3) => {
    if (title === undefined || dueDate === undefined) {
        return
    }
    const todo = new Item(title, dueDate, description, priority)
    return todo
}

export { makeNewTodo, Item }