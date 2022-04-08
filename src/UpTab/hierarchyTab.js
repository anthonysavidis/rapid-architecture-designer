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
        produceBox('selecting', [constantNames["layersTab"]["moveBox"], createSelectElementsFromLayers(selectedItems)], function(layerId) {
            setUpMoveAction(layerId, selectedItems);
            moveItemsTo(layerId, selectedItems);
        });
        return;
    });
}

export { addHierarchyTabListeners };