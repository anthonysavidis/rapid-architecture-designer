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
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { imageStorage } from "../Classes/ImageHolder.js";
import { configStyle } from "../Classes/Config.js";
import { turnOffDescription, turnOnDescription } from "../HtmlElements/extendingComponent.js";


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
    closeTheTooltip();
    var itemObject = JSON.parse(actionItems.updatedItem);
    items.delete(itemObject._id);
}


function deleteSpecificItems(actionItems) {
    closeTheTooltip();

    var totalObject = JSON.parse(actionItems.initialItem[0]);
    var restoringItems = totalObject["ItemMap"]["current"];
    for (var x in restoringItems) {
        var it = JSON.parse(restoringItems[x]);
        if (it._type === "Component") {
            items.delete(it._id);
        }
    }
    if (document.getElementById('all').checked) {
        showAllRefresh();
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
    closeTheTooltip();
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
    pasteFromStr(actionItems.updatedItem);
    var againId = actionItems.initialItem;
    var componentId = layers.layerList[layers.layerList.findIndex(el => el._id === againId)].componentId;
    items.itemList[items.itemList.findIndex(el => el._id === componentId)].subLayers[0] = againId;
    return;
}

function createNewLayer(actionItems) {
    var lid = layers.selectedLayer._id;
    var l = new Layer("", -1, -1, JSON.parse(actionItems.updatedItem), 0);
    // if (actionItems.initialItem !== "")
    imageStorage.save(l._id + "_LAYER_PREVIEW", "");
    updateTree();
    layers.changeLayer(lid);
    items.itemList[items.itemList.findIndex((el) => el._id === l.componentId)].subLayers[0] = l._id;
}

function deleteSpecificLayer(actionItems) {
    layers.deleteLayer(actionItems.initialItem);
    // layers.changeLayer(layers.idList[0]);
    updateTree();
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

function enableDescriptionInAllComponents(actionItems) {
    // if (document.getElementById("descriptionSwitch").checked) {
    const currentLayerId = layers.selectedLayer._id;

    if (document.getElementById("descriptionSwitch")) {
        document.getElementById("descriptionSwitch").checked = true;
        document.getElementById("descArea").style.display = "inline-block";
    }
    configStyle.descriptionEnabled = true;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        for (var y in layerItems.itemList) {
            if (layerItems.itemList[y]._type === "Component") {
                // oldBrecs.push()
                turnOnDescription(layerItems.itemList[y]);
            }
        }
    }
    // console.log(bRecs);
    layers.changeLayer(currentLayerId);
}

function disableDescriptionInAllComponents(actionItems) {
    // if (document.getElementById("descriptionSwitch").checked) {
    const currentLayerId = layers.selectedLayer._id;
    if (document.getElementById("descriptionSwitch")) {
        document.getElementById("descriptionSwitch").checked = false;
        document.getElementById("descArea").style.display = "none";
    }
    configStyle.descriptionEnabled = false;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        for (var y in layerItems.itemList) {
            if (layerItems.itemList[y]._type === "Component") {
                // oldBrecs.push()
                turnOffDescription(layerItems.itemList[y]);
                if (actionItems.initialItem !== "") {
                    const oldBRec = JSON.parse(actionItems.initialItem[layerItems.itemList[y]._id]);
                    document.getElementById(layerItems.itemList[y]._id).style.top = oldBRec.top + "px";
                    document.getElementById(layerItems.itemList[y]._id).style.left = oldBRec.left + "px";
                    document.getElementById(layerItems.itemList[y]._id).style.width = oldBRec.width + "px";
                    document.getElementById(layerItems.itemList[y]._id).style.height = oldBRec.height + "px";
                }
            }
        }
    }
    // console.log(bRecs);
    layers.changeLayer(currentLayerId);
}


export { spawnSpecificItem, deleteLatestItem, respawnDeletedItems, createNewLayer, deleteSpecificItems, linkItems, unlinkItems, splitAction, joinAction, createSpecificLayer, deleteSpecificLayer, pasteAction, deletePastedItems, enableDescriptionInAllComponents, disableDescriptionInAllComponents };