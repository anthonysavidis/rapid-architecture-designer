import { layers } from "../Classes/LayerHolder.js";
import { getCurrentFullPath, replaceOnFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { changeTreeName, updateTree } from "../Layers/Tree.js";

function changeNextLayer(actionItems) {
    layers.changeLayer(actionItems.updatedItem);
    updateFullPath(getCurrentFullPath());
    updateTree();
}

function changePrevLayer(actionItems) {
    layers.changeLayer(actionItems.initialItem);
    updateFullPath(getCurrentFullPath());
    updateTree();

}

function changeLayerName(obj) {
    var [domId, lid, name, componentName] = obj;
    const layerObject = layers.layerList[layers.layerList.findIndex(e => e._id === lid)];
    const oldName = layerObject._name;
    layers.layerList[layers.layerList.findIndex(e => e._id === lid)].updateLayerName(name);
    // document.getElementById(domId).innerHTML = '<i class="jstree-icon jstree-themeicon" role="presentation"></i>' + name + " " + ' &lt;' + layerObject.componentId + '&gt;';
    // if (layers.idList[0] === layerObject._id)
    //     document.getElementById(domId).innerHTML = '<i class="jstree-icon jstree-themeicon" role="presentation"></i>' + name;
    // else
    //     document.getElementById(domId).innerHTML = '<i class="jstree-icon jstree-themeicon" role="presentation"></i>' + name + " " + ' &lt;' + componentName + '&gt;';
    changeTreeName(lid, name);
    replaceOnFullPath(oldName, name);
    updateTree();
    return;
}

function changeNextLayerName(actionItems) {
    const nextObj = JSON.parse(actionItems.updatedItem);
    changeLayerName(nextObj);
    return;
}

function changePrevLayerName(actionItems) {
    const prevObj = JSON.parse(actionItems.initialItem);
    changeLayerName(prevObj);
    return;
}

export { changeNextLayer, changePrevLayer, changeNextLayerName, changePrevLayerName }