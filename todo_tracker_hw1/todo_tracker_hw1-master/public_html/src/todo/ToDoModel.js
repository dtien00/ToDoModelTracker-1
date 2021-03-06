'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction.js'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction.js'
import ChangeDate_Transaction from './transactions/ChangeDate_Transaction.js'
import TaskChange_Transaction from './transactions/TaskChange_Transaction.js'
import StatusChange_Transaction from './transactions/StatusChange_Transaction.js'
import RemoveItem_Transaction from './transactions/RemoveItem_Transaction.js'


/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;

        
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName){
            newList.setName(initName);
        }
        
        this.toDoLists.unshift(newList);
        //Because we open a list, disable the add-list button
        // document.getElementById("add-list-button").disabled = true;
        // document.getElementById("add-list-button").style.cursor = "default";
        // document.getElementById("add-list-button").style.color = "#353a44";
        // document.getElementById("add-list-button").style.background = "#40454e";
        this.view.appendNewListToView(newList);
        this.view.refreshLists(this.toDoLists)
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId){
                listIndex = i;
                this.toDoLists[i].indexOfZero=false;
            }
        }
        if(listIndex==0){
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.toDoLists[0].indexOfZero = true;
            var decision = true;
            this.view.viewList(this.currentList);
            this.view.refreshLists(this.toDoLists, decision);
            //this.view.indexZeroSelectedFirst(this.currentList);
        }
        else if (listIndex > 0) {
            var tempList = this.toDoLists[listIndex];
            
            this.toDoLists.splice(listIndex, 1);
            this.toDoLists.unshift(tempList);
            this.currentList = tempList;
            
            this.toDoLists[0].setCurrentList();
            
            this.view.viewList(this.currentList);
            this.view.refreshLists(this.toDoLists);
        }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        // if(!this.tps.hasTransactionToRedo()){
        //     document.getElementById("redo-button").disabled = false;
        //     document.getElementById("redo-button").style.cursor = "default";
        //     document.getElementById("redo-button").style.color = "#353a44";
        //     document.getElementById("redo-button").style.background = "#40454e";
        // }
        // else{
        //     document.getElementById("redo-button").disabled = false;
        //     document.getElementById("redo-button").style.cursor = "pointer";
        //     document.getElementById("redo-button").style.color = "white";
        //     document.getElementById("redo-button").style.background = "#353a44";
        // }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        let txt = "";
        var confirmElement = confirm("Proceed with list deletion?");
        if (confirmElement == false) {
            txt = "You pressed Cancel!";
          } else {
            txt = "You pressed OK!";
          
            for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
                if (this.toDoLists[i].id === this.currentList.id) {
                    indexOfList = i;
                }
            }
            this.toDoLists.splice(indexOfList, 1);
            this.currentList = null;
            this.view.clearItemsList();
        }
        this.view.refreshLists(this.toDoLists);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
        if(!this.tps.hasTransactionToRedo()){
            document.getElementById("redo-button").disabled = true;
            document.getElementById("redo-button").style.cursor = "default";
            document.getElementById("redo-button").style.color = "#353a44";
            document.getElementById("redo-button").style.background = "#40454e";
        }
        else{
            document.getElementById("redo-button").disabled = false;
            document.getElementById("redo-button").style.cursor = "pointer";
            document.getElementById("redo-button").style.color = "white";
            document.getElementById("redo-button").style.background = "#353a44";
        }
        if(!this.tps.hasTransactionToUndo()){
            document.getElementById("undo-button").disabled = true;
            document.getElementById("undo-button").style.cursor = "default";
            document.getElementById("undo-button").style.color = "#353a44";
            document.getElementById("undo-button").style.background = "#40454e";
        }
        else{
            document.getElementById("undo-button").disabled = false;
            document.getElementById("undo-button").style.cursor = "pointer";
            document.getElementById("undo-button").style.color = "white";
            document.getElementById("undo-button").style.background = "#353a44";
        }
    }

    checkUndoRedoButtons(){
        this.checkRedoButton();
        this.checkUndoButton();
    }

    checkUndoButton(){
        if(!this.tps.hasTransactionToUndo()){
            document.getElementById("undo-button").disabled = true;
            document.getElementById("undo-button").style.cursor = "default";
            document.getElementById("undo-button").style.color = "#353a44";
            document.getElementById("undo-button").style.background = "#40454e";
        }
        else{
            document.getElementById("undo-button").disabled = false;
            document.getElementById("undo-button").style.cursor = "pointer";
            document.getElementById("undo-button").style.color = "white";
            document.getElementById("undo-button").style.background = "#353a44";
        }
    }
    checkRedoButton(){
        if(!this.tps.hasTransactionToRedo()){
            document.getElementById("redo-button").disabled = true;
            document.getElementById("redo-button").style.cursor = "default";
            document.getElementById("redo-button").style.color = "#353a44";
            document.getElementById("redo-button").style.background = "#40454e";
        }
        else{
            document.getElementById("redo-button").disabled = false;
            document.getElementById("redo-button").style.cursor = "pointer";
            document.getElementById("redo-button").style.color = "white";
            document.getElementById("redo-button").style.background = "#353a44";
        }
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 

    //Moves the element at the index in the specific itemList 'up'; swaps places with the one above it
    createItemUpTransaction(index){
        let formerIndex = new MoveItemUp_Transaction(this, index);
        this.tps.addTransaction(formerIndex);
        
    }

    moveItemUp(index){
        let targetList = this.toDoLists[0].items;
        let tempItem = targetList[index];
        targetList[index] = targetList[index-1];
        targetList[index-1] = tempItem;
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return index;

    }

    //Moves the element at the index in the specific itemList 'down'; swaps places with the one below it
    createItemDownTransaction(index){
        let formerIndex = new MoveItemDown_Transaction(this, index);
        this.tps.addTransaction(formerIndex);

        // let targetList = this.toDoLists[0].items;
        // let tempItem = targetList[index];
        // targetList[index] = targetList[index+1];
        // targetList[index+1] = tempItem;
        // this.view.viewList(this.toDoLists[0]);
        // this.view.refreshLists(this.toDoLists);
        // return index+1;
    }

    moveItemDown(index){
        let targetList = this.toDoLists[0].items;
        let tempItem = targetList[index];
        targetList[index] = targetList[index+1];
        targetList[index+1] = tempItem;
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return index+1;
    }

    createDateChangeTransaction(oldDate, newDate, index){
        let formerDate = new ChangeDate_Transaction(this, oldDate, newDate, index);
        this.tps.addTransaction(formerDate);
    }

    alterDate(index, date){
        let targetList = this.toDoLists[0].items;
        let tempItem = targetList[index];
        tempItem.setDueDate(date);
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return index;
    }

    createTaskChangeTransaction(oldtask, newtask, index){
        let taskTransaction = new TaskChange_Transaction(this, oldtask, newtask, index);
        this.tps.addTransaction(taskTransaction);
    }

    changeTask(task, index){
        let targetList = this.toDoLists[0].items;
        let tempItem = targetList[index];
        
        tempItem.setDescription(task);

        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return index;
    }

    //Creates new Transaction type for status changes
    createStatusChangeTransaction(oldStatus, newStatus, index){
        let statusTransaction = new StatusChange_Transaction(this, oldStatus, newStatus, index);
        this.tps.addTransaction(statusTransaction);
    }
    changeStatus(status, index){
        let targetList = this.toDoLists[0].items;
        let tempItem = targetList[index];
        
        tempItem.setStatus(status);

        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return index;
    }

    //Removes the element at the index
    createRemoveItemTransaction(item, index){
        let removeTransaction = new RemoveItem_Transaction(this, item, index);
        this.tps.addTransaction(removeTransaction);
    }
    //
    removeItem(index){
        let targetList = this.toDoLists[0].items;
        // let tempItem = targetList[index];
        targetList.splice(index, 1);
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        // let targetList = this.toDoLists[0].items;
        // for(let i = 0; i<targetList.length; i++){
        //     if(targetList[i].id = itemToRemove.id)
        //         targetList.splice(itemToRemove,1);
        // }
        return index;
    }
    removeLastItem(){
        let targetList = this.toDoLists[0].items;
        targetList.splice(targetList.length-1, 1);
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        // return itemToRemove;
    }
    addRemovedItem(item, index){
        this.toDoLists[0].items.splice(index, 0, item);
        this.view.viewList(this.toDoLists[0]);
        this.view.refreshLists(this.toDoLists);
        return item;
    }

    exitCurrentList(){
        this.view.clearItemsList();
        let listElement = document.getElementById("todo-list-" + this.toDoLists[0].id);
        listElement.style.color = "white";
        listElement.style.background = "#353a44";
        this.toDoLists.unshift(new ToDoList(0));
        this.toDoLists.splice(0,1);
        this.view.refreshLists(this.toDoLists);
        this.enableAddNewListButton();
    }

    disableAddNewListButton(){
        // document.getElementById("add-list-button").onmousedown = null;
        document.getElementById("add-list-button").style.cursor = "default";
        document.getElementById("add-list-button").style.color = "#353a44";
        document.getElementById("add-list-button").style.background = "#40454e";
    }
    enableAddNewListButton(){
        // document.getElementById("add-list-button").onmousedown = function(initName) {
        //     let newList = new ToDoList(this.nextListId++);
        //     if (initName){
        //         newList.setName(initName);
        //     }
        //     this.toDoLists.unshift(newList);
        //     this.view.appendNewListToView(newList);
        //     console.log("APPENDING");
        //     this.view.refreshLists(this.toDoLists)
        //     return newList;
        // };
        document.getElementById("add-list-button").style.cursor = "pointer";
        document.getElementById("add-list-button").style.color = "white";
        document.getElementById("add-list-button").style.background = "#353a44";
    }

}