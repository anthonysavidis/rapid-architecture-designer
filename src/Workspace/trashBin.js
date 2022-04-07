import { deleteSpecificItems } from "../Actions/inverseActions.js";
import { restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getAllDeletedItemsStrs, getSingleItemStrs } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
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
    actions.saveCommand(deleteSpecificItems, restoreFromTrashBin, getSingleItemStrs(items.itemList[items.itemList.findIndex(el => el._id === elmnt.id)]), "");
    items.delete(elmnt.id);
    if (document.getElementById('all').checked) {
        showAllRefresh();
    }
}

export { canBeDeleted, deleteWithTrashBin };