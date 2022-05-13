import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { pasteFromStr } from "../Item/copy.js";
import { moveItemsTo, removeFromCurrentLayer } from "../Layers/moveItem.js";

function moveToNext(actionItems) {
    const nextLayerId = actionItems.updatedItem[0];
    const itemList = actionItems.updatedItem[1];
    const sendingItem = JSON.parse(actionItems.updatedItem[2]);
    // moveItemsTo(nextLayerId, itemList);
    closeTheTooltip();
    removeFromCurrentLayer(itemList);
    layers.changeLayer(nextLayerId);
    pasteFromStr(sendingItem);
    layers.changeLayer(nextLayerId);

    return;
}

function moveToPrev(actionItems) {
    const prevLayerId = actionItems.initialItem[0];
    const itemList = actionItems.initialItem[1];
    var allLinks;
    try {
        allLinks = JSON.parse(actionItems.initialItem[2]);
    } catch {
        allLinks = "";
    }
    moveItemsTo(prevLayerId, itemList);
    closeTheTooltip();
    if (allLinks) {
        for (var x in allLinks) {
            if (items.itemList.findIndex((el) => el._id === allLinks[x]._id) === -1)
                var it = new Item(JSON.stringify(allLinks[x]));
        }
    }
    return;
}

export { moveToNext, moveToPrev };