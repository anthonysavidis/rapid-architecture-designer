import { configStyle } from "../Classes/Config.js";
import { LayerHolder, layers, refreshAllLinks } from "../Classes/LayerHolder.js";
import { moveAllComponentsOnLoad } from "../HtmlElements/goWorkspace.js";
import { createFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { enableLayerDescriptionExtension } from "../Layers/switchActions.js";
import { updateTree } from "../Layers/Tree.js";
import { forceActivateAll, isByComponentChecked } from "../Workspace/functionAppearance.js";
import { measureAllLayersOperations } from "../Workspace/selectedOperationsHandler.js";
import { hideCurrentSlider } from "../Workspace/zoomSlider.js";

function loadPrev(actionItems) {
    if (isByComponentChecked()) {
        forceActivateAll();
    }
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
        if (layers.selectedLayer && document.getElementById(layers.layerList[x]._id + "zoomSlider"))
            document.getElementById(layers.layerList[x]._id + "zoomSlider").remove();
    }
    var lh = new LayerHolder(actionItems.initialItem);
    if (configStyle.autoFit)
        autoResizeAllComponents();
    else
        checkAndResize();
    (configStyle.descriptionEnabled) ? refreshAllLinks() : 1;
    // updateTree();
    updateFullPath(layers.layerList[0]._name);
    measureAllLayersOperations();
    moveAllComponentsOnLoad(1400, 1100);


}

function loadNext(actionItems) {
    if (isByComponentChecked()) {
        forceActivateAll();
    }
    for (var x in layers.layerList) {
        document.getElementById(layers.layerList[x]._id).remove();
        document.getElementById(layers.layerList[x]._id + "functions").remove();
        if (layers.selectedLayer && document.getElementById(layers.layerList[x]._id + "zoomSlider"))
            document.getElementById(layers.layerList[x]._id + "zoomSlider").remove();
    }
    var lh = new LayerHolder(actionItems.updatedItem);
    if (configStyle.autoFit)
        autoResizeAllComponents();
    else
        checkAndResize();
    (configStyle.descriptionEnabled) ? refreshAllLinks() : 1;
    // updateTree();
    updateFullPath(layers.layerList[0]._name);
    measureAllLayersOperations();
    moveAllComponentsOnLoad(1400, 1100);


}

export { loadNext, loadPrev };