import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { turnOffExtension, turnOnExtension } from "../HtmlElements/extendingComponent.js";
import { autoResize } from "../Item/resize.js";


var lastOriginalItem = null;

function detailChangeListener(id, originalItemStr) {
    var index = items.itemList.findIndex((el) => el._id === id);
    var alteredItemStr = items.itemList[index].toString();
    if (items.compareObjects(originalItemStr, alteredItemStr)) {
        actions.saveCommand(alterItemsDetails, inverseItemsDetails, originalItemStr, alteredItemStr);
        return true;
    }
    return false;
}

function changeDetails(actionItem) {
    var alteredItemObject = JSON.parse(actionItem);
    items.updateNameAndDescription(alteredItemObject._id, alteredItemObject._name, alteredItemObject._description);
    // items.itemList[items.itemList.findIndex((el) => el._id === alteredItemObject._id)].moreInfo = alteredItemObject.moreInfo;
    if (alteredItemObject._type === "Component")
        autoResize(alteredItemObject._id, alteredItemObject._name);

    return;
}

function alterItemsDetails(actionItems) {
    changeDetails(actionItems.updatedItem);
}

function inverseItemsDetails(actionItems) {
    changeDetails(actionItems.initialItem);
}

function setLastOriginalItem(it) {
    lastOriginalItem = it;
    return;
}

function extendSubcomponentsAction(actionItems) {
    const extendItems = JSON.parse(actionItems.initialItem);
    for (var x in extendItems)
        turnOnExtension(extendItems[x]._id);
}

function collapseSubcomponentsAction(actionItems) {
    const collapseItems = JSON.parse(actionItems.initialItem);
    for (var x in collapseItems)
        turnOffExtension(collapseItems[x]._id);
}

export { detailChangeListener, inverseItemsDetails, alterItemsDetails, setLastOriginalItem, extendSubcomponentsAction, collapseSubcomponentsAction };