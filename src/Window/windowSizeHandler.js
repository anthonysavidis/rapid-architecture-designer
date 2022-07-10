import { fixFunctionsWidth, produceRightTabRod } from "../HtmlElements/extendingSideTabs.js";
import { createDraggableSpace, fixTrashBinPosition } from "../Workspace/trashBin.js";

function windowSizeListener() {
    // window.addEventListener('resize', function(event) {
    //     console.log("resizedddd");
    //     // document.getElementById("fSidebar").style.height = window.screen.height * 0.7 + "px";
    //     // document.getElementById("fSidebar").style.height = window.screen.height * 0.7 + "px";
    //     // document.getElementById("right_tab").style.height = window.screen.height * 0.7 + "px";
    //     fixFunctionsWidth();
    //     createDraggableSpace();
    //     fixTrashBinPosition();
    //     // document.getElementById("right_tab").style.left = window.screen.width - 253.88 + "px"
    // }, true);
    $(window).resize(function() {
        fixFunctionsWidth();
        document.getElementById("right_tab").style.height = window.screen.height * 0.7 + "px";
        document.getElementById("rightTabRod").remove();
        produceRightTabRod();
        createDraggableSpace();
        fixTrashBinPosition();
    });

}


function windowZoomListener() {

}

function windowChangeListeners() {
    windowSizeListener();
    windowZoomListener();
}

export { windowChangeListeners };