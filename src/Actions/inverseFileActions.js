import { configStyle } from "../Classes/Config.js";
import { LayerHolder, layers } from "../Classes/LayerHolder.js";
import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { enableLayerDescriptionExtension } from "../Layers/switchActions.js";

function loadPrev(actionItems) {
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
    }
    var lh = new LayerHolder(actionItems.initialItem);
    if (configStyle.autoFit)
        autoResizeAllComponents();
    else
        checkAndResize();

}

function loadNext(actionItems) {
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
    }
    var lh = new LayerHolder(actionItems.updatedItem);
    if (configStyle.autoFit)
        autoResizeAllComponents();
    else
        checkAndResize();

}

export { loadNext, loadPrev };