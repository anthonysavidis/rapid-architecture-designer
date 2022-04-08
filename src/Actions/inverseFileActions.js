import { LayerHolder, layers } from "../Classes/LayerHolder.js";

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