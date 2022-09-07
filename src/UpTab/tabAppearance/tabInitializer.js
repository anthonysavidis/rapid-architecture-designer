import { spawnTab } from "../tabSwitch.js";
import { initButtons } from "./initializer.js";
import { cancelSelection, getSelectedIds, getSelectedItems } from "../../Item/selectComponent.js";
import { getSelectedFunctions } from "../../Item/selectFunction.js";
import { clearTree, closeLayerTree, openLayerTree, updateTree } from "../../Layers/Tree.js";
import { layers } from "../../Classes/LayerHolder.js";
import { takeScreenshot } from "../../Layers/preview.js";
import { getSelectedLinkItems } from "../../Item/selectLink.js";
import { constantNames } from "../../config/constantNames.js";
import { produceLayerTabRod, removeLayerTabRod } from "../../HtmlElements/extendingSideTabs.js";
import { produceWorkspaceContextMenu } from "../../Workspace/workspaceContextMenu.js";
import { produceComponentContextMenu } from "../../HtmlElements/componentContextMenu.js";
import { enableTreeFlag } from "../hierarchyTab.js";

var lastPressed;

function selectTabStyle(tablinkId) {
    if (lastPressed) {
        // lastPressed.style.backgroundColor = "#557da5";
        // lastPressed.style.fontWeight = "normal";
        // lastPressed.style.color = "white";
        // lastPressed.className = "tabButton";
    }
    // lastPressed = document.getElementById(tablinkId);
    if (document.getElementsByClassName("tabButtonPressed unselectableText")[0])
        document.getElementsByClassName("tabButtonPressed unselectableText")[0].className = "tabButton unselectableText";
    document.getElementById(tablinkId).className = "tabButtonPressed unselectableText";

}

function initializeTab(tabName, tablinkId) {
    document.getElementById("main").style.display = "block";
    // document.getElementById("main").style.height = window.screen.availHeight + "px";
    document.getElementById("main").addEventListener("contextmenu", (e) => {
        // if (document.getElementById('workspaceContext'))
        //     document.getElementById('workspaceContext').remove();
        // if (!e.target.parentNode.className.includes("selected"))
        //     produceWorkspaceContextMenu("", "", e.clientX, e.clientY);
        // else
        //     produceComponentContextMenu("", "", e.clientX, e.clientY);
    })
    document.getElementById("right_tab").style.display = "block";
    closeLayerTree();
    removeLayerTabRod();
    spawnTab(tabName);

    selectTabStyle(tablinkId);

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
    produceLayerTabRod();
    enableTreeFlag();
    return;
}

function initializeStyleAndOperations() {
    // localStorage.clear();
    document.getElementById("componentTab").addEventListener("click", function () {
        initializeTab(constantNames["componentsTab"]["tabName"], "componentTab");
    });
    document.getElementById("editTab").addEventListener("click", function () {
        initializeTab(constantNames["editTab"]["tabName"], "editTab");
    });
    document.getElementById("functionTab").addEventListener("click", function () {
        initializeTab(constantNames["functionsTab"]["tabName"], "functionTab");
    });
    document.getElementById("fileTab").addEventListener("click", function () {
        initializeTab(constantNames["fileTab"]["tabName"], "fileTab");
    });
    document.getElementById("settingsTab").addEventListener("click", function () {
        initializeTab(constantNames["settingsTab"]["tabName"], "settingsTab");
    });
    document.getElementById("layersTab").addEventListener("click", function () {
        changeToLayerTab();
    });
    initButtons();
}

export { initializeStyleAndOperations, initializeTab, lastPressed, selectTabStyle };