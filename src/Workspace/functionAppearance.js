import { imageStorage } from "../Classes/ImageHolder.js";
import { items } from "../Classes/ItemArray.js";
import { functionColors } from "../config/functionStyle.js";
import { toggleSelectedComponents } from "../HtmlElements/upTabCreation.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";
import { changeMaxWidth, getSelectedFunctionWidth, measureAllLayersOperations, measureSelectedView, resetWidthToDefault } from "./selectedOperationsHandler.js";

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


function isByComponentChecked() {
    return document.getElementById("functionAppearance").value === "byComponent";
}

function isAllChecked() {
    return document.getElementById("functionAppearance").value === "all";
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
        if (!isByComponentChecked() && document.getElementById(functionItem._id))
            document.getElementById(functionItem._id).firstChild.className = "fIconSetted";
    }, 50)

    return;
}

function resetOwner(functionItem) {
    document.getElementById(functionItem._id + 'name').innerText = functionItem._name;
    document.getElementById(functionItem._id).firstChild.className = "ficon";
    return;
}


function showAll() {
    resetWidthToDefault();
    configAppearance("block");
    const allItemList = items.itemList;
    var maxWidth = 0;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            if (allItemList[i].owners[0])
                showOwner(allItemList[i]);
            else
                document.getElementById(allItemList[i]._id).firstChild.className = "ficon";
            const fWidth = getSelectedFunctionWidth(allItemList[i]._id);
            (maxWidth < fWidth) ? maxWidth = fWidth : 1;
        }
    }
    changeMaxWidth(maxWidth);

    return;
}
var maxCurrentOperationsWidth = 0;

function updateSelectedList() {
    if (isAllChecked())
        return;
    const componentsIdList = getSelectedIds();
    const componentItems = getSelectedItems()
    maxCurrentOperationsWidth = 0;
    document.getElementById("selectedComponentList").innerHTML = "";
    for (var x in componentsIdList) {
        showSpecificFunctions(componentsIdList[x]);
        if (!document.getElementById("selectedComponentList").innerHTML)
            document.getElementById("selectedComponentList").innerHTML = componentItems[x]._name;
        else
            document.getElementById("selectedComponentList").innerHTML += ", " + componentItems[x]._name;
    }
    changeMaxWidth(maxCurrentOperationsWidth);
}

function hideCurrentFunctions() {
    const allItemList = items.itemList;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            document.getElementById(allItemList[i]._id + 'name').innerText = allItemList[i]._name;
            // document.getElementById(allItemList[i]._id).style.backgroundColor = "";
            if (allItemList[i].owners[0])
                document.getElementById(allItemList[i]._id).firstChild.className = "fIconSetted";

        }
    }
    configAppearance("none");
    return;
}

function showSpecificFunctions(id) {
    var component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    for (var i in component._functions) {
        document.getElementById(component._functions[i] + 'external').style.display = "block";
        const fWidth = getSelectedFunctionWidth(component._functions[i]);
        if (fWidth > maxCurrentOperationsWidth) {
            console.log(component._functions[i]);
            maxCurrentOperationsWidth = fWidth;
        }
    }
    return;
}

function showAllRefresh() {
    showByComponent();
    showAll();
    return;
}

function setUpFunctionDisplayListeners() {
    document.getElementById("functionAppearance").addEventListener("change", function () {
        if (isAllChecked()) {
            cancelFunctionSelection();
            // document.getElementById("byComponent").checked = false;
            showAll();
            toggleSelectedComponents();
        }
        if (isByComponentChecked()) {
            cancelFunctionSelection();
            // document.getElementById("all").checked = false;
            showByComponent();
            toggleSelectedComponents();
            updateSelectedList();

        }
    });
    return;
}

function forceActivateAll() {
    cancelFunctionSelection();
    document.getElementById("functionAppearance").value = "all";
    showAll();
    if (document.getElementById("currentSelectedArea").style.display !== "none")
        toggleSelectedComponents();
    // measureAllLayersOperations();
    return;
}

function forceActivateByComponent() {
    cancelFunctionSelection();
    document.getElementById("functionAppearance").value = "byComponent";

    showByComponent();
    if (document.getElementById("currentSelectedArea").style.display === "none")
        toggleSelectedComponents();
    updateSelectedList();
    // measureAllLayersOperations();
    return;
}

function refreshOperationList() {
    if (isAllChecked()) {
        forceActivateAll();
    } else if (isByComponentChecked()) {
        forceActivateByComponent();
    }
    return;
}

export { setUpFunctionDisplayListeners, refreshOperationList, isByComponentChecked, isAllChecked, maxCurrentOperationsWidth, forceActivateAll, forceActivateByComponent, configAppearance, showAllRefresh, updateSelectedList, setLastSelected, showByComponent, hideCurrentFunctions, showAll, showSpecificFunctions, resetOwner, showOwner };