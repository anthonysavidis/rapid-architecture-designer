import { items } from "../Classes/ItemArray.js";
import { refreshAllLinks } from "../Classes/LayerHolder.js";
import { renderLine } from "../Item/createLine.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";
// import { _Panzoom } from "../../dist/panzoom/panzoom.js";

function initZoom() {
    // $("#main").draggable();
    // const container = document.querySelector(".workspace")[0];
    // container.draggable();

    // document.createElement()
    addPanning(document.getElementById('main'));

}

function moveAllItemsInCurrentLayer(X, Y) {
    const componentList = items.itemList.filter((el) => el._type === "Component");
    for (var i in componentList) {
        const componentRec = document.getElementById(componentList[i]._id).getBoundingClientRect();
        document.getElementById(componentList[i]._id).style.left = componentRec.left + X + "px";
        document.getElementById(componentList[i]._id).style.top = componentRec.top + Y + "px";
        if (componentList[i].links) {
            renderLine(componentList[i]._id);
        }
    }
    return;
}

var dragEnabled = false;

function enablePanning() {
    dragEnabled = true;
    document.getElementById('main').style.cursor = "grab";
    return;
}

function disablePanning() {
    dragEnabled = false;
    document.getElementById('main').style.cursor = "";

    return;
}

function detectLeftButton(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    }
    var button = evt.which || evt.button;
    return button == 1;
}

function addPanning(elmnt) {
    var initX, initY;
    const mouseDownFunction = (e) => {
        if (e.target.className.includes("selected") || e.target.className.includes("component") || !dragEnabled)
            return;
        cancelSelection();
        cancelFunctionSelection();
        initX = e.clientX;
        initY = e.clientY;
    }
    const mouseMoveFunction = (e) => {
        if (!detectLeftButton(e) || !dragEnabled)
            return;
        if (e.target.className.includes("selected") || e.target.className.includes("component")) {
            return;
        } else {
            var Dx = e.clientX - initX;
            var Dy = e.clientY - initY;
            moveAllItemsInCurrentLayer(Dx / 50, Dy / 50);
        }
    }
    // elmnt.onmousedown = (e) => {
    //     elmnt.onmousemove = (e) => {
    //         console.log(e.button);

    //         if (e.button === 1) {
    //             console.log('dragging');
    //             var Dx = e.clientX - initX;
    //             var Dy = e.clientY - initY;
    //             moveAllItemsInCurrentLayer(Dx / 100, Dy / 100);
    //         }
    //     }

    // }
    // elmnt.ondragend = (e) => {
    //     if (e.target.className.includes("selected") || e.target.className.includes("component"))
    //         return;
    //     initX = 0;
    //     initY = 0;
    //     console.log('stahp');

    // }

    elmnt.addEventListener("mousedown", function (e) {
        mouseDownFunction(e);

        elmnt.onmousemove = function (e) {
            mouseMoveFunction(e);
        }
    });

    elmnt.addEventListener("mouseup", function (e) {
        elmnt.onmousemove = null;
        initX = initY = 0;
    });
}

export { initZoom, enablePanning, disablePanning };