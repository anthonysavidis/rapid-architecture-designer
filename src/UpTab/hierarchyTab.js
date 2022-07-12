import { moveToNext, moveToPrev } from "../Actions/inverseHierarchyActions.js";
import { getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { itemFromListToObject } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { produceLayerTabRod, removeLayerTabRod } from "../HtmlElements/extendingSideTabs.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { closeInfo, createLayerInfoModal } from "../HtmlElements/layerInfo.js";
import { getSelectedItems } from "../Item/selectComponent.js";
import { moveItemsTo, setUpMoveAction } from "../Layers/moveItem.js";
import { closeLayerTree, openLayerTree } from "../Layers/Tree.js";


// select.innerHTML = "<option value=\"id\">" + layerName + "</option>";

function getDisabledLayers(selectedItems) {
    var disabledLayerIds = [];
    for (var i in selectedItems) {
        if (selectedItems[i].subLayers[0]) {
            disabledLayerIds.push(selectedItems[i].subLayers[0]);
        }
    }
    if (!disabledLayerIds)
        return;
    for (var x in disabledLayerIds) {
        const layerItems = layers.itemMap.get(disabledLayerIds[x]).itemList;
        for (var i in layerItems) {
            if (layerItems[i]._type === "Component" && layerItems[i].subLayers[0])
                disabledLayerIds.push(layerItems[i].subLayers[0]);
        }
    }
    console.log(disabledLayerIds);
    disabledLayerIds.push(layers.selectedLayer._id);
    return disabledLayerIds;
}

function createSelectElementsFromLayers(selectedItems) {
    var selectStr = "";
    var disabledLayerIds = getDisabledLayers(selectedItems);

    for (var x in layers.layerList) {
        if (disabledLayerIds.includes(layers.layerList[x]._id))
            selectStr += "<option value=\"" + layers.layerList[x]._id + "\"disabled>" + layers.layerList[x]._name + "</option>"
        else
            selectStr += "<option value=\"" + layers.layerList[x]._id + "\">" + layers.layerList[x]._name + "</option>"
    }
    return selectStr;
}

// function moveTo(layerId, selectedItemList)

var treeIsShown = true;

function enableTreeFlag() {
    treeIsShown = true;
}

var moveToCntx = () => {};

function addHierarchyTabListeners() {
    document.getElementById("toggleHierarchyTreeButton").style.display = "inline-block";

    document.getElementById("moveToLayerButton").style.display = "none";
    document.getElementById("moveToLayerButton").addEventListener("click", moveToCntx = function() {
        const selectedItems = getSelectedItems();
        const disabled = getDisabledLayers(selectedItems).length;
        const l_no = layers.idList.length;
        console.log(disabled + " " + l_no);

        if (disabled === l_no) {
            produceBox('updating', constantNames["messages"]["moveToMsg"], '');
            return;
        }
        produceBox('selecting', [constantNames["layersTab"]["moveBox"], createSelectElementsFromLayers(selectedItems), "Move To"], function(layerId) {
            const itemLinks = getLinkItems(selectedItems);
            // console.log(itemLinks);
            // var itemToBeJoined = selectedItems;
            // if (itemLinks[0]) {
            //     itemToBeJoined = selectedItems.concat(itemLinks);
            //     // itemToBeJoined = JSON.parse(itemFromListToObject(binded));
            // }
            // // setUpMoveAction(layerId, itemToBeJoined);
            // const initialItem = [layers.selectedLayer._id, itemFromListToObject(itemToBeJoined)];
            // const updatedItem = [layerId, itemFromListToObject(itemToBeJoined)];
            // actions.saveCommand(moveToNext, moveToPrev, initialItem, updatedItem);
            if (!itemLinks)
                itemLinks = "";
            const nextSendingItem = moveItemsTo(layerId, selectedItems);
            setUpMoveAction(layerId, selectedItems, itemLinks, nextSendingItem);
            layers.changeLayer(layerId);

        });
        return;
    });
    document.getElementById("toggleHierarchyTreeButton").addEventListener("click", function() {
        if (!treeIsShown) {
            openLayerTree();
            produceLayerTabRod();
            treeIsShown = true;
        } else {
            closeLayerTree();
            removeLayerTabRod();
            treeIsShown = false;
        }
    });
    document.getElementById("infoLayerButton").addEventListener("click", () => {

        createLayerInfoModal();
    });
}

export { addHierarchyTabListeners, moveToCntx };