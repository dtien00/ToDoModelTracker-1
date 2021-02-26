'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];

            let listItemElement = document.createElement("div");
            listItemElement.setAttribute("id", "todo-list-item-" + listItem.id);
            listItemElement.setAttribute("class", "list-item-card");
            
            let taskElement = document.createElement("div");
            taskElement.setAttribute("class", "task-col");
            taskElement.innerHTML+=listItem.description;

            taskElement.ondblclick = function() {
                taskElement.contentEditable = true;
            }
            taskElement.onblur = function(){
                console.log("Exited task");
                if(taskElement.innerText==null || taskElement.innerText=="")
                    taskElement.innerText="Unknown: Please assign a task";
            }
            taskElement.addEventListener("keydown", (e) => {
                if(e.keyCode === 13){
                    taskElement.blur();
                }
            });
            listItemElement.appendChild(taskElement);

            let dueDateElement = document.createElement("div");
            dueDateElement.setAttribute("class", "due-date-col");
            dueDateElement.setAttribute("type", "date");
            dueDateElement.innerHTML+=listItem.dueDate;
            dueDateElement.ondblclick = function() {
                dueDateElement.contentEditable = true;
            }
            listItemElement.appendChild(dueDateElement);

            let statusElement = document.createElement("div");
            statusElement.setAttribute("class", "status-col");
            statusElement.innerHTML+=listItem.status;
            statusElement.ondblclick = function() {
                statusElement.contentEditable = true;
            }
            listItemElement.appendChild(statusElement);



            /*/ NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div id='todo-list-task-'" + " class='task-col'>" + listItem.description + "</div>"
                                + "<div id="+"todo-list-due-date" + " class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div id="+"todo-list-status" + " class='status-col'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
            */
            itemsListDiv.appendChild(listItemElement);
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}