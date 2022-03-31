import { items } from "../Classes/ItemArray.js";

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

function showAll() {
    configAppearance("block");
    const allItemList = items.itemList;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            const ownerId = allItemList[i].owners[0];
            const ownerName = allItemList[allItemList.findIndex((el) => el._id === ownerId)]._name;
            const newName = allItemList[i]._name + '  <' + ownerName + '>';
            document.getElementById(allItemList[i]._id + 'name').innerText = newName;
        }
    }
    return;
}

function hideCurrentFunctions() {
    const allItemList = items.itemList;
    for (var i in allItemList) {
        if (allItemList[i]._type === "Function") {
            document.getElementById(allItemList[i]._id + 'name').innerText = allItemList[i]._name;
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
        }
    });

    document.getElementById("byComponent").addEventListener("change", function() {
        if (document.getElementById("byComponent").checked) {
            document.getElementById("all").checked = false;
            showByComponent();
        }
    });
    return;
}

export { setUpFunctionDisplayListeners, setLastSelected, hideCurrentFunctions, showSpecificFunctions };