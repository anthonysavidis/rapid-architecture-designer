import { changeArrowElementsState } from "../Item/pointedArrow.js";

function changePrevLinkState(actionItems) {
    var lineId = actionItems.initialItem.split("@")[1];
    var state = actionItems.initialItem.split("@")[0];
    changeArrowElementsState(lineId, state);
    return;
}

function changeNextLinkState(actionItems) {
    var lineId = actionItems.initialItem.split("@")[1];
    var state = actionItems.updatedItem;
    changeArrowElementsState(lineId, state);
    return;
}

export { changePrevLinkState, changeNextLinkState };