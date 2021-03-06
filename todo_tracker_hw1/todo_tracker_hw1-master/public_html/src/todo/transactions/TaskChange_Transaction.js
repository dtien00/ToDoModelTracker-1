'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class TaskChange_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldTask, newTask, index) {
        super();
        this.model = initModel;
        this.oldTask = oldTask;
        this.newTask = newTask;
        this.itemIndex = index;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.changeTask(this.newTask, this.itemIndex);
    }

    undoTransaction() {
        this.model.changeTask(this.oldTask, this.itemIndex);
    }
}