import { layers } from "../Classes/LayerHolder.js";
import { turnOffExtension, turnOnExtension, turnOnDescription, turnOffDescription } from "../HtmlElements/extendingComponent.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { appearComponentButtons, appearFunctionButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { hideCurrentFunctions, resetOwner, showAll, showByComponent } from "../Workspace/functionAppearance.js";

function refreshExtendedComponents(layersItems) {
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component" && document.getElementById(layersItems[x]._id + "l1") && !document.getElementById(layersItems[x]._id + "Description")) {
            // console.log(layersItems[x]._name);
            turnOffExtension(layersItems[x]._id);
            turnOnExtension(layersItems[x]._id);
        }
    }
    return;
}

function refreshDescriptionExtension(layersItems){
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component" && document.getElementById(layersItems[x]._id + "Description")) {
            console.log(layersItems[x]._name);
            turnOnDescription(layersItems[x]);
            turnOffDescription(layersItems[x]);
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
    if (document.getElementById('all').checked)
        showAll();
    else
        showByComponent();
    // resetOwner()
    return;
}

export { actionsOfNextLayer };