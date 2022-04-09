import { spawnTab } from "../tabSwitch.js";
import { initButtons } from "./initializer.js";
import { cancelSelection, getSelectedItems } from "../../Item/selectComponent.js";
import { getSelectedFunctions } from "../../Item/selectFunction.js";
import { clearTree, closeLayerTree, openLayerTree, updateTree } from "../../Layers/Tree.js";
import { layers } from "../../Classes/LayerHolder.js";
import { takeScreenshot } from "../../Layers/preview.js";
import { getSelectedLinkItems } from "../../Item/selectLink.js";
import { constantNames } from "../../config/constantNames.js";

var lastPressed;

function selectTabStyle(tablink) {
    if (lastPressed) {
        lastPressed.style.backgroundColor = "#f1f1f1";
        // lastPressed.className = "tablinks";
    }
    lastPressed = tablink;
    lastPressed.style.backgroundColor = "#cccccc";
}

function initializeTab(tabName, tablinkId) {
    document.getElementById("main").style.display = "block";
    document.getElementById("right_tab").style.display = "block";
    closeLayerTree();
    spawnTab(tabName);

    var tablink = document.getElementById(tablinkId);
    selectTabStyle(tablink);

}

function changeToLayerTab() {
    initializeTab(constantNames["layersTab"]["tabName"], "layersTab");
    if (layers.selectedLayer) {
        const oldId = layers.selectedLayer._id;
        takeScreenshot(oldId);
    }
    clearTree();
    updateTree();
    openLayerTree();
    return;
}

function initializeStyleAndOperations() {
    // localStorage.clear();
    document.getElementById("componentTab").addEventListener("click", function() {
        initializeTab(constantNames["componentsTab"]["tabName"], "componentTab");
    });
    document.getElementById("editTab").addEventListener("click", function() {
        initializeTab(constantNames["editTab"]["tabName"], "editTab");
    });
    document.getElementById("functionTab").addEventListener("click", function() {
        initializeTab(constantNames["functionsTab"]["tabName"], "functionTab");
    });
    document.getElementById("fileTab").addEventListener("click", function() {
        initializeTab(constantNames["fileTab"]["tabName"], "fileTab");
    });
    document.getElementById("layersTab").addEventListener("click", function() {
        changeToLayerTab();
    });
    initButtons();
    cancelSelection();
}

export { initializeStyleAndOperations, initializeTab, lastPressed };