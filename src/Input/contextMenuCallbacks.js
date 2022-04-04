import { createMultipleSpecificFunctions, deleteMultipleSpecificFunctions, inverseSplitAction, massiveSet, massiveMove, resetSpecificFunction, setSpecificFunction, standardSplitAction, massiveUnparent } from "../Actions/inverseFunctionsActions.js";
import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addToParentContext, closeContext } from "../HtmlElements/functionsContextMenu.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { cancelSelection, selectAction } from "../Item/selectComponent.js";
import { getSelectedFunctionIds, getSelectedFunctions } from "../Item/selectFunction.js";
import { showByComponent, showSpecificFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";

const moveCallBack = (compId) => {
    const selectedFuncs = getSelectedFunctions();
    const initialFuncsStr = itemFromListToObject(selectedFuncs);
    for (var x in selectedFuncs) {
        const funcId = selectedFuncs[x]._id;
        items.unparentFunction(funcId);
        items.setFunctionToItem(compId, funcId);
    }
    actions.saveCommand(massiveSet, massiveMove, initialFuncsStr, JSON.stringify(compId));
    closeContext();
    if (document.getElementById("byComponent").checked) {
        showByComponent();
    }
    return;
}

const splitCallBack = () => {
    var functionList = getSelectedFunctionIds();
    var functionItems = [];
    for (var x in functionList)
        functionItems.push(items.itemList[items.itemList.findIndex(el => el._id === functionList[x])]);
    const funcsStr = itemFromListToObject(functionItems);

    var it = new Item("Component");
    it._name = constantNames["splittedBox"]["name"];
    items.updateNameAndDescription(it._id, it._name, it._description);
    for (var x in functionList) {
        const funcId = functionList[x];
        items.unparentFunction(funcId);
        items.setFunctionToItem(it._id, funcId);
    }
    if (document.getElementsByClassName('context-menu')[0])
        closeContext();
    cancelSelection();
    showSpecificFunctions(it._id);
    setTimeout(() => {
        selectAction(it._id);

    }, 400);


    actions.saveCommand(standardSplitAction, inverseSplitAction, funcsStr, it.toString());
    return;
}

const unparentCallBack = () => {
    const toBeUnparent = getSelectedFunctions();
    console.log(toBeUnparent);
    const toBeUnparentStr = itemFromListToObject(toBeUnparent);
    for (var x in toBeUnparent) {
        const funcId = toBeUnparent[x]._id;
        items.unparentFunction(funcId);
    }
    actions.saveCommand(massiveUnparent, massiveMove, toBeUnparentStr, "");
    closeContext();
    showByComponent();
}

const deleteCallBack = () => {
    const tobeDeleted = getSelectedFunctions();
    const toBeDeletedStr = itemFromListToObject(tobeDeleted);
    var msg = constantNames["confirmationBox"]["DeleteMsgStart"] + tobeDeleted.length + constantNames["confirmationBox"]["DeleteMsgFunctionEnd"];

    produceBox("confirmation", msg + "@1", () => {
        for (var x in tobeDeleted)
            items.delete(tobeDeleted[x]._id);
        actions.saveCommand(deleteMultipleSpecificFunctions, createMultipleSpecificFunctions, toBeDeletedStr, "");
        closeContext();
        if (document.getElementById("byComponent").checked) {
            showByComponent();
        }
    });
}


function addAllPossibleMovingComponents(funcId, parentDiv) {
    for (var x in items.itemList) {
        if (items.itemList[x]._type === "Component" && !items.itemList[x]._functions.includes(funcId)) {
            addToParentContext(funcId, parentDiv, items.itemList[x]._name, moveCallBack, items.itemList[x]._id);
        }
    }
}

export { addAllPossibleMovingComponents, splitCallBack, unparentCallBack, deleteCallBack, moveCallBack };