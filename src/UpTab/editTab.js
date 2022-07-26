import { actions } from "../Classes/Actions.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { disablePanning, enablePanning } from "../Workspace/zoom.js";
import { appearEditButtons } from "./tabAppearance/buttonsVisibility.js";

function initialAppear() {
    document.getElementById("undoButton").style.display = "block";
    document.getElementById("redoButton").style.display = "block";
}

var gridState = "on",
    panningState = "off"

function gridTurnOn() {
    InstanceGenerator.diagramMap[layers.selectedLayer._id].grid.visible = true;
    gridState = "on";

    // document.getElementById("gridButton").style.backgroundColor = "#ccc";
}

function gridTurnOff() {
    InstanceGenerator.diagramMap[layers.selectedLayer._id].grid.visible = false;
    gridState = "off";
    // document.getElementById("gridButton").style.backgroundColor = "";

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
        console.log('on grid');
        // actions.saveCommand(gridTurnOn, gridTurnOff, "", "");
    } else {
        console.log('off grid');
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
var gridCntx, panningCntx, undoCntx, redoCntx;

function addEditTabListeners() {
    document.getElementById("gridButton").addEventListener("click", gridCntx = function () {
        gridAction();
        // actions.saveCommand()
    });
    // document.getElementById("panningButton").addEventListener("click", panningCntx = function() {
    //     panningAction();
    //     // actions.saveCommand()
    // });
    document.getElementById("undoButton").addEventListener("click", undoCntx = function () {
        if (actions.undoStack.length !== 0)
            actions.undo();
        appearEditButtons();
    });
    document.getElementById("redoButton").addEventListener("click", redoCntx = function () {
        if (actions.redoStack.length !== 0)
            actions.redo();
        appearEditButtons();

    });
    initialAppear();
    setTimeout(() => {
        gridTurnOff();

    }, 100);
}

export { addEditTabListeners, gridCntx, panningCntx, undoCntx, redoCntx, gridState, panningState };