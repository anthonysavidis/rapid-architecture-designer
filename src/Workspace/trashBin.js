import { deleteSpecificItems } from "../Actions/inverseActions.js";
import { restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getAllDeletedItemsStrs, getSingleItemStrs } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";

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
    var binRec = document.getElementById('trashBin').getBoundingClientRect();
    document.getElementById(elmnt.id).style.transition = "width 2s, height 2s,top 1s, left 1s, transform 2s";
    document.getElementById(elmnt.id).style.transform = "rotate(360deg)";

    document.getElementById(elmnt.id).style.height = 0 + 'px';
    document.getElementById(elmnt.id).style.width = 0 + 'px';
    document.getElementById(elmnt.id).style.left = binRec.x + binRec.width / 2 + 'px';
    document.getElementById(elmnt.id).style.top = binRec.y + 25 + 'px';
    document.getElementById(elmnt.id + 'infoIcon').style.display = "none";
    setTimeout(() => {
        document.getElementById(elmnt.id + 'name').style.display = "none";

    }, 500);
    setTimeout(() => {
        document.getElementById('trashBin').style.backgroundColor = 'rgb(210, 212, 236);';
        document.getElementById('trashBin').style.backgroundImage = 'url(\'./images/trashBinMovin.gif\')';

    }, 1200);

    setTimeout(() => {
        document.getElementById('trashBin').style.backgroundImage = 'url(\'./images/trashBinStatic.png\')';
        items.delete(elmnt.id);
    }, 2000);
}

export { canBeDeleted, deleteWithTrashBin };