import { makeNewTodo, Item as ToDo } from "./todos";
import { newProject } from "./projects";

class Handler {
    constructor() {
        this._projects = []
    }

    addProject = (name) => {
        if (name === undefined || typeof (name) != 'string' || name.length < 1) {
            throw new Error("Needs name and name needs to be a string of at least 1 character.")
        }
        const newProj = newProject(name);

        this._projects.push(newProj);


    }

    findProjInd = (id) => {
        for (let i = 0; i < this._projects.length; i++) {
            if (this._projects[i].id == id) {
                return i
            }
        }
    }

    deleteProj = (id) => {
        const projInd = this.findProjInd(id);
        this._projects.splice(projInd, 1);
    }

    changeProjName = (name, id) => {
        if (name === undefined || typeof (name) != 'string' || name.length < 1) {
            throw new Error("Needs name and name needs to be a string of at least 1 character.")
        }
        const projInd = this.findProjInd(id);
        this._projects[projInd].name = name;
    }

    makeTodo = (name, dueDate, description = null, priority = 3) => {
        if (name === undefined || dueDate === undefined) {
            throw new Error('Need at least a title and due date.')
        }
        const newTodo = makeNewTodo(name, dueDate, description, priority);
        return newTodo
    }

    addToDoToProj = (toDo, projId) => {
        if (!(toDo instanceof ToDo)) {
            throw new Error('Has to be an inbuilt instance of a toDo object')
        }
        const projInd = this.findProjInd(projId);
        this._projects[projInd].push(toDo);

    }

    findToDoInd = (toDoId, projInd) => {
        for (let j = 0; j < this._projects[projInd].itemList.length; j++) {
            if (this._projects[projInd].itemList[j].id == toDoId) {
                return j
            }
        }
    }

    delToDo = (toDoId, projId) => {
        const projInd = this.findProjInd(projId);
        const toDoInd = this.findToDoInd(toDoId, projInd)
        this._projects[projInd].itemList.splice(toDoInd, 1)
    }
}