import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { moveItemsTo } from "../Layers/moveItem.js";

function moveToNext(actionItems) {
    const nextLayerId = actionItems.updatedItem[0];
    const itemList = actionItems.updatedItem[1];
    moveItemsTo(nextLayerId, itemList);
    closeTheTooltip();
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
        console.log(allLinks);
        for (var x in allLinks) {
            if (items.itemList.findIndex((el) => el._id === allLinks[x]._id) === -1)
                var it = new Item(JSON.stringify(allLinks[x]));
        }
    }
    return;
}

export { moveToNext, moveToPrev };