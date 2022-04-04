var dragModalHandler = () => {};

function addMotion(elmnt) {
    dragModalHandler = dragMouseDown;
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById("movingBar")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("movingBar").onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function canMove(top, left) {
        // var rightBoundary = (workspace.offsetLeft + workspace.offsetWidth) < (left + elmnt.offsetWidth);
        // var downBoundary = (workspace.offsetTop + workspace.offsetHeight) < (top + elmnt.offsetHeight); 
        // if(top < workspace.offsetTop || left < workspace.offsetLeft || rightBoundary || downBoundary){//  || (left+elmnt.style.width) < rTab.offsetLeft  || (top + elmnt.style.height)< (workspace.offsetTop + workspace.style.height)){
        //   return false;
        // }
        return true;
    }


    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        var v;
        // if (v = canMove(elmnt.offsetTop - pos2, elmnt.offsetLeft - pos1)) {
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        // }
        // console.log(v);
        // set the element's new position:
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return elmnt;
}

export { addMotion, dragModalHandler };