import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { appearComponentButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { hideCurrentFunctions, isByComponentChecked, showByComponent, showSpecificFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";

function handleByComponent() {
    hideCurrentFunctions();
    updateSelectedList();
    showByComponent();
    return;
}

const selectAction = function (compId) {
    // document.getElementById(compId).className = "selected";
    var selNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(compId);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].select(selNode);
    appearComponentButtons();
    appearHierarchyButtons();
    if (isByComponentChecked()) {
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
    if (isByComponentChecked()) {
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

function updateSelectedComponentBoundingRec() {
    const selected = getSelectedItems();
    for (var x in selected)
        items.itemList[items.itemList.findIndex(el => el._id === selected[x]._id)].updateBoundingRec();
}

function getSelectedComponentBoundingRec() {
    const selected = getSelectedItems();
    const boundingRecMap = {}
    for (var x in selected)
        boundingRecMap[selected[x]._id] = items.itemList[items.itemList.findIndex(el => el._id === selected[x]._id)].boundingRec;
    return boundingRecMap;
}


export { changeSelectState, cancelSelection, handleByComponent, updateSelectedComponentBoundingRec, getSelectedComponentBoundingRec, getSelectedIds, getSelectedItems, selectAction, keepOnlyLastSelectedItem };