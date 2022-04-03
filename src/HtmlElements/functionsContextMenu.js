import { constantNames } from "../config/constantNames.js";
import { addAllPossibleMovingComponents, splitCallBack, deleteCallBack, unparentCallBack } from "../Input/contextMenuCallbacks.js";

function addToParentContext(funcId, parent, childName, callBack, componentId) {
    var child = document.createElement('div');
    child.className = "item";
    child.innerText = childName;
    child.onclick = function() { callBack(componentId) };
    parent.appendChild(child);
    return;
}

function moveContextMenu(funcId, parent) {
    var arrowDiv = document.createElement('div');
    arrowDiv.className = "appendArrow";
    parent.appendChild(arrowDiv);

    var moveContext = document.createElement('div');
    moveContext.style.top = moveContext.style.top + 0 + "px";
    moveContext.style.left = moveContext.style.left + 150 + "px";
    moveContext.className = "context-menu";
    moveContext.style.display = "none";
    moveContext.style.height = 200 + "px";
    moveContext.style.overflow = "scroll";
    //add the components...
    addAllPossibleMovingComponents(funcId, moveContext);

    parent.onmouseover = function() {
        moveContext.style.display = "block";
    }
    parent.onmouseleave = function() {
        moveContext.style.display = "none";
    }
    moveContext.onmouseover = function() {
        moveContext.style.display = "block";
    }
    moveContext.onmouseleave = function() {
        moveContext.style.display = "none";
    }
    parent.appendChild(moveContext);
    return;
}

var closeContext = () => {};

function produceContextMenu(funcId, x, y) {
    var funcContext = document.createElement('div');
    funcContext.className = "context-menu";
    funcContext.style.left = x + "px";
    funcContext.style.top = y + "px";
    var moveOption = document.createElement('div');
    moveOption.innerText = constantNames["functionsContext"]["move"];
    moveOption.className = "item";
    moveContextMenu(funcId, moveOption);
    funcContext.appendChild(moveOption);
    if (document.getElementById("byComponent").checked) {
        addToParentContext(funcId, funcContext, constantNames["functionsContext"]["split"], splitCallBack, "");
        addToParentContext(funcId, funcContext, constantNames["functionsContext"]["unparent"], unparentCallBack, "");
    }
    addToParentContext(funcId, funcContext, constantNames["functionsContext"]["delete"], deleteCallBack, "");
    closeContext = () => {
        funcContext.remove();
    }
    document.getElementById("body").appendChild(funcContext);
    return;
}

export { addToParentContext, produceContextMenu, closeContext };