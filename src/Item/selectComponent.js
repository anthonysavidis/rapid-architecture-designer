import { items } from "../Classes/ItemArray.js";
import { hideCurrentFunctions, showByComponent, showSpecificFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";

function handleByComponent() {
    hideCurrentFunctions();
    // if (document.getElementById("byComponent").checked) {
    updateSelectedList();
    showByComponent();
    // }
    return;
}

const selectAction = function(compId) {
    document.getElementById(compId).className = "selected";
    if (document.getElementById("byComponent").checked) {
        handleByComponent();
    }
    return;
}

function changeSelectState(id) {
    document.getElementById(id).addEventListener("mousedown", function() {
        selectAction(id);
    });
    return;
}

function getSelectedIds() {
    var selected = document.getElementsByClassName("selected");
    var selectedIds = [];
    for (var i = 0; i < selected.length; i++) {
        selectedIds[i] = selected[i].id;
    }
    return selectedIds;
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
    // document.getElementById("linkButton").style.display="none";
    document.getElementById("selectedComponentList") ? document.getElementById("selectedComponentList").innerHTML = "" : 1;
    var y = document.getElementsByClassName("selected");
    while (y.length !== 0) {
        y[0].className = "component";
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

export { changeSelectState, cancelSelection, getSelectedIds, getSelectedItems, selectAction, keepOnlyLastSelectedItem };