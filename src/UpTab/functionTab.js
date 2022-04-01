import { deleteFunction } from "../Item/edit.js";
import { Item } from "../Classes/Item.js";
import { items, itemFromListToObject } from "../Classes/ItemArray.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { getSelectedFunctionIds, getSelectedFunctions } from "../Item/selectFunction.js";
import { actions } from "../Classes/Actions.js";
import { createSpecificFunction, deleteSpecificFunction, createMultipleSpecificFunctions, deleteMultipleSpecificFunctions, setSpecificFunction, resetSpecificFunction } from "../Actions/inverseFunctionsActions.js";
import { askForDetails } from "./componentTab.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";

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
    });
    document.getElementById("deleteFunctionButton").addEventListener("click", function() {
        var toBeDeletedFunctions = itemFromListToObject(getSelectedFunctions());
        deleteFunctionAction();
        actions.saveCommand(deleteMultipleSpecificFunctions, createMultipleSpecificFunctions, toBeDeletedFunctions, "");

    });
    document.getElementById("setFunctionButton").addEventListener("click", function() {
        var itemList = [getSelectedFunctions()[0], getSelectedItems()[0]];
        var str = itemFromListToObject(itemList);
        setFunctionAction();
        actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");
    });
    document.getElementById("resetFunctionButton").addEventListener("click", function() {
        var itemList = [getSelectedFunctions()[0], getSelectedItems()[0]];
        var str = itemFromListToObject(itemList);
        const fid = itemList[0]._id;
        const cid = itemList[1]._id;
        produceBox("confirmation", constantNames["confirmationBox"]["ResetStart"] + itemList[1]._name + constantNames["confirmationBox"]["ResetEnd"] + "@1", () => {
            resetFunctionAction(fid, cid);
            var updatingMessage = itemList[0]._name + " detached from " + itemList[1]._name + ".";
            produceBox("updating", updatingMessage, null);
            actions.saveCommand(resetSpecificFunction, setSpecificFunction, str, "");
        });
    });
}

export { addFunctionTabListeners };