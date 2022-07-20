import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { addToParentContext } from "../HtmlElements/functionsContextMenu.js";
import { componentContextDispatch } from "../UpTab/componentTab.js";
import { gridCntx, gridState, panningCntx, panningState, redoCntx, undoCntx } from "../UpTab/editTab.js";
import { newFunctionCntx } from "../UpTab/functionTab.js";
import { moveToCntx } from "../UpTab/hierarchyTab.js";
import { exitFullscreenCntx, fullscreenCntx } from "../UpTab/settingsTab.js";
import { getActiveComponentButtonNames } from "../UpTab/tabAppearance/buttonsVisibility.js";

var closeContext = () => { };

function seperativeContextLine(context) {
    var l = document.createElement('div');
    l.className = "seperativeLine";
    l.style.backgroundColor = "#f1f1f1";
    context.appendChild(l);
    return;
}

function addTick(elemnt) {
    var tick = document.createElement('div');
    tick.className = "tick";
    elemnt.appendChild(tick);
    return;
}

function addShortcut(elemnt, text) {
    var sc = document.createElement('div');
    sc.style.color = "#ccc";
    sc.style.display = "inline-block";
    sc.style.float = "right";
    sc.innerText = text;
    elemnt.appendChild(sc);
    return;
}

function checkToDisableOption(elemnt, flag) {
    if (!flag) {
        elemnt.style.color = "#ccc";
        elemnt.onmouseover = () => {
            elemnt.style.backgroundColor = "#FFFFFF";
            elemnt.style.cursor = "";
        }
    }
}

function produceWorkspaceContextMenu(clickedComponentId, componentIdList, x, y) {
    var workspaceContext = document.createElement('div');
    workspaceContext.id = "workspaceContext";
    workspaceContext.className = "context-menu";
    workspaceContext.style.left = x + "px";
    workspaceContext.style.top = y + "px";
    var canUndo = actions.undoStack.length;
    var canRedo = actions.redoStack.length;
    var isFullScreen = (window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height);
    closeContext = () => {
        setTimeout(() => {
            workspaceContext.remove();
        }, 100);
    }

    addToParentContext("", workspaceContext, "New Component", () => {
        componentContextDispatch["New"]();
        closeContext();
    }, "");
    addToParentContext("", workspaceContext, "New Operation", () => {
        newFunctionCntx();
        closeContext();
    }, "");
    seperativeContextLine(workspaceContext);
    var gridOption = addToParentContext("", workspaceContext, "Grid", () => {
        gridCntx();
        closeContext();
    }, "");

    var fullscreenOption = addToParentContext("", workspaceContext, "Fullscreen", () => {
        if (!isFullScreen)
            fullscreenCntx();
        else
            exitFullscreenCntx();
        closeContext();
    }, "");
    // addShortcut(fullscreenOption, "F11");

    if (gridState === "on")
        addTick(gridOption);
    if (isFullScreen) {
        addTick(fullscreenOption);
    }
    seperativeContextLine(workspaceContext);

    addToParentContext("", workspaceContext, "Paste", () => {
        componentContextDispatch["Paste"]();
        closeContext();
    }, "");
    seperativeContextLine(workspaceContext);

    var undoOption = addToParentContext("", workspaceContext, "Undo", () => {
        if (canUndo) {
            undoCntx();
            closeContext();
        }
    }, "");
    var redoOption = addToParentContext("", workspaceContext, "Redo", () => {
        if (canRedo) {
            redoCntx();
            closeContext();
        }
    }, "");
    checkToDisableOption(undoOption, canUndo);
    checkToDisableOption(redoOption, canRedo);
    addShortcut(undoOption, "Ctrl + Z");
    addShortcut(redoOption, "Ctrl + Y");
    document.getElementById("body").appendChild(workspaceContext);
    // workspaceContext.onclick = closeContext;
    return;
}

export { produceWorkspaceContextMenu, closeContext, checkToDisableOption };