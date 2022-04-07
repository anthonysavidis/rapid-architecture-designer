import { deleteFunction } from "../Item/edit.js";
import { Item } from "../Classes/Item.js";
import { items, itemFromListToObject } from "../Classes/ItemArray.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { cancelFunctionSelection, getSelectedFunctionIds, getSelectedFunctions } from "../Item/selectFunction.js";
import { actions } from "../Classes/Actions.js";
import { createSpecificFunction, deleteSpecificFunction, createMultipleSpecificFunctions, deleteMultipleSpecificFunctions, setSpecificFunction, resetSpecificFunction, resetMultipleFunctions, setMultipleFunctions } from "../Actions/inverseFunctionsActions.js";
import { askForDetails } from "./componentTab.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { showByComponent } from "../Workspace/functionAppearance.js";

function setFunctionAction() {
    var f = getSelectedFunctionIds()[0];
    var c = getSelectedIds()[0];
    items.setFunctionToItem(c, f);
}

function resetFunctionAction(f, c) {
    items.unlinkOwnerFunction(c, f);
}

function newFunctionAction() {
    var newFunction = new Item("Function");
    return newFunction;
}

function deleteFunctionAction() {
    deleteFunction();
}

function initialAppearance() {
    document.getElementById("deleteFunctionButton").style.display = "none";
    document.getElementById("setFunctionButton").style.display = "none";
    document.getElementById("resetFunctionButton").style.display = "none";
}

function addFunctionTabListeners() {
    initialAppearance();
    document.getElementById("newFunctionButton").addEventListener("click", function() {
        var functionItem = newFunctionAction();
        askForDetails(functionItem, "");
        if (document.getElementById('byComponent').checked)
            showByComponent();
    });
    document.getElementById("deleteFunctionButton").addEventListener("click", function() {
        const toBeDeletedFunctions = itemFromListToObject(getSelectedFunctions());
        var msg = constantNames["confirmationBox"]["DeleteMsgStart"] + getSelectedFunctionIds().length + constantNames["confirmationBox"]["DeleteMsgFunctionEnd"];

        produceBox("confirmation", msg + "@1", () => {
            deleteFunctionAction();
            actions.saveCommand(deleteMultipleSpecificFunctions, createMultipleSpecificFunctions, toBeDeletedFunctions, "");
            cancelFunctionSelection();
        });
    });
    document.getElementById("setFunctionButton").addEventListener("click", function() {
        var itemList = [getSelectedFunctions()[0], getSelectedItems()[0]];
        var str = itemFromListToObject(itemList);
        setFunctionAction();
        actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");
    });
    document.getElementById("resetFunctionButton").addEventListener("click", function() {
        var itemList = getSelectedFunctions();
        var str = itemFromListToObject(itemList);
        // const fid = itemList[0]._id;
        // const cid = itemList[1]._id;
        produceBox("confirmation", constantNames["confirmationBox"]["ResetMult"] + itemList.length + constantNames["confirmationBox"]["ResetEnd"] + "@1", () => {
            for (var x in itemList) {
                resetFunctionAction(itemList[x]._id, itemList[x].owners[0]);
            }
            var updatingMessage = "Operation(s) detached successfully.";
            produceBox("updating", updatingMessage, null);
            actions.saveCommand(resetMultipleFunctions, setMultipleFunctions, str, "");
        });
    });
}

export { addFunctionTabListeners };