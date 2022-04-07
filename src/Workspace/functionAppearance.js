import { imageStorage } from "../Classes/ImageHolder.js";
import { items } from "../Classes/ItemArray.js";
import { functionColors } from "../config/functionStyle.js";
import { toggleSelectedComponents } from "../HtmlElements/upTabCreation.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";

var lastSelected = "";

function setLastSelected(id) {
    lastSelected = id;
    return;
}

function configAppearance(display) {
    for (var i in items.itemList) {
        if (items.itemList[i]._type === "Function") {
            document.getElementById(items.itemList[i]._id + 'external').style.display = display;
        }
    }
    return;
}

function showByComponent() {
    hideCurrentFunctions();
    configAppearance("none");
    const selectedIds = getSelectedIds();
    if (!selectedIds || !selectedIds[0])
        return;
    for (var x in selectedIds) {
        showSpecificFunctions(selectedIds[x]);
    }
    return;
}

function showOwner(functionItem) {
    const ownerId = functionItem.owners[0];
    if (!ownerId)
        return;
    const ownerName = items.itemList[items.itemList.findIndex((el) => el._id === ownerId)]._name;
    var newName = functionItem._name + '  <' + ownerName + '>';
    document.getElementById(functionItem._id + 'name').innerText = functionItem._name + '  <' + ownerName + '>';
    setTimeout(() => { //due to listeners...
        if (!document.getElementById("byComponent").checked)
            document.getElementById(functionItem._id).style.backgroundColor = functionColors["attached"];
    }, 50)

    return;
}

function resetOwner(functionItem) {
    document.getElementById(functionItem._id + 'name').innerText = functionItem._name;
    document.getElementById(functionItem._id).style.backgroundColor = "";
    return;
}


function showAll() {
    configAppearance("block");
    const allItemList = items.itemList;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            showOwner(allItemList[i]);
        }
    }
    return;
}

function updateSelectedList() {
    const componentsIdList = getSelectedIds();
    const componentItems = getSelectedItems()
    document.getElementById("selectedComponentList").innerHTML = "";
    for (var x in componentsIdList) {
        showSpecificFunctions(componentsIdList[x]);
        if (!document.getElementById("selectedComponentList").innerHTML)
            document.getElementById("selectedComponentList").innerHTML = componentItems[x]._name;
        else
            document.getElementById("selectedComponentList").innerHTML += ", " + componentItems[x]._name;
    }
}

function hideCurrentFunctions() {
    const allItemList = items.itemList;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            document.getElementById(allItemList[i]._id + 'name').innerText = allItemList[i]._name;
            document.getElementById(allItemList[i]._id).style.backgroundColor = "";
        }
    }
    configAppearance("none");
    return;
}

function showSpecificFunctions(id) {
    var component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    for (var i in component._functions) {
        document.getElementById(component._functions[i] + 'external').style.display = "block";
    }
    return;
}

function showAllRefresh() {
    showByComponent();
    showAll();
    return;
}

function setUpFunctionDisplayListeners() {
    document.getElementById("all").addEventListener("change", function() {
        if (document.getElementById("all").checked) {
            cancelFunctionSelection();
            document.getElementById("byComponent").checked = false;
            showAll();
            toggleSelectedComponents();
        }
    });

    document.getElementById("byComponent").addEventListener("change", function() {
        if (document.getElementById("byComponent").checked) {
            cancelFunctionSelection();
            document.getElementById("all").checked = false;
            showByComponent();
            toggleSelectedComponents();
            updateSelectedList();
        }
    });
    return;
}

export { setUpFunctionDisplayListeners, configAppearance, showAllRefresh, updateSelectedList, setLastSelected, showByComponent, hideCurrentFunctions, showAll, showSpecificFunctions, resetOwner, showOwner };