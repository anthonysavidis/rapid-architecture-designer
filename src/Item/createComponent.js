import { renderLine } from "../Item/createLine.js";
import { layers } from "../Classes/LayerHolder.js";
import { items } from "../Classes/ItemArray.js";
import { actions } from "../Classes/Actions.js";
import { moveNext, movePrev } from "../Actions/inverseMovement.js";
import { cancelSelectedLinks } from "./selectLink.js";
import { canBeDeleted, deleteWithTrashBin } from "../Workspace/trashBin.js";
import { closeTooltip } from "../HtmlElements/infoTooltip.js";
import { spawnDot } from "./geometry.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { constantNames } from "../config/constantNames.js";

function canMove(top, left, height, width) {
    var rightBoundary = (left + width) < document.getElementById('right_tab').getBoundingClientRect().x;
    var upBoundary = top > (document.getElementById('tabButtons').getBoundingClientRect().y + document.getElementById('tabButtons').getBoundingClientRect().height);
    // // var downBoundary = (workspace.offsetTop + workspace.offsetHeight) < (top + elmnt.offsetHeight); 
    if (!rightBoundary || !upBoundary) { //  || (left+elmnt.style.width) < rTab.offsetLeft  || (top + elmnt.style.height)< (workspace.offsetTop + workspace.style.height)){
        return false;
    }
    return true;
}

function dragElement(elmnt) {
    // console.log("called");
    var workspace = document.getElementById(layers.selectedLayer._id);

    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var initialBoundingRec = null;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        closeTooltip(elmnt.id);
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        // console.log('once');
        initialBoundingRec = JSON.stringify(document.getElementById(elmnt.id).getBoundingClientRect()) + '@' + elmnt.id;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }


    function elementDrag(e) {
        cancelSelectedLinks(e, 1); //update posible.....

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        var v;
        if (v = canMove(elmnt.offsetTop - pos2, elmnt.offsetLeft - pos1, elmnt.getBoundingClientRect().height, elmnt.getBoundingClientRect().width)) {
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
            renderLine(elmnt.id);
        }
        // console.log(v);
        // set the element's new position:
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        var itemIndex = items.itemList.findIndex(e => e._id === elmnt.id);
        if (itemIndex !== -1) { //if -1 it's from the editSublayer and will trigger error.
            items.itemList[itemIndex].updateBoundingRec();
        }
        var updatedBoundingRec = JSON.stringify(document.getElementById(elmnt.id).getBoundingClientRect());
        var _initialBoundingRec = initialBoundingRec.split("@")[0];
        if (updatedBoundingRec !== _initialBoundingRec) {
            actions.saveCommand(moveNext, movePrev, initialBoundingRec, updatedBoundingRec);
            if (canBeDeleted(elmnt.getBoundingClientRect())) {
                const msg = constantNames["confirmationBox"]["DeleteMsgStart"] + 1 + constantNames["confirmationBox"]["DeleteMsgEnd"];
                produceBox("confirmation", msg + "@1", () => {
                    deleteWithTrashBin(elmnt);
                }, () => {
                    movePrev({ initialItem: initialBoundingRec, updatedItem: updatedBoundingRec });
                });
            }
        }
    }
    return elmnt;
}

export { dragElement, canMove };