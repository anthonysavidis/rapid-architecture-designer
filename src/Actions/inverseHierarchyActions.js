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
    moveItemsTo(prevLayerId, itemList);
    closeTheTooltip();
    return;
}

export { moveToNext, moveToPrev };