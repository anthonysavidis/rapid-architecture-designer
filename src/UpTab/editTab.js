import { actions } from "../Classes/Actions.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { editComponentCallBack } from "../HtmlElements/componentContextMenu.js";
import { editLinkCallback } from "../HtmlElements/linkContextMenu.js";
import { editFunctionCallBack } from "../Input/functonsContextMenuCallbacks.js";
import { getSelectedItems } from "../Item/selectComponent.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { getSelectedLinkItems } from "../Item/selectLink.js";
import { appearEditButtons } from "./tabAppearance/buttonsVisibility.js";

function initialAppear() {
    document.getElementById("undoButton").style.display = "block";
    document.getElementById("redoButton").style.display = "block";
    document.getElementById("editButton").style.display = "none";
}

var gridState = "on",
    snappingState = "on"

function gridTurnOn() {
    InstanceGenerator.diagramMap[layers.selectedLayer._id].grid.visible = true;
    gridState = "on";
}

function gridTurnOff() {
    InstanceGenerator.diagramMap[layers.selectedLayer._id].grid.visible = false;
    gridState = "off";
}

function gridAction() {
    if (gridState === "off") {
        gridTurnOn();
    } else {
        gridTurnOff();
    }
}

function snappingOn() {
    for (var x in layers.layerList)
        InstanceGenerator.diagramMap[layers.layerList[x]._id].toolManager.draggingTool.dragOptions.isGridSnapEnabled = true;
    snappingState = "on";
}

function snappingOff() {
    for (var x in layers.layerList)
        InstanceGenerator.diagramMap[layers.layerList[x]._id].toolManager.draggingTool.dragOptions.isGridSnapEnabled = false;
    snappingState = "off";

}

function gridSnapAction() {
    if (snappingState === "off") {
        snappingOn();
    } else {
        snappingOff();
    }
}
var gridCntx, undoCntx, redoCntx, gridSnpCntx;

function addEditTabListeners() {
    document.getElementById("gridButton").addEventListener("click", gridCntx = function () {
        gridAction();
        // actions.saveCommand()
    });
    document.getElementById("gridSnappingButton").addEventListener("click", gridSnpCntx = function () {
        gridSnapAction();
        InstanceGenerator.clickWorkspace();

    });
    document.getElementById("editButton").addEventListener("click", function () {
        // actions.saveCommand()
        if (getSelectedItems().length === 1)
            editComponentCallBack(getSelectedItems()[0]._id);
        else if (getSelectedFunctions().length === 1)
            editFunctionCallBack(getSelectedFunctions()[0]._id);
        else
            editLinkCallback(getSelectedLinkItems()[0]._id);
    });
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
        snappingOff();
    }, 100);
}

export { addEditTabListeners, gridCntx, undoCntx, redoCntx, gridTurnOn, snappingOn, gridState, gridSnpCntx, snappingState };