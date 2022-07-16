import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { appearComponentButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { hideCurrentFunctions, showByComponent, showSpecificFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";

function handleByComponent() {
    hideCurrentFunctions();
    // if (document.getElementById("byComponent").checked) {
    updateSelectedList();
    showByComponent();
    // }
    return;
}

const selectAction = function (compId) {
    // document.getElementById(compId).className = "selected";
    var selNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(compId);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].select(selNode);
    appearComponentButtons();
    appearHierarchyButtons();
    if (document.getElementById("byComponent").checked) {
        handleByComponent();
    }
    return;
}

function changeSelectState(id) {
    document.getElementById(id).addEventListener("mousedown", function (e) {
        if (!e.ctrlKey)
            cancelSelection();
        selectAction(id);
    });
    return;
}

function getSelectedIds() {
    var keys = [];
    InstanceGenerator.diagramMap[layers.selectedLayer._id].selection.each(function (n) {
        if (!(n instanceof go.Node)) return;
        keys.push(n.data.key);
    });
    return keys;
}

function getSelectedItems() {
    var ids = [];
    ids = getSelectedIds();
    var selectedItems = [];
    for (var i = 0; i < ids.length; i++) {
        var getItemFun = (element) => element._id === ids[i];
        var index = items.itemList.findIndex(getItemFun);
        // console.log(items.itemList[index]);
        selectedItems.push(items.itemList[index]);
    }
    return selectedItems;
}

function unlinkSelectedItems() {
    ids = getSelectedIds();
    for (var i = 0; i < ids.length; i++) {
        var getItemFun = (element) => element._id === ids[i];
        var index = items.itemList.findIndex(getItemFun);
        items.itemList[index].deleteLink(ids[ids.length - 1 - i]);
    }

}

function cancelSelection() {
    if (layers.selectedLayer && InstanceGenerator.diagramMap[layers.selectedLayer._id])
        InstanceGenerator.diagramMap[layers.selectedLayer._id].clearSelection();
    if (document.getElementById("byComponent").checked) {
        handleByComponent();
    }
}

function keepOnlyLastSelectedItem(id) {
    var y = document.getElementsByClassName("selected");
    var i = 0;
    while (y.length !== 1) {
        if (y[i].id === id) {
            i++;
            continue;
        }
        y[i].className = "component";
    }
}

export { changeSelectState, cancelSelection, handleByComponent, getSelectedIds, getSelectedItems, selectAction, keepOnlyLastSelectedItem };