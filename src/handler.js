import { makeNewTodo, Item as ToDo } from "./todos";
import { newProject } from "./projects";

export default new class {
    constructor() {
        this._projects = []

    }

    getLength = () => {
        return this._projects.length
    }

    addProject = (name) => {
        const newProj = newProject(name);

        this._projects.push(newProj);

        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    loadProjects = () => {
        return [...this._projects]
    }

    getProjLength = (projInd) => {
        return this._projects[projInd].itemList.length;
    }

    findProjInd = (id) => {
        for (let i = 0; i < this._projects.length; i++) {
            if (this._projects[i].id == id) {
                return i
            }
        }
    }

    deleteProj = (projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        this._projects.splice(projInd, 1);
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    changeProjName = (name, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        this._projects[projInd].name = name;
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    makeTodo = (name, description = null, priority = 0) => {
        const newTodo = makeNewTodo(name, description, priority);
        return newTodo
    }

    addToDoToProj = (toDo, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (!(toDo instanceof ToDo)) {
            throw new Error('Has to be an inbuilt instance of a toDo object')
        }
        if (toDo.priority == 0) {
            toDo.priority = this._projects[projInd].itemList.length + 1;
        }
        this._projects[projInd].addItem(toDo)
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));

    }

    loadToDos = (projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        return this._projects[projInd].itemList;
    }

    findToDoInd = (toDoId, projInd) => {
        for (let j = 0; j < this._projects[projInd].itemList.length; j++) {
            if (this._projects[projInd].itemList[j].id == toDoId) {
                return j
            }
        }
    }

    delToDo = (toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        this._projects[projInd].removeItem(toDoInd, 1)
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    changeToDoTitle = (newTitle, toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        this._projects[projInd].itemList[toDoInd].title = newTitle;
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));

    }

    changeToDoDesc = (newDesc, toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        this._projects[projInd].itemList[toDoInd].desc = newDesc;
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));

    }

    changeToDoDueDate = (newDueDate, toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        if (!(newDueDate instanceof Date)) {
            throw new Error("Must be instance of date");
        }
        newDueDate = newDueDate.toISOString().split('T')[0];
        this._projects[projInd].itemList[toDoInd].dueDate = newDueDate;
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));

    }

    resetPriority = (projInd) => {
        const length = this.getProjLength(projInd);
        for (let i = 0; i < length; i++) {
            this._projects[projInd].itemList[i].priority = i + 1;
        }
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    changeToDoPriority = (newPriority, toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        const check = this._projects[projInd].itemList.findIndex(item => item.priority == newPriority)
        if (check != -1) {
            const prev = this._projects[projInd].itemList[check].priority;
            this._projects[projInd].itemList[check].priority = this._projects[projInd].itemList[toDoInd].priority;
            this._projects[projInd].itemList[toDoInd].priority = prev;
            [this._projects[projInd].itemList[check], this._projects[projInd].itemList[toDoInd]] = [this._projects[projInd].itemList[toDoInd], this._projects[projInd].itemList[check]]
            return
        }
        this._projects[projInd].itemList[toDoInd].priority = newPriority;
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

    changeCompleted = (toDoInd, projInd) => {
        if (projInd >= this._projects.length || projInd < 0) {
            throw new Error("Index must be between 0 and length of projects - 1")
        }
        if (toDoInd >= this._projects[projInd].length || toDoInd < 0) {
            throw new Error("Index must be between 0 and length of toDos in project - 1")
        }
        this._projects[projInd].itemList[toDoInd].setCompleted();
        localStorage.setItem('projects', JSON.stringify(this.loadProjects()));
    }

}();