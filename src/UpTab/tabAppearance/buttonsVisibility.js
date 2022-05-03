import { getSelectedItems, getSelectedIds } from "../../Item/selectComponent.js";
import { items } from "../../Classes/ItemArray.js";
import { getSelectedFunctions, getSelectedFunctionIds } from "../../Item/selectFunction.js";
import { actions } from "../../Classes/Actions.js";
import { areAllCollapsed, areAllExtendable, areAllExtended } from "../../HtmlElements/extendingComponent.js";

function hasListSubarchitecture(itemList) {
    for (var i in itemList) {
        if (itemList[i].subLayers[0])
            return true;
    }
    return false;
}

function appearComponentButtons() {
    const selectedItems = getSelectedItems();
    if (!selectedItems || !selectedItems[0]) {
        document.getElementById("subdivideButton").style.display = "none";
        document.getElementById("unsubdivideButton").style.display = "none";
        document.getElementById("deleteButton").style.display = "none";
        document.getElementById("extendButton").style.display = "none";
        document.getElementById("collapseButton").style.display = "none";
        document.getElementById("joinButton").style.display = "none";
        document.getElementById("unlinkButton").style.display = "none";
        document.getElementById("linkButton").style.display = "none";
        return;
    }
    if (selectedItems.length === 1) {
        if (!selectedItems[0].subLayers.length) {
            document.getElementById("subdivideButton").style.display = "inline-block";
            document.getElementById("unsubdivideButton").style.display = "none";
        } else {
            document.getElementById("subdivideButton").style.display = "none";
            document.getElementById("unsubdivideButton").style.display = "inline-block";
        }
    } else {
        document.getElementById("subdivideButton").style.display = "none";
        document.getElementById("unsubdivideButton").style.display = "none";
    }
    if (selectedItems.length >= 1) {
        document.getElementById("deleteButton").style.display = "inline-block";
    } else {
        document.getElementById("deleteButton").style.display = "none";
    }
    if (selectedItems.length >= 1 && areAllExtendable(selectedItems) && areAllCollapsed(selectedItems)) {
        document.getElementById("extendButton").style.display = "inline-block";
    } else {
        document.getElementById("extendButton").style.display = "none";
    }

    if (selectedItems.length >= 1 && areAllExtendable(selectedItems) && areAllExtended(selectedItems)) {
        document.getElementById("collapseButton").style.display = "inline-block";
    } else {
        document.getElementById("collapseButton").style.display = "none";
    }

    if (selectedItems.length === 2) {
        if (selectedItems[0].links && selectedItems[1].links && selectedItems[0].isLinked(selectedItems[1]._id) && selectedItems[1].isLinked(selectedItems[0]._id)) {
            document.getElementById("unlinkButton").style.display = "inline-block";
            document.getElementById("linkButton").style.display = "none";
        } else {
            document.getElementById("unlinkButton").style.display = "none";
            document.getElementById("linkButton").style.display = "inline-block";
        }
    } else {
        document.getElementById("unlinkButton").style.display = "none";
        document.getElementById("linkButton").style.display = "none";
    }
    if (selectedItems.length >= 2 && !hasListSubarchitecture(selectedItems)) {
        document.getElementById("joinButton").style.display = "inline-block";
    } else {
        document.getElementById("joinButton").style.display = "none";
    }

}

function appearFunctionButtons() {
    var selectedItems = getSelectedItems();

    var selectedFunctions = getSelectedFunctions();
    if (!selectedFunctions || !selectedFunctions[0]) {
        document.getElementById("splitButton").style.display = "none";
        document.getElementById("deleteFunctionButton").style.display = "none";
        document.getElementById("resetFunctionButton").style.display = "none";
        document.getElementById("setFunctionButton").style.display = "none";

        return;
    }
    if (selectedFunctions.length >= 1) {
        document.getElementById("splitButton").style.display = "inline-block";
        document.getElementById("deleteFunctionButton").style.display = "inline-block";
    } else {
        document.getElementById("splitButton").style.display = "none";
        document.getElementById("deleteFunctionButton").style.display = "none";
    }
    if (selectedFunctions.length >= 1) {
        var functionList = getSelectedFunctions();
        var canReset = true;
        functionList.forEach((el, index, arr) => {
            (!el.owners) ? canReset = false: 1;
        });
        if (canReset) {
            document.getElementById("resetFunctionButton").style.display = "inline-block";
        }
    } else {
        document.getElementById("resetFunctionButton").style.display = "none";
        document.getElementById("setFunctionButton").style.display = "none";
    }

}

function appearEditButtons() {
    var showUndo = 1;
    var showRedo = 1;
    if (actions.undoStack.length !== 0) {
        document.getElementById("undoButton").style.display = "inline-block";
    } else {
        document.getElementById("undoButton").style.display = "none";
    }
    if (actions.redoStack.length !== 0) {
        document.getElementById("redoButton").style.display = "inline-block";
    } else {
        document.getElementById("redoButton").style.display = "none";
    }
    return;
}

function appearHierarchyButtons() {
    const selectedItems = getSelectedItems();
    const selectedFunctions = getSelectedFunctions();
    if (selectedItems.length >= 1 && selectedFunctions.length === 0) {
        document.getElementById("moveToLayerButton").style.display = "inline-block";
    } else {
        document.getElementById("moveToLayerButton").style.display = "none";

    }
}

export { appearComponentButtons, appearFunctionButtons, appearEditButtons, appearHierarchyButtons };