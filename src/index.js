import './styles.css'
import checkPic from './assets/check-svgrepo-com.svg'
import trashPic from './assets/trash-can-svgrepo-com-2.svg'
import handler from './handler'
import editPic from './assets/three-dots-vertical-svgrepo-com.svg'
import backPic from './assets/back-arrow-svgrepo-com.svg'
class DomHandler {
    constructor(requiredHandler) {
        this.handler = requiredHandler;
    }
    loadProjects(document) {
        const projects = this.handler.loadProjects();
        const projectList = document.getElementById("projectList");
        projectList.innerText = "";
        for (let i = 0; i < projects.length; i++) {

            let li = document.createElement('li');
            li.style.cursor = "pointer";
            li.classList.add("projectListItem");
            li.innerText = projects[i].name;

            const index = i;
            li.addEventListener("click", () => {
                this.loadInProject(document, index)
            })
            projectList.appendChild(li);
        }
    }
    loadInProject(document, projInd) {
        const projInfo = document.getElementById("projectInfo");
        projInfo.innerText = "";
        const projects = this.handler.loadProjects();
        this.loadTodos(document, projInd);
        const projectH2 = document.createElement("h2")
        projectH2.innerText = projects[projInd].name;
        projectH2.dataset.id = projects[projInd].id;
        projectH2.id = "toDosProjName";
        projInfo.appendChild(projectH2);
        projectH2.style.textAlign = "start";
        projectH2.style.marginLeft = "1rem";
        const editButton = this.getEditButton(document, projInd, projInfo, projectH2);
        projInfo.appendChild(editButton);
    }

    projEditor(document, projInfo, projectH2, editButton, projInd) {
        projInfo.removeChild(projectH2);
        projInfo.removeChild(editButton);
        const newName = document.createElement("input");
        newName.classList.add("projectListInput");
        newName.type = "input";
        newName.value = projectH2.innerText;
        const btnDivs = document.createElement("div");
        btnDivs.style.display = "flex";
        const checkBtn = document.createElement("button");
        checkBtn.classList.add("checkBtn");
        const backBtn = document.createElement("button");
        backBtn.classList.add("delBtn");
        const checkBtnImg = document.createElement("img");
        checkBtnImg.src = checkPic;
        checkBtnImg.style.width = "20px";
        checkBtn.style.marginLeft = "1rem";
        checkBtn.appendChild(checkBtnImg);
        const backBtnImg = document.createElement("img");
        backBtnImg.src = backPic;
        backBtnImg.style.width = "20px";
        backBtn.appendChild(backBtnImg);
        btnDivs.appendChild(checkBtn);
        btnDivs.appendChild(backBtn);
        projInfo.appendChild(newName);
        projInfo.appendChild(btnDivs);
        newName.focus();
        const takeBack = () => {
            projInfo.removeChild(newName);
            projInfo.removeChild(btnDivs);
            projInfo.appendChild(projectH2);
            projInfo.appendChild(editButton);
            backBtn.removeEventListener("click", takeBack)
        }
        backBtn.addEventListener("click", takeBack)
        const submitEditProj = () => {
            this.handler.changeProjName(newName.value, projInd);
            this.loadProjects(document);
            this.loadInProject(document, projInd);
            checkBtn.removeEventListener("click", submitEditProj);
        }
        checkBtn.addEventListener("click", submitEditProj)
    }

    getEditButton(document, projInd, projInfo, projectH2) {
        const editButton = document.createElement("button");
        editButton.classList.add("editButton");
        const editImg = document.createElement("img");
        editImg.src = editPic;
        editButton.appendChild(editImg);

        const handleEdit = (event) => {
            event.stopPropagation();
            const existingUl = document.getElementById(`projUl-${projInd}`);
            if (existingUl) {
                existingUl.remove();
                return;
            }

            const newUl = document.createElement("ul");
            newUl.id = `projUl-${projInd}`;
            newUl.classList.add("editWindowToDo");

            const editLi = document.createElement("li");
            editLi.classList.add("editLi");
            editLi.innerText = "Edit";
            editLi.addEventListener("click", () => {
                this.projEditor(document, projInfo, projectH2, editButton, projInd);
            });

            const delLi = document.createElement("li");
            delLi.classList.add("delLi");
            delLi.innerText = "Delete";
            delLi.addEventListener("click", () => {
                this.deleteProj(projInd);
                const projs = this.handler.getLength();
                if (projs == 0) {
                    this.addProject("Default");
                    this.makeToDo("First Task", "Make a new project, make a new task, edit it, delete it, do whatever you want with it.", 0, 0);
                }
                this.loadProjects(document);
                this.loadInProject(document, 0);
            })
            newUl.appendChild(editLi);
            newUl.appendChild(delLi);
            document.body.appendChild(newUl);

            const rect = editButton.getBoundingClientRect();
            newUl.style.left = `${rect.left}px`;
            newUl.style.top = `${rect.bottom + window.scrollY}px`;

            document.addEventListener("click", function handleClick(e) {
                if (e.target.id !== `projUl-${projInd}` && e.target !== editImg) {
                    const target = document.getElementById(`projUl-${projInd}`);
                    if (target) {
                        document.removeEventListener("click", handleClick);
                        target.remove();
                    }
                }
            });
        };

        editButton.addEventListener("click", handleEdit);
        return editButton
    }
    addProject(name) {
        try {
            this.handler.addProject(name)
            return true
        }
        catch (error) {
            alert(error)
            return false
        }
    }

    loadTodos(document, projInd) {
        const toDo = this.handler.loadToDos(projInd);
        toDo.sort((a, b) => a.priority - b.priority);

        const toDoList = document.getElementById("toDoList");
        toDoList.innerText = "";

        toDo.forEach((item, index) => {
            const li = this.createToDoItem(item, index, toDo.length, projInd, document);
            toDoList.appendChild(li);
        });
    }

    createToDoItem(item, index, length, projInd, document) {
        const li = document.createElement('li');
        li.classList.add("andNotes");

        const priorityLabel = document.createElement("h2");
        priorityLabel.classList.add("priorityH2");
        priorityLabel.innerText = `#${index + 1}`;
        li.appendChild(priorityLabel);

        const sepDivContainer = document.createElement("div");
        sepDivContainer.classList.add("sepDivContainer");

        const { container: firstSepDiv, content: titleDiv } = this.createSection("Task: ", item.title);
        const { container: secondSepDiv, content: notesDiv } = this.createSection("Notes: ", item.description);
        const { container: thirdSepDiv, content: dueDiv } = this.createSection("Due: ", item.dueDate);

        sepDivContainer.appendChild(firstSepDiv);
        sepDivContainer.appendChild(secondSepDiv);
        sepDivContainer.appendChild(thirdSepDiv);
        li.appendChild(sepDivContainer);

        const editButton = this.createEditButton(index, projInd, li, sepDivContainer, firstSepDiv, secondSepDiv, thirdSepDiv, titleDiv, notesDiv, dueDiv, item, document);
        li.appendChild(editButton);

        firstSepDiv.querySelector("h2").addEventListener("click", () => this.toggleExpand(titleDiv, notesDiv, li));
        secondSepDiv.querySelector("h2").addEventListener("click", () => this.toggleExpand(notesDiv, titleDiv, li));

        return li;
    }

    deleteToDo(projInd, toDoInd) {
        this.handler.delToDo(toDoInd, projInd);
        this.handler.resetPriority(projInd);
    }

    deleteProj(projInd) {
        this.handler.deleteProj(projInd);
    }

    createSection(label, contentText) {
        const container = document.createElement("div");
        container.classList.add("projLiSep");

        const h2 = document.createElement("h2");
        h2.innerText = label;

        const content = document.createElement("div");
        content.classList.add("notes");
        content.innerText = contentText;

        container.appendChild(h2);
        container.appendChild(content);

        return { container, content };
    }

    toggleExpand(target, other, li) {
        if (target.style.maxHeight === "none") {
            target.style.maxHeight = "1rem";
            if (other.style.maxHeight === "1rem") {
                li.style.alignItems = "center";
            }
        } else {
            target.style.maxHeight = "none";
            li.style.alignItems = "start";
        }
    }

    createEditButton(index, projInd, li, sepDivContainer, firstSepDiv, secondSepDiv, thirdSepDiv, title, notes, due, item, document) {
        const editButton = document.createElement("button");
        editButton.classList.add("editButton");
        const editImg = document.createElement("img");
        editImg.src = editPic;
        editButton.appendChild(editImg);

        const handleEdit = (event) => {
            event.stopPropagation();
            const existingUl = document.getElementById(`toDoUl-${projInd}-${index}`);
            if (existingUl) {
                existingUl.remove();
                return;
            }

            const newUl = document.createElement("ul");
            newUl.id = `toDoUl-${projInd}-${index}`;
            newUl.classList.add("editWindowToDo");

            const editLi = document.createElement("li");
            editLi.classList.add("editLi");
            editLi.innerText = "Edit";
            editLi.addEventListener("click", () => {
                this.activateEditMode(li, sepDivContainer, firstSepDiv, secondSepDiv, thirdSepDiv, title, notes, due, index, projInd, item);
            });

            const delLi = document.createElement("li");
            delLi.classList.add("delLi");
            delLi.innerText = "Delete";

            delLi.addEventListener("click", () => {
                const originalToDos = this.handler.loadToDos(projInd);
                const actualIndex = originalToDos.findIndex(t => t.title === item.title && t.description === item.description);

                if (actualIndex !== -1) {
                    this.deleteToDo(projInd, actualIndex);
                    this.loadTodos(document, projInd);

                }
            })
            newUl.appendChild(editLi);
            newUl.appendChild(delLi);
            editButton.appendChild(newUl);

            const rect = editButton.getBoundingClientRect();
            const rect2 = newUl.getBoundingClientRect();
            newUl.style.left = `${rect.left - rect2.width + 7}px`;

            document.addEventListener("click", function handleClick(e) {
                if (e.target.id !== `toDoUl-${projInd}-${index}` && e.target !== editImg) {
                    const target = document.getElementById(`toDoUl-${projInd}-${index}`);
                    if (target) {
                        document.removeEventListener("click", handleClick);
                        target.remove();
                    }
                }
            });
        };

        editButton.addEventListener("click", handleEdit);
        return editButton;
    }

    activateEditMode(li, sepDivContainer, firstSepDiv, secondSepDiv, thirdSepDiv, title, notes, due, index, projInd, item) {
        li.removeChild(li.querySelector(".editButton"));
        li.style.gridTemplateColumns = "30px 1fr 60px";

        const priorityDiv = document.createElement("div");
        priorityDiv.classList.add("priorityDiv");

        const priorityLabelEl = document.createElement("label");
        priorityLabelEl.innerText = "Priority: ";
        priorityLabelEl.htmlFor = `priority-${index}`;

        const priorityInput = document.createElement("select");
        priorityInput.id = `priority-${index}`;
        for (let j = 0; j < this.handler.loadToDos(projInd).length; j++) {
            const option = document.createElement("option");
            option.value = j + 1;
            option.innerText = j + 1;
            priorityInput.appendChild(option);
        }
        priorityInput.value = item.priority;

        priorityDiv.appendChild(priorityLabelEl);
        priorityDiv.appendChild(priorityInput);
        sepDivContainer.appendChild(priorityDiv);

        const newDiv = document.createElement("div");
        newDiv.classList.add("projConfirmationButtons");
        newDiv.innerHTML = `<div class="checkBtn"><img id="tEditConfirm" style="width: 20px;"></div>
                        <div class="delBtn"><img id="tEditBack" style="width: 20px;"></div>`;
        li.appendChild(newDiv);

        const check = document.getElementById("tEditConfirm");
        const back = document.getElementById("tEditBack");
        check.src = checkPic;
        back.src = backPic;

        firstSepDiv.removeChild(firstSepDiv.children[1]);
        secondSepDiv.removeChild(secondSepDiv.children[1]);
        thirdSepDiv.removeChild(thirdSepDiv.children[1]);

        const newTitle = document.createElement("input");
        newTitle.value = title.innerText;
        newTitle.classList.add("newTitle");

        const newNotes = document.createElement("textarea");
        newNotes.value = notes.innerText;
        newNotes.classList.add("newNotes");

        const newDate = document.createElement("input");
        newDate.type = 'date';
        newDate.style.maxHeight = "1rem";


        firstSepDiv.appendChild(newTitle);
        secondSepDiv.appendChild(newNotes);
        thirdSepDiv.appendChild(newDate);
        check.addEventListener("click", () => {
            const originalToDos = this.handler.loadToDos(projInd);
            const actualIndex = originalToDos.findIndex(t => t.title === item.title && t.description === item.description);

            if (actualIndex !== -1) {
                this.handler.changeToDoDesc(newNotes.value, actualIndex, projInd);
                this.handler.changeToDoTitle(newTitle.value, actualIndex, projInd);
                this.handler.changeToDoPriority(Number(priorityInput.value), actualIndex, projInd);
                this.handler.changeToDoDueDate(new Date(newDate.value), actualIndex, projInd);
                this.loadTodos(document, projInd);
            }
        });

        back.addEventListener("click", () => {
            this.loadTodos(document, projInd);
        });
    }


    makeToDo(name, description, priority, projInd) {
        try {

            const toDo = this.handler.makeTodo(name, description, priority);
            this.handler.addToDoToProj(toDo, projInd);
            return true
        }
        catch (error) {
            alert(error)
            return false
        }
    }


    injectProjectInput(document) {
        if (document.getElementById("projInputLi")) {
            return
        }
        const projectList = document.getElementById("projectList");
        const li = document.createElement('li');
        li.id = "projInputLi";
        const input = document.createElement('input');
        li.classList.add("projectListItem");
        input.placeholder = "Project Name";
        li.appendChild(input);
        const projConfirmationButtons = document.createElement('div');
        projConfirmationButtons.classList.add("projConfirmationButtons");
        const checkBtn = document.createElement('div');
        checkBtn.addEventListener("click", () => {
            const val = input.value;
            const result = this.addProject(val);

            if (result) {
                this.loadProjects(document)
                const length = this.handler.getLength();
                this.loadInProject(document, length - 1)
            }
        })
        checkBtn.classList.add("checkBtn");
        const checkImg = document.createElement("img");
        checkImg.style.width = "20px";
        checkImg.src = checkPic;
        checkBtn.appendChild(checkImg);
        const delBtn = document.createElement('div');
        delBtn.classList.add("delBtn");
        const trashImg = document.createElement('img');
        trashImg.style.width = "20px";
        trashImg.src = trashPic;
        delBtn.appendChild(trashImg);
        projConfirmationButtons.appendChild(checkBtn);
        projConfirmationButtons.appendChild(delBtn);
        li.appendChild(projConfirmationButtons);
        delBtn.addEventListener("click", () => { li.remove() });
        projectList.prepend(li);
    }

    injectToDoInput(document) {
        if (document.getElementById("toDoInputLi")) {
            return
        }
        const toDoList = document.getElementById("toDoList");
        const li = document.createElement('li');
        li.style.gridTemplateColumns = "1fr 60px";
        li.style.columnGap = "1rem";
        li.id = "toDoInputLi"
        li.classList.add("projectListItem", "andNotes")
        li.innerHTML = `<div class="inputDiv">
                       <input id="toDoInput" type="text" placeholder="What do you need done?">
                      <textarea id="textAreaInput" placeholder="Notes"></textarea>
                  </div>
                  <div class="projConfirmationButtons" style="margin-right: 7px;">
                      <div class="checkBtn"><img id="projCheckBtn" style="width: 20px;"></div>
                      <div class="delBtn"><img id="projDelBtn" style="width: 20px;"></div>
                  </div>`
        toDoList.prepend(li);
        const checkBtn = document.getElementById("projCheckBtn");
        checkBtn.src = checkPic;
        const delBtn = document.getElementById("projDelBtn");
        delBtn.src = trashPic;
        delBtn.addEventListener("click", () => {
            li.remove()
        });
        checkBtn.addEventListener("click", () => {
            const id = document.getElementById("toDosProjName").dataset.id;
            const ind = this.handler.findProjInd(id);
            const name = document.getElementById("toDoInput").value;
            const notes = document.getElementById("textAreaInput").value;
            this.makeToDo(name, notes, 0, ind);
            this.loadTodos(document, ind);
        })

    }

    start(document) {
        if (!document) {
            throw new Error("needs a document");
        }
        if (localStorage.getItem('projects')) {
            const projects = JSON.parse(localStorage.getItem('projects'));
            for (let i = 0; i < projects.length; i++) {
                this.handler.addProject(projects[i]._name);
                for (let j = 0; j < projects[i]._itemList.length; j++) {
                    this.makeToDo(projects[i]._itemList[j]._title, projects[i]._itemList[j]._description, projects[i]._itemList[j]._priority, i);
                }
            }
        }
        let length = this.handler.getLength();
        if (length == 0) {
            this.addProject("Default");
            this.makeToDo("First Task", "Make a new project, make a new task, edit it, delete it, do whatever you want with it.", 0, 0);
        }
        length = this.handler.getLength();
        this.loadProjects(document);
        this.loadInProject(document, 0);
        this.projectAddButton = document.getElementById("projectAddButton");
        this.toDoAddButton = document.getElementById("toDoAddButton");
        this.projectAddButton.addEventListener("click", () => {
            this.injectProjectInput(document);
        })
        this.toDoAddButton.addEventListener("click", () => {
            if (!document.getElementById("toDosProjName").dataset.id) {
                return
            }
            this.injectToDoInput(document);
        })

    }
}

const domH = new DomHandler(handler);
domH.start(document);
