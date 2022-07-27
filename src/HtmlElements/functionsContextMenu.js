import { constantNames } from "../config/constantNames.js";
import { addAllPossibleMovingComponents, splitCallBack, deleteCallBack, unparentCallBack, editFunctionCallBack } from "../Input/functonsContextMenuCallbacks.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { newFunctionCntx } from "../UpTab/functionTab.js";
import { isByComponentChecked, showOwner } from "../Workspace/functionAppearance.js";
import { checkToDisableOption } from "../Workspace/workspaceContextMenu.js";
import { editComponentCallBack } from "./componentContextMenu.js";



function addToParentContext(funcId, parent, childName, callBack, componentId) {
    var child = document.createElement('div');
    child.className = "item unselectableText";
    child.style.cursor = "pointer";
    child.innerText = childName;
    child.onmousedown = function () {
        callBack(componentId);
    };
    parent.appendChild(child);
    return child;
}

function moveContextMenu(funcId, parent) {
    var arrowDiv = document.createElement('div');
    arrowDiv.className = "appendArrow";
    parent.appendChild(arrowDiv);

    var moveContext = document.createElement('div');
    moveContext.style.top = moveContext.style.top + 0 + "px";
    moveContext.style.left = moveContext.style.left + 145 + "px";
    moveContext.className = "context-menu";
    moveContext.style.display = "none";
    moveContext.style.height = 200 + "px";
    moveContext.style.overflow = "scroll";
    //add the components...
    addAllPossibleMovingComponents(funcId, moveContext);

    parent.onmouseover = function () {
        moveContext.style.display = "block";
    }
    parent.onmouseleave = function () {
        moveContext.style.display = "none";
    }
    moveContext.onmouseover = function () {
        moveContext.style.display = "block";
    }
    moveContext.onmouseleave = function () {
        moveContext.style.display = "none";
    }
    parent.appendChild(moveContext);
    return;
}

var closeContext = () => { };

function produceContextMenu(funcId, x, y) {
    var funcContext = document.createElement('div');
    funcContext.className = "context-menu";
    funcContext.style.left = x + "px";
    funcContext.style.top = y + "px";
    addToParentContext(funcId, funcContext, "New", newFunctionCntx, "");
    var editOption = addToParentContext(funcId, funcContext, "Edit", editFunctionCallBack, funcId);
    checkToDisableOption(editOption, getSelectedFunctions().length === 1);
    addToParentContext(funcId, funcContext, constantNames["functionsContext"]["delete"], deleteCallBack, "");

    var moveOption = document.createElement('div');
    moveOption.innerText = constantNames["functionsContext"]["move"];
    moveOption.className = "item";
    moveContextMenu(funcId, moveOption);
    funcContext.appendChild(moveOption);
    if (isByComponentChecked()) {
        addToParentContext(funcId, funcContext, constantNames["functionsContext"]["split"], splitCallBack, "");
        addToParentContext(funcId, funcContext, constantNames["functionsContext"]["unparent"], unparentCallBack, "");
    }
    closeContext = () => {
        funcContext.remove();
    }
    document.getElementById("body").appendChild(funcContext);
    return;
}

export { addToParentContext, produceContextMenu, closeContext };