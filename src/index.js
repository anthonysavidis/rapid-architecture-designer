import { createFirstLayer } from "./Classes/LayerHolder.js";
import { detectMacros } from "./Workspace/macroDetection.js";
import { initializeTree } from "./Layers/Tree.js";
import { initializeStyleAndOperations, initializeTab } from "./UpTab/tabAppearance/tabInitializer.js";
import { initializeObserver } from "./Input/clickInputObserver.js";
import { insertUpTabs } from "./HtmlElements/upTabCreation.js";
import { items } from "./Classes/ItemArray.js";
import { renderInfoButton } from "./HtmlElements/componentInfo.js";
import { constantNames } from "./config/constantNames.js";
import { createDraggableSpace, fixMainDiv, fixTrashBinPosition, initializeTheTrashBin } from "./Workspace/trashBin.js";
import { produceLayerTabRod, produceRightTabRod } from "./HtmlElements/extendingSideTabs.js";
import { createFullPath } from "./HtmlElements/pathAndLayerSpan.js";
import { getAllCssVars } from "./Classes/ConfigActions.js";
import { initZoom } from "./Workspace/zoom.js";
import { windowChangeListeners } from "./Window/windowSizeHandler.js";



document.addEventListener("DOMContentLoaded", function() {
    insertUpTabs();
    initializeStyleAndOperations();
    initializeObserver();
    createFirstLayer();
    initializeTree();
    detectMacros();
    initializeTheTrashBin();
    document.getElementById("fSidebar").style.height = window.screen.height * 0.7 + "px";
    document.getElementById("right_tab").style.height = window.screen.height * 0.7 + "px";
    createDraggableSpace();
    produceRightTabRod();
    initializeTab(constantNames["componentsTab"]["tabName"], "componentTab");
    createFullPath();
    initZoom();
    windowChangeListeners();
    fixMainDiv()
    fixTrashBinPosition();
    // document.onpaste = function(params) {
    //     // console.log(params.clipboardData);
    // }
});