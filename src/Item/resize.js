import { renderLine } from "../Item/createLine.js";
import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { moveNext, movePrev } from "../Actions/inverseMovement.js";
import { renderInfoButton } from "../HtmlElements/componentInfo.js";
import { closeTooltip } from "../HtmlElements/infoTooltip.js";

function getTextDimensions(str) {

    var text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = "times new roman";
    text.style.fontSize = 16 + "px";
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return { width: width, height: height };
}

function canResize(id, pointerX, pointerY) {
    var textDim = getTextDimensions(document.getElementById(id + 'name').innerText);
    var nameRec = document.getElementById(id + 'name').getBoundingClientRect();
    const pRec = { x: nameRec.x, y: nameRec.y, width: textDim.width + 40, height: textDim.height };
    if (pointerX < pRec.x || pointerY < pRec.y || pointerX >= document.getElementById("right_tab").getBoundingClientRect().x)
        return false;
    if ((pointerX > pRec.x && pointerX < (pRec.width + pRec.x)) || pointerY > pRec.y && pointerY < (pRec.height + pRec.y))
        return false;
    return true;
}

function autoResize(id, text) {
    const textDims = getTextDimensions(text);
    var p = document.getElementById(id);
    if (!p.className.includes("component") && !p.className.includes("selected"))
        return;
    p.style.width = 150 + (textDims.width > 150 ? textDims.width - 100 : 0) + "px";

    if (items.itemList[items.itemList.findIndex(el => el._id === id)].links)
        renderLine(id);
    // renderInfoButton(id);
    return;
}

function addResize(id) {
    var p = document.getElementById(id);
    if (document.getElementById(id + "resizer")) {
        document.getElementById(id + "resizer").remove();
    }
    var resizer = document.createElement("div");
    resizer.id = id + "resizer";
    resizer.className = "resizer";
    p.appendChild(resizer);
    resizer.addEventListener("mousedown", initDrag, false);
    var startX, startY, startWidth, startHeight;
    var initialBoundingRec = null;

    function initDrag(e) {
        closeTooltip(id);
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
        initialBoundingRec = JSON.stringify(document.getElementById(id).getBoundingClientRect()) + '@' + id;
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);
    }

    function doDrag(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        if (canResize(id, e.clientX, e.clientY)) {
            p.style.width = startWidth + e.clientX - startX + "px";
            p.style.height = startHeight + e.clientY - startY + "px";
            renderLine(id);
            renderInfoButton(id);
        }
    }

    function stopDrag(e) {
        document.documentElement.removeEventListener("mousemove", doDrag, false);
        document.documentElement.removeEventListener("mouseup", stopDrag, false);
        var updatedBoundingRec = JSON.stringify(document.getElementById(id).getBoundingClientRect());
        actions.saveCommand(moveNext, movePrev, initialBoundingRec, updatedBoundingRec);
        // actions.saveCommand(moveNext,movePrev,initialBoundingRec,updatedBoundingRec);

        var index = items.itemList.findIndex((e) => e._id === id);
        items.itemList[index].updateBoundingRec();
    }
}

// function removeResize(){
//     p.removeChild(resizer);
// }

export { addResize, autoResize, getTextDimensions };