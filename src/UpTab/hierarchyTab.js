import { moveToNext, moveToPrev } from "../Actions/inverseHierarchyActions.js";
import { getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { itemFromListToObject } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { getSelectedItems } from "../Item/selectComponent.js";
import { moveItemsTo, setUpMoveAction } from "../Layers/moveItem.js";


// select.innerHTML = "<option value=\"id\">" + layerName + "</option>";

function getDisabledLayers(selectedItems) {
    var disabledLayerIds = [];
    for (var i in selectedItems) {
        if (selectedItems[i].subLayers.length != 0) {
            disabledLayerIds.push(selectedItems[i].subLayers[0]);
        }
    }
    if (!disabledLayerIds)
        return;
    console.log(disabledLayerIds);
    for (var x in disabledLayerIds) {
        const layerItems = layers.itemMap.get(disabledLayerIds[x]).itemList;
        for (var i in layerItems) {
            if (layerItems[i].subLayers)
                disabledLayerIds.push(layerItems[i].subLayers[0]);
        }
    }
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

function addHierarchyTabListeners() {
    document.getElementById("moveToLayerButton").style.display = "none";
    document.getElementById("moveToLayerButton").addEventListener("click", function() {
        const selectedItems = getSelectedItems();
        if (getDisabledLayers(selectedItems).length === layers.idList.length) {
            produceBox('updating', "Cannot move items to another layer.", '');
            return;
        }
        produceBox('selecting', [constantNames["layersTab"]["moveBox"], createSelectElementsFromLayers(selectedItems)], function(layerId) {
            const itemLinks = getLinkItems(selectedItems);
            console.log(itemLinks);
            // var itemToBeJoined = selectedItems;
            // if (itemLinks[0]) {
            //     itemToBeJoined = selectedItems.concat(itemLinks);
            //     // itemToBeJoined = JSON.parse(itemFromListToObject(binded));
            // }
            // // setUpMoveAction(layerId, itemToBeJoined);
            // const initialItem = [layers.selectedLayer._id, itemFromListToObject(itemToBeJoined)];
            // const updatedItem = [layerId, itemFromListToObject(itemToBeJoined)];
            // actions.saveCommand(moveToNext, moveToPrev, initialItem, updatedItem);
            setUpMoveAction(layerId, selectedItems, itemLinks);
            moveItemsTo(layerId, selectedItems);

        });
        return;
    });
}

export { addHierarchyTabListeners };