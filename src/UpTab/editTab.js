import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { appearEditButtons } from "./tabAppearance/buttonsVisibility.js";

function initialAppear() {
    document.getElementById("undoButton").style.display = "block";
    document.getElementById("redoButton").style.display = "block";
}

var gridState = "off"

function gridTurnOn() {
    document.getElementById("body").className = "bodyDot";
    gridState = "on";
}

function gridTurnOff() {
    document.getElementById("body").className = "";
    gridState = "off";
}

function gridAction() {
    if (gridState === "off") {
        gridTurnOn();
        actions.saveCommand(gridTurnOn, gridTurnOff, "", "");

    } else {
        gridTurnOff();
        actions.saveCommand(gridTurnOff, gridTurnOn, "", "");
    }
}


function addEditTabListeners() {
    document.getElementById("gridButton").addEventListener("click", function() {
        gridAction();
        // actions.saveCommand()
    });
    document.getElementById("undoButton").addEventListener("click", function() {
        if (actions.undoStack.length !== 0)
            actions.undo();
        appearEditButtons();
    });
    document.getElementById("redoButton").addEventListener("click", function() {
        if (actions.redoStack.length !== 0)
            actions.redo();
        appearEditButtons();

    });
    initialAppear();
}

export { addEditTabListeners };