import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { disablePanning, enablePanning } from "../Workspace/zoom.js";
import { appearEditButtons } from "./tabAppearance/buttonsVisibility.js";

function initialAppear() {
    document.getElementById("undoButton").style.display = "block";
    document.getElementById("redoButton").style.display = "block";
}

var gridState = "off",
    panningState = "off"

function gridTurnOn() {
    document.getElementById("body").className = "bodyDot";
    gridState = "on";
    document.getElementById("gridButton").style.backgroundColor = "#ccc";
}

function gridTurnOff() {
    document.getElementById("body").className = "";
    gridState = "off";
    document.getElementById("gridButton").style.backgroundColor = "";

}

function panningOn() {
    panningState = "on";
    enablePanning();
    document.getElementById("panningButton").style.backgroundColor = "#ccc";
}

function panningOff() {
    panningState = "off";
    disablePanning();
    document.getElementById("panningButton").style.backgroundColor = "";
}


function gridAction() {
    if (gridState === "off") {
        gridTurnOn();
        // actions.saveCommand(gridTurnOn, gridTurnOff, "", "");
    } else {
        gridTurnOff();
        // actions.saveCommand(gridTurnOff, gridTurnOn, "", "");
    }
}

function panningAction() {
    if (panningState === "off") {
        panningOn();
        // actions.saveCommand(panningOn, panningOff, "", "");
    } else {
        panningOff();
        // actions.saveCommand(panningOff, panningOn, "", "");
    }
}


function addEditTabListeners() {
    document.getElementById("gridButton").addEventListener("click", function() {
        gridAction();
        // actions.saveCommand()
    });
    document.getElementById("panningButton").addEventListener("click", function() {
        panningAction();
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