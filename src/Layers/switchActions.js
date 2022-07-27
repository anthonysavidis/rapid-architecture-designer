import { configStyle } from "../Classes/Config.js";
import { layers } from "../Classes/LayerHolder.js";
import { turnOffExtension, turnOnExtension, turnOnDescription, turnOffDescription, calculateSubcomponents } from "../HtmlElements/extendingComponent.js";
import { getCurrentFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { appearComponentButtons, appearFunctionButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { hideCurrentFunctions, isAllChecked, resetOwner, showAll, showByComponent } from "../Workspace/functionAppearance.js";
import { updateLayerInfoBox } from "./layerInfoFunctions.js";

function refreshExtendedComponents(layersItems) {
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component" && document.getElementById(layersItems[x]._id + "l1") && !document.getElementById(layersItems[x]._id + "Description")) {
            // console.log(layersItems[x]._name);
            turnOffExtension(layersItems[x]._id);
            if (calculateSubcomponents(layersItems[x]._id).length !== 0)
                turnOnExtension(layersItems[x]._id);
        }
    }
    return;
}

function refreshDescriptionExtension(layersItems) {
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component" && configStyle.descriptionEnabled) {
            turnOffDescription(layersItems[x]);
            turnOnDescription(layersItems[x]);
        }
    }
    return;
}

function enableLayerDescriptionExtension(layersItems) {
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component") {
            turnOnDescription(layersItems[x]);
        }
    }
    return;
}


function actionsOfNextLayer(layerId) {
    const layerItems = layers.itemMap.get(layerId);
    refreshExtendedComponents(layerItems.itemList);
    refreshDescriptionExtension(layerItems.itemList);
    hideCurrentFunctions();
    closeTheTooltip();
    cancelSelection();
    appearComponentButtons();
    appearFunctionButtons();
    appearHierarchyButtons();
    if (isAllChecked())
        showAll();
    else
        showByComponent();
    // resetOwner()
    updateLayerInfoBox();
    return;
}

export { actionsOfNextLayer, enableLayerDescriptionExtension, refreshDescriptionExtension };