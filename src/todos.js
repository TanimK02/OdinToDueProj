class Item {
    #id
    constructor(title, dueDate, description = null, priority) {
        if (title === undefined || dueDate === undefined) {
            throw new Error('Need at least a title and due date.')
        }
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._completed = false;
    }

    get title() {
        return this._title
    }

    set title(replacement) {
        if (replacement.length < 1) {
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
        if (num < 0) {
            throw new Error("Needs to be at least 0")
        }
        this._priority = num;
    }

    setCompleted = () => {
        this._completed = !this._completed;
    }

    get completed() {
        return this._completed;
    }

    get dueDate() {
        return this._dueDate;
    }

    set dueDate(value) {
        {
            this._dueDate = value;
        }
    }
}

const makeNewTodo = (title, description = null, priority = 0) => {
    if (title === undefined) {
        return
    }
    const today = new Date();
    const dueDate = today.toISOString().split('T')[0];
    const todo = new Item(title, dueDate, description, priority)
    return todo
}

export { makeNewTodo, Item }