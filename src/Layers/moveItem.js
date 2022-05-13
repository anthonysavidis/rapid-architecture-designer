import { moveToNext, moveToPrev } from "../Actions/inverseHierarchyActions.js";
import { actions } from "../Classes/Actions.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { copyComponent, pasteFromStr } from "../Item/copy.js";

function removeAssignedFunctions(selectedItemList) {
    for (var x in selectedItemList) {
        if (selectedItemList[x]._functions.length != 0) {
            for (var i in selectedItemList[x]._functions)
                items.delete(selectedItemList[x]._functions[i]);
        }
    }
}

function removeFromCurrentLayer(selectedItemList) {
    for (var x in selectedItemList) {
        items.delete(selectedItemList[x]._id);
    }
    removeAssignedFunctions(selectedItemList);
}

function createSendingItem(selectedItemList) {
    var idsToBeCopied = [];
    for (var x in selectedItemList) {
        idsToBeCopied.push(selectedItemList[x]._id);
    }
    const argList = [idsToBeCopied, selectedItemList];
    console.log(argList);
    const sendedItem = copyComponent(1, argList);
    return sendedItem;
}

function createSendingLayer(selectedItem) {
    var idsToBeCopied = [selectedItem._id];
    var selectedItemList = [selectedItem]
    const argList = [idsToBeCopied, selectedItemList];
    console.log(argList);
    const sendedItem = copyComponent(1, argList, 1);
    return sendedItem;
}


function setUpMoveAction(layerId, selectedItemList, allLinks, nextSendingItem) {
    const initialItem = [layers.selectedLayer._id, selectedItemList, itemFromListToObject(allLinks)];
    const updatedItem = [layerId, selectedItemList, JSON.stringify(nextSendingItem)];
    actions.saveCommand(moveToNext, moveToPrev, initialItem, updatedItem);
}

function moveItemsTo(layerId, selectedItemList) {
    const sendedItem = createSendingItem(selectedItemList);
    removeFromCurrentLayer(selectedItemList);
    const currentLayerId = layers.selectedLayer._id;
    layers.changeLayer(layerId);
    pasteFromStr(sendedItem);

    return sendedItem;
}

export { moveItemsTo, setUpMoveAction, createSendingLayer, removeFromCurrentLayer, createSendingItem };