import { configStyle } from "../Classes/Config.js";
import { LayerHolder, layers, refreshAllLinks } from "../Classes/LayerHolder.js";
import { createFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { enableLayerDescriptionExtension } from "../Layers/switchActions.js";
import { updateTree } from "../Layers/Tree.js";
import { measureAllLayersOperations } from "../Workspace/selectedOperationsHandler.js";

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
    (configStyle.descriptionEnabled) ? refreshAllLinks(): 1;
    // updateTree();
    updateFullPath(layers.layerList[0]._name);
    measureAllLayersOperations();


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
    (configStyle.descriptionEnabled) ? refreshAllLinks(): 1;
    // updateTree();
    updateFullPath(layers.layerList[0]._name);
    measureAllLayersOperations();


}

export { loadNext, loadPrev };