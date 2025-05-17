
class Item {
    constructor(title, description = null, dueDate, priority = 3) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes;
        this.checklist;
    }
}