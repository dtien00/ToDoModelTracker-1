'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;
        // this.transactions = this.initModel.getTransactionList();
        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
            appModel.checkUndoRedoButtons();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
            appModel.checkUndoRedoButtons();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.removeCurrentList();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }  
        document.getElementById("close-list-button").onmousedown = function() {
            // appModel.enableAddNewListButton(false);
            document.getElementById("add-list-button").style.cursor = "pointer";
            document.getElementById("add-list-button").style.color = "white";
            document.getElementById("add-list-button").style.background = "#353a44";
            appModel.exitCurrentList();
        }

    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        
        this.model.loadList(listId);
    }

    //Provides a way to connect the todoview class to the todomodel in order to move an item up
    createItemUpTransaction(index) {
        this.model.createItemUpTransaction(index);
        this.model.checkUndoRedoButtons();
    }
    //Provides a way to connect the todoview class to the todomodel in order to move an item down
    createItemDownTransaction(index) {
        this.model.createItemDownTransaction(index);
        this.model.checkUndoRedoButtons();
    }
    //Provides a way to revert to the old date
    createDateChangeTransaction(formerDate, newDate, index){
        this.model.createDateChangeTransaction(formerDate, newDate, index);
        this.model.checkUndoRedoButtons();
    }
    //Provides a way to revert data changes to task
    createTaskChangeTransaction(formerTask, newTask, index){
        this.model.createTaskChangeTransaction(formerTask, newTask, index);
        this.model.checkUndoRedoButtons();
    }
    //Provies a way to revert data changes to status
    createStatusChangeTransaction(oldStatus, newStatus, index){
        this.model.createStatusChangeTransaction(oldStatus, newStatus, index);
        this.model.checkUndoRedoButtons();
    }
    //Provides a way to connect the todoview class to the todomodel in order to remove an item
    createRemoveListItemTransaction(item, index) {
        this.model.createRemoveItemTransaction(item, index);
        this.model.checkUndoRedoButtons();
    }

    //Provides a way to disable the add new todo list
    createDisableAddList(decision){
        
        if(decision){document.getElementById("add-list-button").onmousedown = null;}
        else{appModel.addNewList();}
    }
}