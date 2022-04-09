import { createFirstLayer } from "./Classes/LayerHolder.js";
import { detectMacros } from "./Workspace/macroDetection.js";
import { initializeTree } from "./Layers/Tree.js";
import { initializeStyleAndOperations, initializeTab } from "./UpTab/tabAppearance/tabInitializer.js";
import { initializeObserver } from "./Input/clickInputObserver.js";
import { insertUpTabs } from "./HtmlElements/upTabCreation.js";
import { items } from "./Classes/ItemArray.js";
import { renderInfoButton } from "./HtmlElements/componentInfo.js";
import { constantNames } from "./config/constantNames.js";

function createDraggableSpace() {

    var div = document.createElement('div');
    div.id = "space";
    div.style.height = window.screen.height + 0 + "px";
    div.style.top = document.getElementById('tabButtons').getBoundingClientRect().y + document.getElementById('tabButtons').getBoundingClientRect().height + "px";
    div.style.left = 4 + "px";
    div.style.height = window.screen.height + "px";
    div.style.zIndex = -1;
    div.style.width = document.getElementById('tabButtons').getBoundingClientRect().width - document.getElementById('right_tab').getBoundingClientRect().width - 4 + "px";
    document.getElementById('body').appendChild(div);

}

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
    createDraggableSpace();
});