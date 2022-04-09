import { deleteTrashBinItem, restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getAllDeletedItemsStrs, getLinkItems, getSingleItemStrs } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { createSendingItem } from "../Layers/moveItem.js";
import { showAllRefresh } from "./functionAppearance.js";

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
    if (document.getElementById('all').checked) {
        showAllRefresh();
    }
}

export { canBeDeleted, deleteWithTrashBin };