import { changeNextLayer, changePrevLayer } from "../Actions/inverseLayerActions.js";
import { actions } from "../Classes/Actions.js";
import { layers } from "../Classes/LayerHolder.js";
import { cropName, produceDoubleClickEditingLayerName } from "../HtmlElements/doubleClickEditing.js";
import { removeLayerTabRod } from "../HtmlElements/extendingSideTabs.js";
import { getCurrentFullPath, updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { cancelSelection } from "../Item/selectComponent.js";

var treeData = []; //hold it and write it to json

function createNodeFullPath(data) {
    var path = data.instance.get_path(data.node, '/');
    // console.log('Selected: ' + path);
    updateFullPath(path);
}

function addNameListener(id) {
    document.getElementById(id).oncontextmenu = (e) => {
        e.preventDefault();
        const currentId = id.split("branch")[0];
        const layerObject = layers.layerList[layers.layerList.findIndex(el => el._id === currentId)];
        const oldName = layerObject._name;
        const domId = id + "_anchor";
        const rect = document.getElementById(domId).getBoundingClientRect();
        produceDoubleClickEditingLayerName(domId, oldName, layerObject, rect);
        // refreshTree();
    }
}

function refreshTree() {
    document.getElementById('jstree').remove();
    var jsTreeDiv = document.createElement('div');
    jsTreeDiv.id = "jstree";
    jsTreeDiv.style.width = 150 + "px";
    jsTreeDiv.style.paddingTop = 10 + "px";
    // var jsTreeStr = '<div style="width:150px; padding-top: 50px;" id="jstree"></div>'
    // jsTreeDiv.innerHTML = jsTreeStr;
    document.getElementById('fSidebar').appendChild(jsTreeDiv);

    $('#jstree').jstree({
        'core': {
            'data': treeData
        }
    }).on('changed.jstree', function (e, data) {
        // createNodeFullPath(data);
        closeTheTooltip();
        cancelSelection();
        if (document.getElementById("selectedComponentsList"))
            document.getElementById("selectedComponentsList").innerHTML = "";
        var oldLayerId = layers.selectedLayer._id;
        var currentId = data.node.id.split("branch")[0];
        // addNameListener(data.node.id)
        // $('#' + data.node.id).on("contextmenu", '#jstree', function(e) {
        //     // this fires even the #js-categories-container is not there yet 
        //     e.preventDefault();
        //     var node = $('#jstree').jstree().get_node(event.target);

        //     console.log(node);

        // });
        layers.changeLayer(currentId);
        actions.saveCommand(changeNextLayer, changePrevLayer, oldLayerId, currentId);
        updateFullPath(getCurrentFullPath());
    });
    $('#jstree').bind("loaded.jstree", function (e, data) {
        $('#tree').jstree("select_node", layers.selectedLayer._id + "branch", true);
    });


}

function openLayerTree() {

    document.getElementById("fSidebar").style.display = "block";
    document.getElementById("jstree").style.display = "block";
    $('#jstree').jstree(true).select_node(layers.selectedLayer._id + "branch");
    // $('#jstree').jstree('select_node', layers.selectedLayer._id + "branch");

}

function closeLayerTree() {
    document.getElementById("fSidebar").style.display = "none";
    document.getElementById("jstree").style.display = "none";
}

function initializeTree() {
    document.getElementById("closeLayersButton").addEventListener("mousedown", () => {
        closeLayerTree();
        removeLayerTabRod();
    });
}

function addToArchitectureList(id, name, parentId, componentId) {
    var treeBranch;
    if (parentId === "#") {
        treeBranch = { "id": id + "branch", "parent": parentId, "text": name };
    } else {
        treeBranch = { "id": id + "branch", "parent": parentId + "branch", "text": name };
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

function searchForName(id, pLayer) {
    var currentItemList = layers.itemMap.get(pLayer).itemList;
    return currentItemList[currentItemList.findIndex(el => el._id === id)]._name;
}

function updateTree() {
    treeData = [];
    for (var i = 0; i < layers.layerList.length; i++) {
        var obj = JSON.parse(layers.layerList[i].treeObj);
        // if (i != 0)
        //     obj.text = obj.text + searchForName(layers.layerList[i].componentId, layers.layerList[i].parentId);
        treeData.push(obj);
    }
    refreshTree();
}

function changeTreeName(id, name) {
    treeData[treeData.findIndex(el => el.id === id + "branch")].text = name;
    return;
}

function getTreeData() {
    // var v = $('#jstree').jstree(true).get_json('#', { flat: true })
    // var mytext = JSON.stringify(v);
    // return JSON.parse(mytext);
    return treeData;
}

export { initializeTree, getTreeData, searchForName, openLayerTree, createNodeFullPath, closeLayerTree, addToArchitectureList, treeData, changeTreeName, clearTree, updateTree };