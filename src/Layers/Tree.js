import { changeNextLayer, changePrevLayer } from "../Actions/inverseLayerActions.js";
import { actions } from "../Classes/Actions.js";
import { layers } from "../Classes/LayerHolder.js";
import { cropName } from "../HtmlElements/doubleClickEditing.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { cancelSelection } from "../Item/selectComponent.js";

var treeData = []; //hold it and write it to json

function refreshTree() {
    document.getElementById('jstree').remove();
    var jsTreeDiv = document.createElement('div');
    var jsTreeStr = '<div style="width:150px; padding-top: 50px;" id="jstree"></div>'
    jsTreeDiv.innerHTML = jsTreeStr;
    document.getElementById('fSidebar').appendChild(jsTreeDiv);

    $('#jstree').jstree({
        'core': {
            'data': treeData
        }
    }).on('changed.jstree', function(e, data) {
        closeTheTooltip();
        cancelSelection();
        if (document.getElementById("selectedComponentsList"))
            document.getElementById("selectedComponentsList").innerHTML = "";
        var oldLayerId = layers.selectedLayer._id;
        var currentId = data.node.id.split("branch")[0];
        layers.changeLayer(currentId);
        actions.saveCommand(changeNextLayer, changePrevLayer, oldLayerId, currentId);
    });

}

function openLayerTree() {
    document.getElementById("fSidebar").style.display = "block";
    document.getElementById("jstree").style.display = "block";
}

function closeLayerTree() {
    document.getElementById("fSidebar").style.display = "none";
    document.getElementById("jstree").style.display = "none";
}

function initializeTree() {
    document.getElementById("closeLayersButton").addEventListener("click", closeLayerTree);
}

function addToArchitectureList(id, name, parentId) {
    var treeBranch;
    if (parentId === "#") {
        treeBranch = { "id": id + "branch", "parent": parentId, "text": name };
    } else {
        treeBranch = { "id": id + "branch", "parent": parentId + "branch", "text": cropName(name, 19) };
    }
    treeData.push(treeBranch);
    refreshTree();
    var str = JSON.stringify(treeBranch);
    return str;
}

function clearTree() {
    treeData = [];
    refreshTree();
}

function updateTree() {
    treeData = [];
    for (var i = 0; i < layers.layerList.length; i++) {
        treeData.push(JSON.parse(layers.layerList[i].treeObj));
    }
    refreshTree();
}


export { initializeTree, openLayerTree, closeLayerTree, addToArchitectureList, treeData, clearTree, updateTree };