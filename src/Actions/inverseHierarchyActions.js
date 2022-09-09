import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { getCurrentFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { pasteFromStr } from "../Item/copy.js";
import { moveItemsTo, removeFromCurrentLayer } from "../Layers/moveItem.js";

function moveToNext(actionItems) {
    const nextLayerId = actionItems.updatedItem[0];
    const itemList = actionItems.updatedItem[1];
    const sendingItem = JSON.parse(actionItems.updatedItem[2]);
    // moveItemsTo(nextLayerId, itemList);

    removeFromCurrentLayer(itemList);
    layers.changeLayer(nextLayerId);
    pasteFromStr(sendingItem);
    layers.changeLayer(nextLayerId);
    updateFullPath(getCurrentFullPath());

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
    console.log("move to prev");
    console.log(prevLayerId);
    console.log(itemList);
    moveItemsTo(prevLayerId, itemList);

    if (allLinks) {
        for (var x in allLinks) {
            if (items.itemList.findIndex((el) => el._id === allLinks[x]._id) === -1)
                var it = new Item(JSON.stringify(allLinks[x]));
        }
    }
    updateFullPath(getCurrentFullPath());

    return;
}

export { moveToNext, moveToPrev };