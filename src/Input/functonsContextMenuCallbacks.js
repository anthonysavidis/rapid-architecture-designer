import { createMultipleSpecificFunctions, deleteMultipleSpecificFunctions, inverseSplitAction, massiveSet, massiveMove, resetSpecificFunction, setSpecificFunction, standardSplitAction, massiveUnparent } from "../Actions/inverseFunctionsActions.js";
import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addToParentContext, closeContext } from "../HtmlElements/functionsContextMenu.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { cancelSelection, selectAction } from "../Item/selectComponent.js";
import { getSelectedFunctionIds, getSelectedFunctions } from "../Item/selectFunction.js";
import { forceActivateAll, forceActivateByComponent, isAllChecked, isByComponentChecked, showAllRefresh, showByComponent, showOwner, showSpecificFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";
import { measureSelectedView } from "../Workspace/selectedOperationsHandler.js";

var editFunctionCallBack = (funcId) => {
    const editingFunction = items.itemList[items.itemList.findIndex(el => el._id === funcId)];
    produceBox("input", "Component", (name, description) => {
        const functionStr = items.itemList[items.itemList.findIndex(el => el._id === funcId)].toString();
        const oldDomName = document.getElementById(funcId + "name").innerHTML;
        if (name === "" || !name.replace(/\s/g, '').length) name = constantNames["emptyNames"][type.toLowerCase()];
        if (description === "" || !description.replace(/\s/g, '').length) description = constantNames["emptyNames"]["description"];
        items.updateNameAndDescription(funcId, name, description);
        const detailChanged = detailChangeListener(funcId, functionStr)
        if (detailChanged && isAllChecked() && editingFunction.owners[0]) {
            // document.getElementById(funcId + "name").innerHTML = 
            // showOwner(items.itemList[items.itemList.findIndex(el => el._id === funcId)]);
            showAllRefresh();

        } else if (!detailChanged) {
            document.getElementById(funcId + "name").innerHTML = oldDomName;
        }
        (detailChanged) ? measureSelectedView(funcId) : 1;
    });
    document.getElementById("nameForm").value = editingFunction._name;
    document.getElementById("itemDescription").value = editingFunction._description;
}
//eee
const moveCallBack = (compId) => {
    const selectedFuncs = getSelectedFunctions();
    const initialFuncsStr = itemFromListToObject(selectedFuncs);
    for (var x in selectedFuncs) {
        const funcId = selectedFuncs[x]._id;
        items.unparentFunction(funcId);
        items.setFunctionToItem(compId, funcId);
    }

    actions.saveCommand(massiveSet, massiveMove, initialFuncsStr, JSON.stringify(compId));
    if (isByComponentChecked()) {
        forceActivateByComponent();
    } else {
        forceActivateAll();
    }
    // closeContext();

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

    }, 40);


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

    produceBox("confirmation", msg + "@1@Operation(s) Deletion", () => {
        for (var x in tobeDeleted)
            items.delete(tobeDeleted[x]._id);
        actions.saveCommand(deleteMultipleSpecificFunctions, createMultipleSpecificFunctions, toBeDeletedStr, "");
        closeContext();
        if (isByComponentChecked()) {
            showByComponent();
        }
    });
}


function addAllPossibleMovingComponents(funcId, parentDiv) {
    var count = 0;
    for (var x in items.itemList) {
        if (items.itemList[x]._type === "Component") {
            var child = addToParentContext(funcId, parentDiv, items.itemList[x]._name, moveCallBack, items.itemList[x]._id);
            // child.style.width=;
            count++;
        }
    }
    return;
}

export { addAllPossibleMovingComponents, editFunctionCallBack, splitCallBack, unparentCallBack, deleteCallBack, moveCallBack };