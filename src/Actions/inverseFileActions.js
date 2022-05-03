import { configStyle } from "../Classes/Config.js";
import { LayerHolder, layers } from "../Classes/LayerHolder.js";
import { enableLayerDescriptionExtension } from "../Layers/switchActions.js";

function loadPrev(actionItems) {
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
    }
    var lh = new LayerHolder(actionItems.initialItem);

}

function loadNext(actionItems) {
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
    }
    var lh = new LayerHolder(actionItems.updatedItem);

}

export { loadNext, loadPrev };