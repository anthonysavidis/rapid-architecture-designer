import { deleteTrashBinItem, movePrev, restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getAllDeletedItemsStrs, getLinkItems, getSingleItemStrs } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { createLayerInfoModal } from "../HtmlElements/layerInfo.js";
import { createFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { getSelectedItems } from "../Item/selectComponent.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { createSendingItem } from "../Layers/moveItem.js";
import { isAllChecked, showAllRefresh } from "./functionAppearance.js";

function canBeDeleted(elementRect) {
    var trashRect = document.getElementById('trashBin').getBoundingClientRect();
    var minAx = elementRect.x,
        minAy = elementRect.y,
        maxAx = elementRect.x + elementRect.width,
        maxAy = elementRect.y + elementRect.height,
        minBx = trashRect.x,
        minBy = trashRect.y,
        maxBx = trashRect.x + trashRect.width,
        maxBy = trashRect.y + trashRect.height;
    var aLeftOfB = maxAx < minBx;
    var aRightOfB = minAx > maxBx;
    var aAboveB = minAy > maxBy;
    var aBelowB = maxAy < minBy;

    var x_overlap = Math.max(0, Math.min(maxAx, maxBx) - Math.max(minAx, minBx)),
        y_overlap = Math.max(0, Math.min(maxAy, maxBy) - Math.max(minAy, minBy));

    return x_overlap && y_overlap;
}

function deleteWithTrashBin(elmnt) {
    const theItem = items.itemList[items.itemList.findIndex(el => el._id === elmnt.id)];
    const links = getLinkItems([theItem]);
    const str = createSendingItem([theItem]);
    var linkArg;
    if (links.length === 0)
        linkArg = "";
    else
        linkArg = itemFromListToObject(links);
    actions.saveCommand(deleteTrashBinItem, restoreFromTrashBin, [str, linkArg], "");
    items.delete(elmnt.id);
    if (isAllChecked()) {
        showAllRefresh();
    }
}

function deleteMultWithTrashBin(itemElmnts) {
    const links = getLinkItems(itemElmnts);
    const str = createSendingItem(itemElmnts);
    var linkArg;
    if (links.length === 0)
        linkArg = "";
    else
        linkArg = itemFromListToObject(links);
    actions.saveCommand(deleteTrashBinItem, restoreFromTrashBin, [str, linkArg], "");
    for (var x in itemElmnts)
        items.delete(itemElmnts[x]._id);
    if (isAllChecked()) {
        showAllRefresh();
    }
}


function initializeTheTrashBin() {
    // document.getElementById('helpButton').addEventListener("click", (e) => {
    //     createLayerInfoModal();
    // });
    // document.getElementById('trashBin').ondrop = (event) => {
    //     event.preventDefault();
    //     console.log(event.target.id);
    //     var functionId = event.dataTransfer.getData("text");
    // };
    // $("#trashBin").droppable({
    //     drop: function(event, ui) {
    //         var deletingItems = getSelectedItems();
    //         if (deletingItems.length === 0)
    //             return;
    //         else {
    //             const msg = constantNames["confirmationBox"]["DeleteMsgStart"] + deletingItems.length + constantNames["confirmationBox"]["DeleteMsgEnd"];
    //             produceBox("confirmation", msg + "@1", () => {
    //                 deleteMultWithTrashBin(deletingItems);
    //             });
    //         }
    //     }
    // });
}

function fixTrashBinPosition() {
    // document.getElementById("helpButton").style.left = document.getElementById("right_tab").getBoundingClientRect().left - 110 + "px";
    // document.getElementById("helpButton").style.top = document.getElementById("right_tab").getBoundingClientRect().height - 145 + "px";
    document.getElementById("trashBin").style.left = document.getElementById("right_tab").getBoundingClientRect().left - 110 + "px";
    document.getElementById("trashBin").style.top = document.getElementById("right_tab").getBoundingClientRect().height - 15 + "px";
    return;
}

function fixMainDiv() {
    //ean einai mono to operations side i an einai kai ta 2.
    var rightSmallVoid = window.innerWidth - document.getElementById("toolBar").getBoundingClientRect().right;
    document.getElementById("main").style.width = window.innerWidth - document.getElementById("right_tab").getBoundingClientRect().width - rightSmallVoid - 11 + "px";
    document.getElementById("main").style.height = document.getElementById("right_tab").getBoundingClientRect().height + "px";

}

function createDraggableSpace() {
    if (document.getElementById("space"))
        document.getElementById("space").remove();
    var div = document.createElement('div');
    div.id = "space";
    div.style.position = "absolute";
    div.style.height = "inherit";
    div.style.top = 112.8 + "px";
    div.style.left = 4 + "px";
    // div.style.height = window.screen.height - 100 + "px";
    div.style.zIndex = -1;
    div.style.width = document.getElementById('tabButtons').getBoundingClientRect().width - document.getElementById('right_tab').getBoundingClientRect().width - 4 + "px";
    document.getElementById('body').appendChild(div);
    document.getElementById("right_tab").style.left = document.getElementById("toolBar").getBoundingClientRect().width - document.getElementById("right_tab").getBoundingClientRect().width + "px";
    createFullPath();
    fixMainDiv();

}

export { canBeDeleted, fixMainDiv, deleteWithTrashBin, initializeTheTrashBin, createDraggableSpace, deleteMultWithTrashBin, fixTrashBinPosition };