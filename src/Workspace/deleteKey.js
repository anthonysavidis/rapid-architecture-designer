import { createMultipleSpecificFunctions, resetMultipleFunctions } from "../Actions/inverseFunctionsActions.js";
import { restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { deleteFunction } from "../Item/edit.js";
import { unlinkWithLinkSelection } from "../Item/Link.js";
import { cancelSelection, getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { getSelectedFunctionIds, getSelectedFunctions } from "../Item/selectFunction.js";
import { getSelectedLinkItems } from "../Item/selectLink.js";
import { createSendingItem } from "../Layers/moveItem.js";
import { deleteComponentAction } from "../UpTab/componentTab.js";
import { resetFunctionAction } from "../UpTab/functionTab.js";
import { isAllChecked, showAllRefresh } from "./functionAppearance.js";

function handleLinkDeletion(links) {
    for (var x in links) {
        unlinkWithLinkSelection(links[x]);
        items.delete(links[x]._id);
    }
    return;
}

function handleFunctionDeletion(functions) {
    for (var x in functions) {
        items.delete(functions[x]._id);
    }
    return;
}

function handleComponentDeletion(components) {
    for (var i = 0; i < components.length; i++) {
        items.delete(components[i]._id);
    }
}

function handleDeletedComponentsOperations(opsJSON) {
    for (var x in opsJSON) {
        const componentId = x;
        for (var y in opsJSON[x]) {
            items.deleteFunctionFromOwner(componentId, opsJSON[x][y]);
            items.setFunctionToItem(componentId, opsJSON[x][y]);
        }
    }
    return;
}

function deleteKeySaveAction(allElements, allStrElements) {
    actions.saveCommand((actionItems) => {
        console.log(actionItems);
        (actionItems.initialItem[0]) ? handleLinkDeletion(actionItems.initialItem[0]) : 1;
        (actionItems.initialItem[1]) ? handleFunctionDeletion(actionItems.initialItem[1]) : 1;
        (actionItems.initialItem[2]) ? handleComponentDeletion(actionItems.initialItem[2]) : 1;
        cancelSelection();
        if (isAllChecked()) {
            showAllRefresh();
        }
    }, (actionItems) => {
        (actionItems.updatedItem[2][0] !== "}") ? restoreFromTrashBin({ initialItem: actionItems.updatedItem[2] }) : 1;
        (actionItems.updatedItem[1] !== "}") ? createMultipleSpecificFunctions({ initialItem: actionItems.updatedItem[1] }) : 1;
        if (actionItems.updatedItem[0] !== "}") {
            const allLinks = JSON.parse(actionItems.updatedItem[0]);
            for (var x in allLinks) {
                console.log(allLinks[x]);
                if (allLinks[x] !== "{")
                    var l = new Item(JSON.stringify(allLinks[x]));
            }

        }
        handleDeletedComponentsOperations(actionItems.updatedItem[3]);

        if (isAllChecked())
            showAllRefresh();
    }, allElements, allStrElements);
    cancelSelection();
    if (isAllChecked()) {
        showAllRefresh();
    }
    return;
}

function getComponentsAttachedOperationIds(components) {
    const componentsOperationIds = [];
    for (var i in components) {
        if (components[i]._functions.length) {
            components[i]._functions.forEach((el) => { componentsOperationIds.push(el); });
        }
    }
    return componentsOperationIds;
}

function deleteExtraFunctions(storingJSON, selectedOperationIds, operations) {
    // for (var x in operations) {
    //     resetFunctionAction(operations[x]._id, operations[x].owners[0]);
    // }

    for (var x in storingJSON["ItemMap"]["current"]) {
        if (JSON.parse(storingJSON["ItemMap"]["current"][x])._type !== "Function")
            continue;
        if (selectedOperationIds.includes(JSON.parse(storingJSON["ItemMap"]["current"][x])._id)) {
            delete storingJSON["ItemMap"]["current"][x];
            // items.delete(JSON.parse(storingJSON["ItemMap"]["current"][x])._id);
        }
    }
    return storingJSON;
}

function getCrossSection(components, opIds) {
    var attachedOps = {};
    for (var x in components) {
        if (components[x]._functions[0]) {
            var componentsFuncs = [];
            for (var y in components[x]._functions) {
                if (opIds.includes(components[x]._functions[y]))
                    componentsFuncs.push(components[x]._functions[y]);
            }
            attachedOps[components[x]._id] = componentsFuncs;
        }
    }
    return attachedOps;
}

function deleteFromKey() {
    const components = getSelectedItems();
    const componentLinks = getLinkItems(components);
    var componentLinkIds = [];
    componentLinks.forEach(el => componentLinkIds.push(el._id));
    const componentsOperations = getComponentsAttachedOperationIds(components);
    var linkArg;
    if (componentLinks.length === 0)
        linkArg = "";
    else
        linkArg = itemFromListToObject(componentLinks);
    var initialComponentItem = JSON.parse(createSendingItem(components));


    const operations = getSelectedFunctions();
    const selectedOperationIds = getSelectedFunctionIds();
    const selectedComponentsOperationsCS = getCrossSection(components, selectedOperationIds);
    const componentNewSendingStr = JSON.stringify(deleteExtraFunctions(initialComponentItem, selectedOperationIds, operations));
    const links = getSelectedLinkItems();
    const allElements = [links.filter(el => !componentLinkIds.includes(el._id)), operations, components, componentsOperations];
    const allStrElements = [itemFromListToObject(links.filter(el => !componentLinkIds.includes(el._id))), itemFromListToObject(operations), [componentNewSendingStr, linkArg], selectedComponentsOperationsCS];
    handleLinkDeletion(links);
    handleFunctionDeletion(operations);
    handleComponentDeletion(components);

    // setTimeout(() => { console.log(totalElements); }, 1000)
    deleteKeySaveAction(allElements, allStrElements);
    return;
}

export { deleteFromKey };