import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { items } from "../Classes/ItemArray.js";
import { pasteFromStr } from "../Item/copy.js";
import { renderLine } from "../Item/createLine.js";
import { showAllRefresh } from "../Workspace/functionAppearance.js";

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
    var totalObject = JSON.parse(actionItems.initialItem[0]);
    var restoringItems = totalObject["ItemMap"]["current"];
    for (var x in restoringItems) {
        var it = JSON.parse(restoringItems[x]);
        if (it._type === "Function") {
            items.delete(it._id);
        }
    }
    pasteFromStr(actionItems.initialItem[0]);
    var allLinks = JSON.parse(actionItems.initialItem[1]);
    for (var x in allLinks) {
        var it = new Item(JSON.stringify(allLinks[x]));
    }

    // document.getElementById(restoringItems[0]._id).style.top = document.getElementById(restoringItems[0]._id).getBoundingClientRect().top - 100 + "px";
    // renderLine(restoringItems[0]._id);
}

function deleteTrashBinItem(actionItems) {
    var totalObject = JSON.parse(actionItems.initialItem[0]);
    var restoringItems = totalObject["ItemMap"]["current"];
    for (var x in restoringItems) {
        var it = JSON.parse(restoringItems[x]);
        if (it._type === "Component") {
            items.delete(it._id);
        }
    }
    if (document.getElementById('all').checked) {
        showAllRefresh();
    }
}

export { moveNext, movePrev, restoreFromTrashBin, deleteTrashBinItem };