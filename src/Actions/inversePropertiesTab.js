import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { areAllExtendable, areAllExtended, turnOffDescription, turnOffExtension, turnOnDescription, turnOnExtension } from "../HtmlElements/extendingComponent.js";
import { appearComponentButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { isAllChecked, showAllRefresh, showByComponent } from "../Workspace/functionAppearance.js";
import { autoResizeDispatch, checkAndResize, passAutoFitRestrictions } from "../Item/autoResize.js";
import { configStyle } from "../Classes/Config.js";
import { renderLine } from "../Item/createLine.js";
import { setComponentsRec } from "../Classes/Item.js";
import { showSubarchitectureExpansion, hideSubarchitectureExpansion } from "../HtmlElements/goExtendedComponents.js"

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
    items.updateNameAndDescription(alteredItemObject._id, alteredItemObject._name, alteredItemObject._description, true); //if an error occurs can be replaced with false
    // items.itemList[items.itemList.findIndex((el) => el._id === alteredItemObject._id)].moreInfo = alteredItemObject.moreInfo;
    if (alteredItemObject._type === "Component") {
        var component = items.itemList[items.itemList.findIndex((el) => el._id === alteredItemObject._id)];
        // if (!passAutoFitRestrictions(component._id))
        //     autoResizeDispatch["autoFit"](component);
        // setComponentsRec(component, alteredItemObject.boundingRec);
        if (component._type === "Component" && configStyle.descriptionEnabled) {
            turnOffDescription(component);
            turnOnDescription(component);
        }
        if (component._type === "Component" && areAllExtendable([component])) {
            // turnOffExtension(component._id);
            // turnOnExtension(component._id);
            hideSubarchitectureExpansion([component]);
            showSubarchitectureExpansion([component]);
        }
    } else if (alteredItemObject._type === "Function") {
        if (isAllChecked()) {
            showAllRefresh();
        } else {
            showByComponent();
        }
    }
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
    appearComponentButtons();

}

function collapseSubcomponentsAction(actionItems) {
    const collapseItems = JSON.parse(actionItems.initialItem);
    const oldBRecs = actionItems.updatedItem;
    for (var x in collapseItems) {
        turnOffExtension(collapseItems[x]._id);
        if (oldBRecs !== "") {
            const oldBRec = JSON.parse(oldBRecs[collapseItems[x]._id]);
            document.getElementById(collapseItems[x]._id).style.top = oldBRec.top + "px";
            document.getElementById(collapseItems[x]._id).style.left = oldBRec.left + "px";
            document.getElementById(collapseItems[x]._id).style.width = oldBRec.width + "px";
            document.getElementById(collapseItems[x]._id).style.height = oldBRec.height + "px";
        }
    }
    appearComponentButtons();
}

export { detailChangeListener, inverseItemsDetails, alterItemsDetails, setLastOriginalItem, extendSubcomponentsAction, collapseSubcomponentsAction };