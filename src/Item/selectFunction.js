import { items } from "../Classes/ItemArray.js";


function changeFunctionSelectState(id) {
    document.getElementById(id).addEventListener("mousedown", function(e) {
        if (e.button !== 2)
            document.getElementById(id).className = "selectedFunction";
        return;
    });

    return;
}

function getSelectedFunctionIds() {
    var selected = document.getElementsByClassName("selectedFunction");
    var selectedIds = [];
    for (var i = 0; i < selected.length; i++) {
        selectedIds[i] = selected[i].id;
    }
    return selectedIds;
}

function getSelectedFunctions() {
    var ids = [];
    ids = getSelectedFunctionIds();
    var selectedItems = [];
    for (var i = 0; i < ids.length; i++) {
        var index = items.itemList.findIndex(((element) => element._id === ids[i]));
        selectedItems.push(items.itemList[index]);
    }
    return selectedItems;
}

// function unlinkSelectedItems() {
//     ids = getFunctionSelectedIds();
//     for (var i = 0; i < ids.length; i++) {
//         var getItemFun = (element) => element._id === ids[i];
//         var index = items.itemList.findIndex(getItemFun);
//         items.itemList[index].deleteLink(ids[ids.length-1-i]);
//     }

// }

function cancelFunctionSelection() {
    // document.getElementById("linkButton").style.display="none";

    var y = document.getElementsByClassName("selectedFunction");
    while (y.length !== 0) {
        y[0].className = "function";
    }
}

function keepOnlyLastSelectedFunction(id) {
    var y = document.getElementsByClassName("selectedFunction");
    var i = 0;
    while (y.length !== 1) {
        if (y[i].id === id) {
            i++;
            continue;
        }
        y[i].className = "function";
    }
}

export { changeFunctionSelectState, cancelFunctionSelection, getSelectedFunctionIds, getSelectedFunctions, keepOnlyLastSelectedFunction };