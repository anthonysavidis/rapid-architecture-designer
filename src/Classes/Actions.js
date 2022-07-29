import { appearComponentButtons, appearEditButtons, appearFunctionButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";

class ActionHolder {
    constructor() {
        this.commands = [];
        this.undoStack = [];
        this.redoStack = [];
    }
    emptyRedoStack() {
        this.redoStack = [];
    }
    saveCommand(actionExecuted, inverseAction, originalItem, changedItem) {
        this.commands.push({
            action: actionExecuted,
            inverse: inverseAction,
            actionItems: {
                initialItem: originalItem,
                updatedItem: changedItem
            }
        });
        this.undoStack.push(this.commands[this.commands.length - 1]); //only undo stack needed 
        // this.redoStack.push(actionExecuted); 
        this.emptyRedoStack();
    }
    undo() {
        var lastUndoCommand = this.undoStack.pop();
        this.redoStack.push(lastUndoCommand);
        if (!lastUndoCommand)
            return;
        lastUndoCommand.inverse(lastUndoCommand.actionItems);
        return;
    }
    redo() {
        var lastRedoCommand = this.redoStack.pop();
        this.undoStack.push(lastRedoCommand);
        if (!lastRedoCommand)
            return;
        lastRedoCommand.action(lastRedoCommand.actionItems);
        return;
    }
}
var actions = new ActionHolder();

function undoAction() {
    if (actions.undoStack.length >= 1) {
        actions.undo();
        // if (document.getElementById("Edit").style.display === "block")
        appearEditButtons();
        appearComponentButtons();
        appearFunctionButtons();
    }
}

function redoAction() {
    if (actions.redoStack.length >= 1) {
        actions.redo();
        // if (document.getElementById("Edit").style.display === "block")
        appearEditButtons();
        appearComponentButtons();
        appearFunctionButtons();
    }
}



export { actions, undoAction, redoAction };