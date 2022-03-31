import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { closeTooltip } from "../HtmlElements/infoTooltip.js";
import { spawnHelper } from "../Item/geometry.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";
import { cancelSelectedLinks } from "../Item/selectLink.js";
import { appearComponentButtons, appearFunctionButtons, appearEditButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { initializeTab, lastPressed } from "../UpTab/tabAppearance/tabInitializer.js";
import { hideCurrentFunctions } from "../Workspace/functionAppearance.js";
import { bRecs } from "./boundingRectanglesObserver.js";

function isIconOrName(type, clickedElementId) {
    if ((clickedElementId.includes("name") && type === "P") || (clickedElementId.includes("name") && type === "DIV") || clickedElementId.includes("infoIcon") || clickedElementId.includes("paragraph")) {
        return true;
    } else
        return false;
}


function isInsideRec(clickedX, clickedY, rec) {
    return (clickedX > rec.left && clickedY > rec.top) && (clickedX <= (rec.left + rec.width) && clickedY <= rec.top + rec.height);
}

function checkToSwitchTabs(e) {
    const clickedClassName = e.target.className;
    if (document.getElementsByClassName("inputBox")[0] || document.getElementsByClassName("confirmationBox")[0])
        return;
    const clickedX = e.clientX;
    const clickedY = e.clientY;
    const clickedElementId = e.target.id;
    const functionsRec = document.getElementById("right_tab").getBoundingClientRect();
    const mainRec = document.getElementById("main").getBoundingClientRect();
    const componentsRec = {
        left: mainRec.left + document.getElementById("fSidebar").getBoundingClientRect().width,
        top: mainRec.top,
        width: document.getElementById("tabArea").getBoundingClientRect().width - functionsRec.width,
        height: window.screen.height
    };
    // spawnHelper(1, functionsRec.left, functionsRec.top, functionsRec.width, functionsRec.height);
    // spawnHelper(2, componentsRec.left, componentsRec.top, componentsRec.width, componentsRec.height);
    // document.getElementById(2 + 'helper').style.borderColor = "red";
    if (isInsideRec(clickedX, clickedY, functionsRec)) {
        initializeTab(constantNames["functionsTab"]["tabName"], "functionTab");
    } else if (isInsideRec(clickedX, clickedY, componentsRec)) {
        (lastPressed && lastPressed.id !== "layersTab") ? initializeTab(constantNames["componentsTab"]["tabName"], "componentTab"): 1;
    }
    return;
}

function isFunction(id, x, y) {
    const temp = id;
    if (temp.includes("name")) {
        id = temp.split("name")[0];
    }
    if (temp.includes("ficon")) {
        id = temp.split("ficon")[0];
    }
    var fIndex = items.itemList.findIndex(el => el._id === id);
    if (fIndex === -1 || items.itemList[fIndex]._type !== "Function")
        return false;
    const fRect = document.getElementById(id).getBoundingClientRect();
    if (fRect.x <= x && (fRect.x + fRect.width) >= x && fRect.y <= y && (fRect.y + fRect.height) >= y)
        return true;
    return false;
}

function cancelAll(e) {
    if (e.button === 2) //right click
        return;
    cancelSelection();
    var outsideOfLink = cancelSelectedLinks(e);
    if (outsideOfLink) {
        cancelFunctionSelection();
        if (document.getElementById("byComponent").checked)
            hideCurrentFunctions();
    }
    return;
}

//The Observer

function whichElement(e) {
    var targ;
    if (!e) {
        var e = window.event;
    }
    if (e.target) {
        targ = e.target;
    } else if (e.srcElement) {
        targ = e.srcElement;
    }
    var tname;
    tname = targ.tagName;
    checkToClose(e.clientX, e.clientY, e);
    const isInsideComponent = bRecs.isInsideComponent(layers.selectedLayer._id, e.clientX, e.clientY);
    if (!isInsideComponent && !isIconOrName(tname, e.target.id) && !isFunction(e.target.id, e.clientX, e.clientY)) {
        setTimeout(() => {
            cancelAll(e);
            appearComponentButtons();
            appearFunctionButtons();
            appearEditButtons();
        }, 300);
    }
    checkToSwitchTabs(e);
    appearComponentButtons();
    appearFunctionButtons();
    appearEditButtons();
}

function initializeObserver() {
    document.getElementById("html1").addEventListener("click", whichElement);
    return;
}

function closeTheTooltip() {
    const tooltip = document.getElementsByClassName('tooltiptext')[0];
    if (!tooltip)
        return;
    var itemId = tooltip.id.split('tooltip')[0];
    closeTooltip(itemId);
    return;
}

function checkToClose(cX, cY, e) {
    const uptabX = document.getElementById('tabArea').getBoundingClientRect().x;
    const uptabY = document.getElementById('tabArea').getBoundingClientRect().y;
    const uptabWidth = document.getElementById('tabArea').getBoundingClientRect().width;
    const uptabHeight = document.getElementById('tabArea').getBoundingClientRect().height + document.getElementById('tabButtons').getBoundingClientRect().height;

    if (uptabX <= cX && uptabY <= cY && (uptabWidth + uptabX) >= cX && (uptabHeight + uptabY) >= cY) {
        closeTheTooltip();
    }
    const funcContext = document.getElementsByClassName("context-menu")[0];
    if (!funcContext)
        return;
    const funcContextX = funcContext.getBoundingClientRect().x;
    const funcContextY = funcContext.getBoundingClientRect().y;
    const funcContextWidth = funcContext.getBoundingClientRect().width;
    const funcContextHeight = funcContext.getBoundingClientRect().height;
    if (!(funcContextX <= cX && cX <= (funcContextWidth + funcContextX) && funcContextY <= cY && cY <= (funcContextHeight + funcContextY))) {
        funcContext.remove();
    }
}

export { whichElement, initializeObserver, closeTheTooltip };