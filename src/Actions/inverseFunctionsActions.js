import { spawnSpecificItem, deleteSpecificItems } from "./inverseActions.js";
import { items } from "../Classes/ItemArray.js";
import { Item } from "../Classes/Item.js";
import { showOwner } from "../Workspace/functionAppearance.js";

function createSpecificFunction(actionItems) {
    var it = new Item(actionItems.updatedItem);
    it.owners[0] ? items.setFunctionToItem(itemsObject[1]._id, itemsObject[0]._id) : 1;
    return;
}

function deleteSpecificFunction(actionItems) {
    var itemObject = JSON.parse(actionItems.updatedItem);
    items.delete(itemObject._id);
    return;
}

function createMultipleSpecificFunctions(actionItems) {
    var regeneratedItemsObject = JSON.parse(actionItems.initialItem);
    for (var x in regeneratedItemsObject) {
        var it = new Item(JSON.stringify(regeneratedItemsObject[x]));
        if (it.owners[0]) {
            const ownerID = it.owners[0];
            items.itemList[items.itemList.findIndex(el => el._id === it._id)].owners = [];
            items.setFunctionToItem(ownerID, it._id);
        }
    }
    console.log(items);
    return;
}

function deleteMultipleSpecificFunctions(actionItems) {
    var itemObjectsToBeDeleted = JSON.parse(actionItems.initialItem);
    for (var x in itemObjectsToBeDeleted) {
        items.delete(itemObjectsToBeDeleted[x]._id);
    }
    return;
}

function setSpecificFunction(actionItems) {
    var itemsObject = JSON.parse(actionItems.initialItem);
    // console.log(itemsObject[1]._id, itemsObject[0]._id); IDS OK
    items.setFunctionToItem(itemsObject[1]._id, itemsObject[0]._id);
    // console.log(items.itemList[0]._functions);
    console.log('attached');
    console.log(actionItems.initialItem);
    return;
}

function resetSpecificFunction(actionItems) {
    var itemsObject = JSON.parse(actionItems.initialItem);
    // console.log(itemsObject[1]._id, itemsObject[0]._id); IDS OK.
    items.unlinkOwnerFunction(itemsObject[1]._id, itemsObject[0]._id);
    // console.log(items.itemList[0]._functions);
    console.log('detached');
    console.log(actionItems.initialItem);
    return;
}

//initial: oi synartiseis me tous arxikous.
//modified: to item me tis synatiseis.
// sto inverse apla diagrafw to spawned kai moirazw synartiseis stous arxikous.
function inverseSplitAction(actionItems) {
    const initialFunctionList = JSON.parse(actionItems.initialItem);
    console.log(initialFunctionList);
    for (var x in initialFunctionList) {
        items.unparentFunction(initialFunctionList[x]._id);
        items.setFunctionToItem(initialFunctionList[x].owners, initialFunctionList[x]._id);
    }
    const spawnedCompoent = JSON.parse(actionItems.updatedItem);
    items.delete(spawnedCompoent._id);
    return;
}


function standardSplitAction(actionItems) {
    var it = new Item(actionItems.updatedItem);
    const initialFunctionList = JSON.parse(actionItems.initialItem);
    for (var x in initialFunctionList) {
        items.unparentFunction(initialFunctionList[x]._id);
    }
    return;
}

function massiveSet(actionItems) {
    const initialFunctionList = JSON.parse(actionItems.initialItem);
    const componentId = JSON.parse(actionItems.updatedItem);
    for (var x in initialFunctionList) {
        items.unparentFunction(initialFunctionList[x]._id);
        items.setFunctionToItem(componentId, initialFunctionList[x]._id);
    }
}

function massiveMove(actionItems) {
    const initialFunctionList = JSON.parse(actionItems.initialItem);
    for (var x in initialFunctionList) {
        items.unparentFunction(initialFunctionList[x]._id);
        if (initialFunctionList[x].owners)
            items.setFunctionToItem(initialFunctionList[x].owners, initialFunctionList[x]._id);
    }
}

function massiveUnparent(actionItems) {
    const initialFunctionList = JSON.parse(actionItems.initialItem);
    for (var x in initialFunctionList) {
        items.unparentFunction(initialFunctionList[x]._id);
    }
}

export { createSpecificFunction, createMultipleSpecificFunctions, deleteSpecificFunction, deleteMultipleSpecificFunctions, resetSpecificFunction, setSpecificFunction, standardSplitAction, inverseSplitAction, massiveSet, massiveMove, massiveUnparent };