import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { items } from "../Classes/ItemArray.js";
import { renderLine } from "../Item/createLine.js";

function moveSpecificDirection(index, componentId, boundingStr) {
    var currentBoundingRec = JSON.parse(boundingStr);
    document.getElementById(componentId).style.top = currentBoundingRec.top + "px";
    document.getElementById(componentId).style.left = currentBoundingRec.left + "px";
    document.getElementById(componentId).style.width = currentBoundingRec.width + "px";
    document.getElementById(componentId).style.height = currentBoundingRec.height + "px";
    items.itemList[index].boundingRec = currentBoundingRec;
}

function moveNext(actionItems) {
    var initBoundingAndId = actionItems.initialItem.split("@");
    var componentId = initBoundingAndId[1];
    var index = items.itemList.findIndex(el => el._id === componentId);
    moveSpecificDirection(index, componentId, actionItems.updatedItem);
    renderLine(componentId);
}

function movePrev(actionItems) {
    var initBoundingAndId = actionItems.initialItem.split("@");
    var componentId = initBoundingAndId[1];
    var index = items.itemList.findIndex(el => el._id === componentId);
    moveSpecificDirection(index, componentId, initBoundingAndId[0]);
    renderLine(componentId);
}

function restoreFromTrashBin(actionItems) {
    var restoringItems = JSON.parse(actionItems.initialItem);
    for (var x in restoringItems) {
        var it = new Item(JSON.stringify(restoringItems[x]));
        if (it._functions) {
            const functionIds = it._functions;
            it._functions = [];
            for (var x in functionIds) {
                items.deleteFunctionFromOwner(it._id, functionIds[x]);
                items.setFunctionToItem(it._id, functionIds[x]);
            }
        }
    }
    document.getElementById(restoringItems[0]._id).style.top = document.getElementById(restoringItems[0]._id).getBoundingClientRect().top - 100 + "px";
    renderLine(restoringItems[0]._id);
}

export { moveNext, movePrev, restoreFromTrashBin };