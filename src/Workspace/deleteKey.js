import { createMultipleSpecificFunctions } from "../Actions/inverseFunctionsActions.js";
import { restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { deleteFunction } from "../Item/edit.js";
import { unlinkWithLinkSelection } from "../Item/Link.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { getSelectedLinkItems } from "../Item/selectLink.js";
import { createSendingItem } from "../Layers/moveItem.js";
import { deleteComponentAction } from "../UpTab/componentTab.js";

function handleLinkDeletion(links) {
    for (var x in links) {
        unlinkWithLinkSelection(links[x]);
        items.delete(links[x]._id);
    }
    return;
}

function handleFunctionDeletion(functions) {
    for (var x in functions) {
        items.delete(functions[x]._id);
    }
    return;
}

function handleComponentDeletion(components) {
    for (var i = 0; i < components.length; i++) {
        items.delete(components[i]._id);
    }
}

function deleteFromKey() {
    const components = getSelectedItems();
    const componentLinks = getLinkItems(components);
    var linkArg;
    if (componentLinks.length === 0)
        linkArg = "";
    else
        linkArg = itemFromListToObject(componentLinks);

    const operations = getSelectedFunctions();
    const links = getSelectedLinkItems();
    const allElements = [links, operations, components];
    const allStrElements = [itemFromListToObject(links), itemFromListToObject(operations), [createSendingItem(components), linkArg]];
    handleLinkDeletion(links);
    handleFunctionDeletion(operations);
    handleComponentDeletion(components);

    // setTimeout(() => { console.log(totalElements); }, 1000)
    actions.saveCommand((actionItems) => {
        console.log(actionItems);
        (actionItems.initialItem[0]) ? handleLinkDeletion(actionItems.initialItem[0]) : 1;
        (actionItems.initialItem[1]) ? handleFunctionDeletion(actionItems.initialItem[1]) : 1;
        (actionItems.initialItem[2]) ? handleComponentDeletion(actionItems.initialItem[2]) : 1;
    }, (actionItems) => {
        // ()
        // actions.saveCommand(deleteSpecificItems, restoreFromTrashBin, [str, linkArg], "");
        // console.log(actionItems.updatedItem[2]);
        console.log(actionItems.updatedItem[2]);

        (actionItems.updatedItem[1] !== "}") ? createMultipleSpecificFunctions({ initialItem: actionItems.updatedItem[1] }) : 1;
        (actionItems.updatedItem[2][0] !== "}") ? restoreFromTrashBin({ initialItem: actionItems.updatedItem[2] }) : 1;
        if (actionItems.updatedItem[0] !== "}") {
            const allLinks = JSON.parse(actionItems.updatedItem[0]);
            for (var x in allLinks) {
                var l = new Item(allLinks[x]);
            }
        }

    }, allElements, allStrElements);
    return;
}

export { deleteFromKey };