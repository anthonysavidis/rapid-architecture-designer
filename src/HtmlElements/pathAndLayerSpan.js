import { layers } from "../Classes/LayerHolder.js";
import { getTreeData } from "../Layers/Tree.js";

var currentText = 'Initial';

function updateFullPath(text) {
    currentText = text;
    // document.getElementById('layerPath').innerHTML = text;
    createFullPath();
    return;
}

function getPathTextDimensions(str) {

    var text = document.createElement("span");
    document.body.appendChild(text);

    var fontSize = "large";
    var fontFamily = "Arial, Helvetica, sans-serif";

    text.style.fontFamily = fontFamily;
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return { width: width, height: height };
}


function replaceOnFullPath(oldName, newName) {
    var oldPath = document.getElementById('layerPath').innerHTML;
    document.getElementById('layerPath').innerHTML = oldPath.replace(oldName, newName);
}

function createFullPath() {
    var path = document.createElement('div');
    if (document.getElementById('layerPath'))
        document.getElementById('layerPath').remove();
    path.id = 'layerPath';
    path.className = 'layerPath';
    path.style.top = '3px';
    path.style.color = '#557da5';
    var tabRec = document.getElementById('tabButtons').getBoundingClientRect();
    var spaceRec = document.getElementById('space').getBoundingClientRect();
    var positionY = tabRec.height + tabRec.y;
    path.innerHTML = currentText;
    document.getElementById('space').appendChild(path);
    var textDims = getPathTextDimensions(currentText);
    // path.style.top = spaceRec.top + "px";
    path.style.left = spaceRec.width / 2 - textDims.width / 2 + "px";
    return;
}

function getTreeNodeFromJSON(id, treeData) {
    const jsonId = (id.includes('branch') ? id : id + 'branch');
    for (var x in treeData) {
        if (treeData[x]["id"] === jsonId)
            return treeData[x];
    }
    return null;
}

function getParentComponentName(lid) {
    const componentId = layers.layerList[layers.layerList.findIndex(el => el._id === lid)].componentId;
    const itemIndex = layers.itemMap.get(lid).itemList.findIndex(el => el._id === componentId);
    return layers.itemMap.get(lid).itemList[itemIndex]._name;
}

function getCurrentFullPath() {
    const treeData = getTreeData();
    var path = "";
    var treeNode = getTreeNodeFromJSON(layers.selectedLayer._id, treeData);
    if (treeNode["parent"] === "#")
        return layers.layerList[0]._name; //the first

    while (treeNode["parent"] !== '#') {
        const layerId = treeNode["id"].split("branch")[0];
        const componentId = layers.layerList[layers.layerList.findIndex(el => el._id === layerId)].componentId;
        const parentLayerId = treeNode["parent"].split("branch")[0];
        const componentName = layers.itemMap.get(parentLayerId).itemList[layers.itemMap.get(parentLayerId).itemList.findIndex(el => el._id === componentId)]._name;
        const pathPart = layers.layerList[layers.layerList.findIndex(el => el._id === layerId)]._name;
        path = (path === "") ? pathPart : pathPart + "/" + path;
        treeNode = getTreeNodeFromJSON(treeNode["parent"], treeData);
    }
    return layers.layerList[0]._name + "/" + path;
}

export { updateFullPath, createFullPath, replaceOnFullPath, getCurrentFullPath };