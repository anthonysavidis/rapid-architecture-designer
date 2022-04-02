import { layers } from "../Classes/LayerHolder.js";
import { turnOffExtension, turnOnExtension } from "../HtmlElements/extendingComponent.js";

function refreshExtendedComponents(layersItems) {
    for (var x in layersItems) {
        if (layersItems[x]._type === "Component" && document.getElementById(layersItems[x]._id + "l1")) {
            console.log(layersItems[x]._name);
            turnOffExtension(layersItems[x]._id);
            turnOnExtension(layersItems[x]._id);
        }
    }
    return;
}

function actionsOfNextLayer(layerId) {
    const layerItems = layers.itemMap.get(layerId);
    refreshExtendedComponents(layerItems.itemList);
    return;
}

export { actionsOfNextLayer };