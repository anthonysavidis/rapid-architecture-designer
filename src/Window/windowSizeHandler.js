import { addRightTabRodListener, fixFunctionsWidth, produceRightTabRod } from "../HtmlElements/extendingSideTabs.js";
import { createDraggableSpace, fixTrashBinPosition } from "../Workspace/trashBin.js";

class WindowChangeListener {
    constructor() {
        this.initialWindowHeight = $(window).height();
        this.initialWindowWidth = $(window).width();
        this.windowSizeListener();
    }

    fixRightTabAndWorkspacePosition() {

    }

    windowSizeListener() {
        $(window).resize(function() {

            document.getElementById("rightTabRod").remove();
            document.getElementById("right_tab").style.height = window.innerHeight - document.getElementById("toolBar").getBoundingClientRect().height + "px";
            document.getElementById("right_tab").style.width = window.innerWidth * 0.18 + "px";
            document.getElementById("right_tab").style.left = window.innerWidth * 0.82 + "px";
            // document.getElementById("right_tab").style.top = document.getElementById("toolBar").getBoundingClientRect().height + "px";

            var rightTabRod = document.createElement('div');
            rightTabRod.id = "rightTabRod";
            rightTabRod.className = 'rod';
            document.getElementById('body').appendChild(rightTabRod);
            document.getElementById('rightTabRod').style.top = document.getElementById("right_tab").getBoundingClientRect().top / 2 + "px";
            document.getElementById('rightTabRod').style.height = document.getElementById("right_tab").height + "px";
            document.getElementById('rightTabRod').style.left = window.innerWidth * 0.82 - 10 + "px";
            addRightTabRodListener();

            // produceRightTabRod();
            createDraggableSpace();
            fixTrashBinPosition();
        });

    }

}



function windowChangeListeners() {
    var wcl = new WindowChangeListener();
}

export { windowChangeListeners };