'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList, decision) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        if(newList.indexOfZero==true){
            listElement.style.background = "#40454e";
            listElement.style.color = "#ffc819";
            if(decision==true){
                listElement.contentEditable = true;
            }
        }
        else if(newList.indexOfZero==false){
            listElement.style.background = "#353a44";
        }
        listElement.onblur = function (){
            listElement.contentEditable = false;
            if(listElement.innerText==null || listElement.innerText==="")
                    listElement.innerText="Unknown";
            // if(decision==true){
            //     listsElement.replaceChild(listElement, zerothFirstElement);
            // }

        }
        listElement.onclick = function (){
            listElement.contentEditable = true;
            listElement.style.background = "#40454e";
        }
        listElement.addEventListener("keydown", (e) => {
            listElement.style.background = "#353a44";
            if(e.keyCode === 13){
                listElement.blur();
            }
        });
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            
            //Because we open a list, disable the add-list button
            // thisController.createDisableAddList(true);
            document.getElementById("add-list-button").style.cursor = "default";
            document.getElementById("add-list-button").style.color = "#353a44";
            document.getElementById("add-list-button").style.background = "#40454e";
            thisController.handleLoadList(newList.id);
        }
    }

    indexZeroSelectedFirst(firstList) {
    }

    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists, decision) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";
        for (let i = 0; i < lists.length; i++) {
            if(i>0)
                lists[i].indexOfZero = false;
            let list = lists[i];
            this.appendNewListToView(list, decision);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // thisController.createDisableAddList();

        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");
        list.ondblclick = function(){
            list.contentEditable = true;
        }
        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        let thisController = this.controller;
        //After cleaning the slate, rebuild it:

        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];
            //Creation of the To Do List in the left sidebar
            let listItemElement = document.createElement("div");
            listItemElement.setAttribute("id", "todo-list-item-" + listItem.id);
            listItemElement.setAttribute("class", "list-item-card");

            //Creation of the task column
            let taskElement = document.createElement("div");
            taskElement.setAttribute("class", "task-col");
            taskElement.setAttribute("id", "task-text-" + listItem.id);
            taskElement.innerHTML = listItem.description;
            let oldTask = null;
            taskElement.onclick = function() {
                taskElement.contentEditable = true;
                oldTask = taskElement.innerHTML;
            }
            taskElement.onblur = function(){
                if(taskElement.innerText==null || taskElement.innerText=="")
                taskElement.innerText="Unknown: Please assign a task";
                var newTask = taskElement.innerHTML
                thisController.createTaskChangeTransaction(oldTask, newTask, i);
            }
            taskElement.addEventListener("keydown", (e) => {
                if(e.keyCode === 13){
                    taskElement.blur();
                }
            });
            
            //taskElement.appendChild(taskInputElement);

            listItemElement.appendChild(taskElement);

            //Creation of the due date column
            let dueDateElement = document.createElement("div");
            dueDateElement.setAttribute("class", "due-date-col");
            dueDateElement.setAttribute("id", "due-date-div-" + listItem.id)
            dueDateElement.innerHTML = listItem.dueDate;
            let dueDateInputElement = document.createElement("input");
            dueDateInputElement.setAttribute("id", "due-date-input-" + listItem.id);
            dueDateInputElement.type = "date";
            dueDateInputElement.style.color = "white";
            dueDateInputElement.style.background = "#353a44";
            dueDateInputElement.value = listItem.dueDate;
            let oldDate = null;
            //dueDateElement.appendChild(dueDateInputElement);
            dueDateElement.onclick = function() {
                dueDateElement.contentEditable = true;
                oldDate = listItem.getDueDate();
                listItemElement.replaceChild(dueDateInputElement, dueDateElement);
            }
            dueDateInputElement.onblur = function(){
                dueDateElement.contentEditable = false;
                var newDate = dueDateInputElement.value;
                dueDateInputElement.value = newDate;
                listItem.setDueDate(newDate);
                listItemElement.replaceChild(dueDateElement, dueDateInputElement);
                dueDateElement.innerHTML = newDate;
                thisController.createDateChangeTransaction(oldDate, newDate, i);

            }
            listItemElement.appendChild(dueDateElement);

            
            //Creation of the status column: Let it be a dropdown 
            let statusElement = document.createElement("div");
            statusElement.setAttribute("class", "status-col");
            statusElement.setAttribute("id", "todo-list-item-status-" + listItem.id);
            statusElement.innerHTML+=listItem.status;
            if(statusElement.innerText=="complete"){
                statusElement.style.color = "#8ed4f8";
            }
            else if(statusElement.innerText=="incomplete"){
                statusElement.style.color = "#fca234";
            }

            //Creating option elements for dropdown to choose from; complete or incomplete
            let statusOptionsElement = document.createElement("select");
            
            statusOptionsElement.setAttribute("id", "todo-list-item-status-options-" + listItem.id);

            //Options: complete and incomplete
            let completeStatusElement = document.createElement("option");
            completeStatusElement.setAttribute("value", "complete");
            completeStatusElement.innerHTML = "complete";
            statusOptionsElement.appendChild(completeStatusElement);
            let incompleteStatusElement = document.createElement("option");
            incompleteStatusElement.setAttribute("value", "incomplete");
            incompleteStatusElement.innerHTML = "incomplete";
            statusOptionsElement.appendChild(incompleteStatusElement);
            let originalStatus = null;
            statusOptionsElement.style.background = "#353a44";
            statusOptionsElement.style.color = "white";
            statusElement.onclick = function(){
                originalStatus = listItem.getStatus();  //Original status before change
                listItemElement.replaceChild(statusOptionsElement, statusElement);
                statusOptionsElement.focus();

                statusOptionsElement.onblur = function(){
                    listItemElement.replaceChild(statusElement, statusOptionsElement);
                    statusElement.innerText = statusOptionsElement.value;
                    if(statusElement.innerText=="complete"){
                        statusElement.style.color = "#8ed4f8";
                    }
                    else if(statusElement.innerText=="incomplete"){
                        statusElement.style.color = "#fca234";
                    }
                    thisController.createStatusChangeTransaction(originalStatus, statusElement.innerText, i);
                }
                
                statusElement.onblur = function(){
                    statusElement.innerText = statusOptionsElement.value;
                    listItemElement.replaceChild(statusElement, statusOptionsElement);
                }
            
                statusElement.blur();
            }

            statusOptionsElement.style.border = "none";
            
            listItemElement.appendChild(statusElement);

            //Function to be used for up and down buttons to swap element IDS
            

            //Creates a space for all the buttons
            let listButtonElements = document.createElement("div");
            listButtonElements.setAttribute("class", "button-group");
            listButtonElements.setAttribute("id", "button-group-" + listItem.id);

            //Create the move-up button
            let moveUpButtonElement = document.createElement("button");
            moveUpButtonElement.setAttribute("id", "up-button-" + listItem.id)
            moveUpButtonElement.setAttribute("class", "table-entry-button");
            var moveUpButtonImage = document.createElement("i");
            moveUpButtonImage.className = "material-icons";
            moveUpButtonImage.innerHTML = "keyboard_arrow_up";

            //Function when up button is clicked
            moveUpButtonElement.onclick = function(){
                if(i!=0){
                    thisController.createItemUpTransaction(i);
                }
            }
            
            //If this element is at the top, disable the click function
            if(i==0){
                moveUpButtonElement.style.cursor = "default";
                moveUpButtonElement.style.color = "#353a44";
                moveUpButtonElement.disabled = true;
            }
            else{
                // moveUpButtonElement.style.cursor = "pointer";
                // moveUpButtonElement.style.color = "#d9d6cc";
                moveUpButtonElement.disabled = false;
            }
            //Combines the image with the button
            moveUpButtonElement.appendChild(moveUpButtonImage);


            //Create the move-down button
            let moveDownButtonElement = document.createElement("button");
            moveDownButtonElement.setAttribute("class", "table-entry-button");
            var moveDownButtonImage = document.createElement("i");
            moveDownButtonImage.className = "material-icons";
            moveDownButtonImage.innerHTML = "keyboard_arrow_down";

            //Combines the image with the button
            moveDownButtonElement.appendChild(moveDownButtonImage);

            //If this element is at the bottom, disable the click function
            if(i==list.items.length-1){
                moveDownButtonElement.style.cursor = "default";
                moveDownButtonElement.style.color = "#353a44";
                moveDownButtonElement.disabled = true;
            }
            else{
                // moveDownButtonElement.style.cursor = "pointer";
                // moveDownButtonElement.style.color = "#d9d6cc";
                moveDownButtonElement.disabled = false;
            }

            //Function when down button is clicked
            moveDownButtonElement.onclick = function(){
                thisController.createItemDownTransaction(i);
            }

            //Create the delete button
            let deleteItemButtonElement = document.createElement("button");
            deleteItemButtonElement.setAttribute("class", "table-entry-button");
            var deleteItemButtonImage = document.createElement("i");
            deleteItemButtonImage.className = "material-icons";
            deleteItemButtonImage.innerHTML = "close";

            //Combines the image with the button
            deleteItemButtonElement.appendChild(deleteItemButtonImage);

            //Function when delete button is clicked
            deleteItemButtonElement.onclick = function(){
                thisController.createRemoveListItemTransaction(listItem, i);
            }

            //Adds up button to the list button elements
            listButtonElements.appendChild(moveUpButtonElement);
            //Adds down button to the list button elements
            listButtonElements.appendChild(moveDownButtonElement);
            //Adds delete button to the list button elements
            listButtonElements.appendChild(deleteItemButtonElement);
            //Adds all buttons to the listElement
            listItemElement.appendChild(listButtonElements);

            /*// NOW BUILD ALL THE LIST ITEMS
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