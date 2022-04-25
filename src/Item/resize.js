import { renderLine } from "../Item/createLine.js";
import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { moveNext, movePrev } from "../Actions/inverseMovement.js";
import { renderInfoButton } from "../HtmlElements/componentInfo.js";
import { closeTooltip } from "../HtmlElements/infoTooltip.js";
import { layers } from "../Classes/LayerHolder.js";
import { configStyle } from "../Classes/Config.js";
import { passAutoFitRestrictions } from "./autoResize.js";

function getTextDimensions(str) {

    var text = document.createElement("span");
    document.body.appendChild(text);

    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var fontSize = rs.getPropertyValue('--componentTextSize');
    var fontFamily = rs.getPropertyValue('--componentTextFamily');
    console.log(fontSize);
    console.log(fontFamily);

    text.style.fontFamily = fontFamily;
    text.style.fontSize = fontSize;
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

function canResize(id, pointerX, pointerY) { //NEEDS REDOING
    var textDim = getTextDimensions(document.getElementById(id + 'name').innerText);
    var nameRec = document.getElementById(id + 'name').getBoundingClientRect();
    const pRec = { x: nameRec.x, y: nameRec.y, width: textDim.width + 40, height: textDim.height };
    if (pointerX < pRec.x || pointerY < pRec.y || pointerX >= document.getElementById("right_tab").getBoundingClientRect().x)
        return false;
    if ((pointerX > pRec.x && pointerX < (pRec.width + pRec.x)) || pointerY > pRec.y && pointerY < (pRec.height + pRec.y))
        return false;
    return true;
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
        $('#' + id).draggable('disable');
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
            // renderInfoButton(id);
        }
    }

    function stopDrag(e) {
        $('#' + id).draggable('enable');

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

export { addResize, getTextDimensions };