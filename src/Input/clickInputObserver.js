import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { keyCodes } from "../config/keyboardButtons.js";
import { closeTooltip } from "../HtmlElements/infoTooltip.js";
import { spawnHelper } from "../Item/geometry.js";
import { cancelSelection, getSelectedIds, keepOnlyLastSelectedItem } from "../Item/selectComponent.js";
import { cancelFunctionSelection, keepOnlyLastSelectedFunction } from "../Item/selectFunction.js";
import { cancelSelectedLinks } from "../Item/selectLink.js";
import { resetButtons } from "../Layers/layerInfoFunctions.js";
import { appearComponentButtons, appearFunctionButtons, appearEditButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { initializeTab, lastPressed } from "../UpTab/tabAppearance/tabInitializer.js";
import { hideCurrentFunctions, updateSelectedList } from "../Workspace/functionAppearance.js";
import { bRecs } from "./boundingRectanglesObserver.js";
import { closeTooltipIfClickedOutside } from "./tooltipObserver.js";

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

function hasClickedOnWorkspace(id, e) {
    if (id === "space" || e.target.className === "workspace")
        return true;
    return false;
}

function handleLayerInfoAppearance(x, y) {
    if (!document.getElementById("layerInfo"))
        return;
    const tooltip = document.getElementsByClassName('tooltiptext')[0];
    const clickedInsideTooltip = tooltip && isInsideRec(x, y, tooltip.getBoundingClientRect());
    if (isInsideRec(x, y, document.getElementById("space").getBoundingClientRect()) &&
        !isInsideRec(x, y, document.getElementById("layerInfo").getBoundingClientRect()) && !clickedInsideTooltip) {
        document.getElementById("roleHint").className = (document.getElementById("roleHint").className.includes("disabled")) ? document.getElementById("roleHint").className : "layerInfoHint item6";
        document.getElementById("maxHint").className = (document.getElementById("maxHint").className.includes("disabled")) ? document.getElementById("maxHint").className : "layerInfoHint item9";
        document.getElementById("minHint").className = (document.getElementById("minHint").className.includes("disabled")) ? document.getElementById("minHint").className : "layerInfoHint item12";
        document.getElementById("functionHint").className = (document.getElementById("functionHint").className.includes("disabled")) ? document.getElementById("functionHint").className : "layerInfoHint item3";
        //forceSelectall
    }
    if (isInsideRec(x, y, document.getElementById('right_tab').getBoundingClientRect())) {
        document.getElementById("functionHint").className = (document.getElementById("functionHint").className.includes("disabled")) ? document.getElementById("functionHint").className : "layerInfoHint item3";
    }
}

function selectionHandler(e, targ) {
    const isInsideComponent = bRecs.isInsideComponent(layers.selectedLayer._id, e.clientX, e.clientY);
    //OLD CONDITION !isInsideComponent && !isIconOrName(tname, e.target.id) && !isFunction(e.target.id, e.clientX, e.clientY)
    const suspectedId = targ.id.match(/\d+/);
    const index = items.itemList.findIndex(el => el._id === suspectedId);


    if (hasClickedOnWorkspace(targ.id, e)) {
        document.getElementById("selectedComponentList").innerHTML = "";
        cancelAll(e);
    } else if (isInsideComponent && !e.ctrlKey) { //selected operations intacted
        const componentId = targ.id.match(/\d+/);
        if (componentId && !targ.id.includes('L') && index !== -1)
            keepOnlyLastSelectedItem(componentId[0]);
    } else if (isFunction(e.target.id, e.clientX, e.clientY) && !e.ctrlKey) {
        const functionId = targ.id.match(/\d+/);
        if (functionId && !targ.id.includes('L') && e.button !== 2)
            keepOnlyLastSelectedFunction(functionId[0]);
    }
    // checkToSwitchTabs(e);
    if (isInsideComponent)
        updateSelectedList();
}

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
    // if(targ)
    selectionHandler(e, targ);
    handleLayerInfoAppearance(e.clientX, e.clientY);
    appearComponentButtons();
    appearFunctionButtons();
    appearEditButtons();
    appearHierarchyButtons();
    // console.log(e.clientX + " " + e.clientY + " " + tname);
    // console.log(targ.className)
    if (document.getElementsByClassName("helper")[0] && targ.className !== "focusName" && !isInsideRec(e.clientX, e.clientY, document.getElementsByClassName("helper")[0].getBoundingClientRect())) {
        // alert('closingHelper');
        document.getElementsByClassName("helper")[0].remove();
    }
}

function initializeObserver() {
    document.getElementById("html1").addEventListener("mousedown", whichElement);
    document.getElementById("html1").addEventListener("contextmenu", (e) => { e.preventDefault(); });
    // document.getElementById("html1").addEventListener("", whichElement);
    return;
}

function closeTheTooltip() {
    // console.trace();
    const tooltip = document.getElementsByClassName('tooltiptext')[0];
    const fArrow = document.getElementsByClassName('fInfoArrow')[0];
    if (fArrow)
        fArrow.remove();
    if (!tooltip)
        return;
    var itemId = tooltip.id.split('tooltip')[0];
    if (document.getElementById(itemId + "tooltipExternal"))
        document.getElementById(itemId + "tooltipExternal").remove();
    if (document.getElementById(itemId + "tooltipArrow"))
        document.getElementById(itemId + "tooltipArrow").remove();
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