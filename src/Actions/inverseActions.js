import { Item } from "../Classes/Item.js";
import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { joinComponents, splitComponent } from "../Item/split.js";
import { layers } from "../Classes/LayerHolder.js";
import { Layer } from "../Classes/Layer.js";
import { updateTree } from "../Layers/Tree.js";
import { pasteComponentAction } from "../UpTab/componentTab.js";
import { pasteFromStr } from "../Item/copy.js";
import { showAllRefresh } from "../Workspace/functionAppearance.js";
import { selectAction } from "../Item/selectComponent.js";


function spawnSpecificItem(actionItems) {
    var it = new Item(actionItems.updatedItem);
    if (it._functions) {
        const functionIds = it._functions;
        it._functions = [];
        for (var x in functionIds) {
            items.deleteFunctionFromOwner(it._id, functionIds[x]);
            items.setFunctionToItem(it._id, functionIds[x]);
        }
    }
    return;
}

function deleteLatestItem(actionItems) {
    var itemObject = JSON.parse(actionItems.updatedItem);
    items.delete(itemObject._id);
}


function deleteSpecificItems(actionItems) {
    var deletedItems = JSON.parse(actionItems.initialItem);
    for (var x in deletedItems) {
        if (!items.idList.includes(deletedItems[x]._id) && deletedItems[x]._type === "Link") {
            continue; //ok deleted from the others.
        }
        items.delete(deletedItems[x]._id);
    }
    return;
}

function respawnDeletedItems(actionItems) {
    var respawningItems = JSON.parse(actionItems.initialItem);
    for (var x in respawningItems) {
        var it = new Item(JSON.stringify(respawningItems[x]), 0);
        if (it._functions) {
            const functionIds = it._functions;
            it._functions = [];
            for (var x in functionIds) {
                items.deleteFunctionFromOwner(it._id, functionIds[x]);
                items.setFunctionToItem(it._id, functionIds[x]);
            }
        }
    }
    return;
}



function linkItems(actionItems) {
    var toBeLinkedItems = JSON.parse(actionItems.initialItem);
    var link = new Item(JSON.stringify(toBeLinkedItems[2]));
    items.addLink(link._id, toBeLinkedItems[0]._id, toBeLinkedItems[1]._id);
    return;
}

function unlinkItems(actionItems) {
    var toBeUnlinkedItems = JSON.parse(actionItems.initialItem);
    var index0 = items.itemList.findIndex((el) => el._id === toBeUnlinkedItems[0]._id);
    var index1 = items.itemList.findIndex((el) => el._id === toBeUnlinkedItems[1]._id);
    items.itemList[index0].deleteLink(toBeUnlinkedItems[1]._id);
    items.itemList[index1].deleteLink(toBeUnlinkedItems[0]._id);
    return;
}

function splitAction(actionItems) {
    var joinedItem = JSON.parse(actionItems.initialItem);
    items.delete(joinedItem._id);

    var splitedParts = actionItems.updatedItem; //ta parts.
    console.log(splitedParts);
    for (var x in splitedParts) {
        var itStr = JSON.stringify(splitedParts[x]);
        var it = new Item(itStr, 0);
        if (it._functions) {
            const functionIds = it._functions;
            it._functions = [];
            for (var x in functionIds) {
                items.deleteFunctionFromOwner(it._id, functionIds[x]);
                items.setFunctionToItem(it._id, functionIds[x]);
            }
        }
        //select all forcely
        (it._type === "Component") ? selectAction(it._id): 1;
    }
    if (document.getElementById('all').checked)
        showAllRefresh();
    return;
}


function joinAction(actionItems) {
    var joinedItemObj = JSON.parse(actionItems.initialItem);
    var joinedItem = new Item(JSON.stringify(joinedItemObj), 0);
    var splitedParts = actionItems.updatedItem //ta parts.
    for (var x in splitedParts) {
        if (splitedParts[x]._type === "Link")
            continue; //already deleted!
        items.delete(splitedParts[x]._id);
    }
    return;
}

function createSpecificLayer(actionItems) {
    var lid = layers.selectedLayer._id;
    console.log(actionItems);
    var l = new Layer("", -1, -1, JSON.parse(actionItems.updatedItem), 0);
    updateTree();
    layers.changeLayer(lid);
    console.log(layers);
    return;
}

function deleteSpecificLayer(actionItems) {
    layers.deleteLayer(JSON.parse(actionItems.updatedItem)._id);
    layers.changeLayer(layers.idList[0]);
    updateTree();
    console.log(layers);
    return;
}

function pasteAction(actionItems) {
    const pastingStr = actionItems.initialItem;
    pasteFromStr(pastingStr);
    return;
}

function deletePastedItems(actionItems) {
    const pastedItemsJSON = JSON.parse(actionItems.initialItem);
    const itemsToBeDeleted = pastedItemsJSON['ItemMap']['current'];
    for (var x in itemsToBeDeleted) {
        const itemToBeDeleted = JSON.parse(itemsToBeDeleted[x]);
        items.delete(itemToBeDeleted._id);
    }
}
export { spawnSpecificItem, deleteLatestItem, respawnDeletedItems, deleteSpecificItems, linkItems, unlinkItems, splitAction, joinAction, createSpecificLayer, deleteSpecificLayer, pasteAction, deletePastedItems };