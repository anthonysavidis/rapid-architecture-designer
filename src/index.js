import { createFirstLayer } from "./Classes/LayerHolder.js";
import { detectMacros } from "./Workspace/macroDetection.js";
import { initializeTree } from "./Layers/Tree.js";
import { initializeStyleAndOperations, initializeTab } from "./UpTab/tabAppearance/tabInitializer.js";
import { initializeObserver } from "./Input/clickInputObserver.js";
import { insertUpTabs } from "./HtmlElements/upTabCreation.js";
import { items } from "./Classes/ItemArray.js";
import { renderInfoButton } from "./HtmlElements/componentInfo.js";
import { constantNames } from "./config/constantNames.js";

document.addEventListener("DOMContentLoaded", function() {

    insertUpTabs();
    initializeStyleAndOperations();
    initializeObserver();
    createFirstLayer();
    initializeTree();
    detectMacros();
    document.getElementById("fSidebar").style.height = window.screen.height * 0.7 + "px";
    document.getElementById("right_tab").style.height = window.screen.height * 0.7 + "px";
    document.getElementById("trashBin").style.left = document.getElementById("right_tab").getBoundingClientRect().left - 110 + "px";
    document.getElementById("trashBin").style.top = document.getElementById("right_tab").getBoundingClientRect().height - 30 + "px";
    initializeTab(constantNames["componentsTab"]["tabName"], "componentTab");
    // document.onpaste = function(params) {
    //     // console.log(params.clipboardData);
    // }
});