import { addLayerRodListener, addRightTabRodListener, fixFunctionsWidth, produceRightTabRod, removeLayerTabRod } from "../HtmlElements/extendingSideTabs.js";
import { createDraggableSpace, fixMainDiv, fixTrashBinPosition } from "../Workspace/trashBin.js";


function fixSideBarsOnZoom() {
    const smallUpperVoid = document.getElementById("toolBar").getBoundingClientRect().top;
    document.getElementById("right_tab").style.height = window.innerHeight - 2 - document.getElementById("toolBar").getBoundingClientRect().bottom + "px";
    document.getElementById("right_tab").style.width = window.innerWidth * 0.18 + "px";
    // document.getElementById("right_tab").style.left = window.innerWidth * 0.82 + "px";
    document.getElementById("right_tab").style.right = document.getElementById("toolBar").getBoundingClientRect().width - window.innerWidth * 0.18 + "px";
    // if()
    document.getElementById("fSidebar").style.height = window.innerHeight - document.getElementById("toolBar").getBoundingClientRect().height + "px";
    document.getElementById("fSidebar").style.width = window.innerWidth * 0.18 + "px";
    document.getElementById("fSidebar").style.left = document.getElementById("toolBar").getBoundingClientRect().left + "px";
}

class WindowChangeListener {
    constructor() {
        this.initialWindowHeight = $(window).height();
        this.initialWindowWidth = $(window).width();
        this.windowSizeListener();
    }


    windowSizeListener() {
        $(window).resize(function() {
            document.getElementById("html1").scrollTop = 0; //always scroll on top especially in zoom in/out.
            fixSideBarsOnZoom();

            // document.getElementById("right_tab").style.top = document.getElementById("toolBar").getBoundingClientRect().height + "px";
            document.getElementById("rightTabRod").remove();
            removeLayerTabRod();

            var rightTabRod = document.createElement('div');
            rightTabRod.id = "rightTabRod";
            rightTabRod.className = 'rod';
            document.getElementById('body').appendChild(rightTabRod);
            document.getElementById('rightTabRod').style.top = document.getElementById("right_tab").getBoundingClientRect().top / 2 + "px";
            document.getElementById('rightTabRod').style.height = document.getElementById("right_tab").getBoundingClientRect().height + "px";
            document.getElementById('rightTabRod').style.left = window.innerWidth * 0.82 - 10 + "px";
            addRightTabRodListener();
            var rightSmallVoid = window.innerWidth - document.getElementById("toolBar").getBoundingClientRect().right;

            var layerTabRod = document.createElement('div');
            layerTabRod.id = "layerTabRod";
            layerTabRod.className = 'rod';
            document.getElementById('body').appendChild(layerTabRod);
            document.getElementById('layerTabRod').style.top = document.getElementById("fSidebar").getBoundingClientRect().top / 2 + "px";
            document.getElementById('layerTabRod').style.height = document.getElementById("fSidebar").getBoundingClientRect().height + "px";
            document.getElementById('layerTabRod').style.left = document.getElementById("fSidebar").getBoundingClientRect().width + rightSmallVoid + "px";
            addLayerRodListener();

            // produceRightTabRod();
            createDraggableSpace();
            fixTrashBinPosition();
            fixMainDiv();
        });

    }

}



function windowChangeListeners() {
    fixSideBarsOnZoom();
    var wcl = new WindowChangeListener();
}

export { windowChangeListeners };