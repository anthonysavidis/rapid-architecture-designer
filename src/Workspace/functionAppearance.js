import { items } from "../Classes/ItemArray.js";
import { toggleSelectedComponents } from "../HtmlElements/upTabCreation.js";

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
    configAppearance("none");
    return;
}

function showOwner(functionItem) {
    const ownerId = functionItem.owners[0];
    if (!ownerId)
        return;
    const ownerName = items.itemList[items.itemList.findIndex((el) => el._id === ownerId)]._name;
    const newName = functionItem._name + '  <' + ownerName + '>';
    document.getElementById(functionItem._id + 'name').innerText += '  <' + ownerName + '>';
    document.getElementById(functionItem._id).style.backgroundColor = "#99ff00";
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


function setUpFunctionDisplayListeners() {
    document.getElementById("all").addEventListener("change", function() {
        if (document.getElementById("all").checked) {
            document.getElementById("byComponent").checked = false;
            showAll();
            toggleSelectedComponents();
        }
    });

    document.getElementById("byComponent").addEventListener("change", function() {
        if (document.getElementById("byComponent").checked) {
            document.getElementById("all").checked = false;
            showByComponent();
            toggleSelectedComponents();
        }
    });
    return;
}

export { setUpFunctionDisplayListeners, setLastSelected, hideCurrentFunctions, showAll, showSpecificFunctions, resetOwner, showOwner };