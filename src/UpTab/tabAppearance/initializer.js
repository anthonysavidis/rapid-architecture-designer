import { addComponentTabListeners } from "../componentTab.js";
import { addFileTabListeners } from "../fileTab.js";
import { addFunctionTabListeners } from "../functionTab.js";
import { addEditTabListeners } from "../editTab.js";
import { buttonTooltips, constantNames } from "../../config/constantNames.js";
import { getTextWidth } from "../../HtmlElements/doubleClickEditing.js";
import { addHierarchyTabListeners } from "../hierarchyTab.js";
import { addSettingsTabListeners } from "../settingsTab.js";

function addButton(label, id, tab) {
    const imgName = label.includes(' ') ? label.replace(' ', '') : label;
    var buttonHtml = '<div id="' + id + '" class="menubutton"><div class="buttonName unselectableText">' + label + '</div><center><div style=\'background-image: url(./images/' + imgName + '.png);\' class="photo_rectangle"></div></center><div id="' + id + 'tooltiptext" style="padding:3px" class="tooltipText unselectableText">' + buttonTooltips[tab][label] + ' </div></div>';
    document.getElementById(tab).innerHTML += buttonHtml;
    document.getElementById(id + 'tooltiptext').style.top = 100 + "px";
    document.getElementById(id + 'tooltiptext').style.height = 25 + "px";
    document.getElementById(id + 'tooltiptext').style.width = "auto";
    document.getElementById(id + 'tooltiptext').style.left = "calc(100px + var(--positionX) * 20px)";
    document.getElementById(id).style.top = 6 + "px";
}

function addAllButtons() {
    addButton(constantNames["componentsTab"]["New"], "newButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Delete"], "deleteButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Link"], "linkButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Unlink"], "unlinkButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Join"], "joinButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Subdivide"], "subdivideButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Unsubdivide"], "unsubdivideButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Copy"], "copyButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Paste"], "pasteButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Extend"], "extendButton", constantNames["componentsTab"]["tabName"]);
    addButton(constantNames["componentsTab"]["Collapse"], "collapseButton", constantNames["componentsTab"]["tabName"]);

    addButton(constantNames["functionsTab"]["New"], "newFunctionButton", constantNames["functionsTab"]["tabName"]);
    addButton(constantNames["functionsTab"]["Delete"], "deleteFunctionButton", constantNames["functionsTab"]["tabName"]);
    addButton(constantNames["functionsTab"]["Set"], "setFunctionButton", constantNames["functionsTab"]["tabName"]);
    addButton(constantNames["functionsTab"]["Reset"], "resetFunctionButton", constantNames["functionsTab"]["tabName"]);
    addButton(constantNames["functionsTab"]["Split"], "splitButton", constantNames["functionsTab"]["tabName"]);

    addButton(constantNames["editTab"]["Undo"], "undoButton", constantNames["editTab"]["tabName"]);
    addButton(constantNames["editTab"]["Redo"], "redoButton", constantNames["editTab"]["tabName"]);
    addButton(constantNames["editTab"]["Grid"], "gridButton", constantNames["editTab"]["tabName"]);

    addButton(constantNames["fileTab"]["New"], "newProjectButton", constantNames["fileTab"]["tabName"]);
    addButton(constantNames["fileTab"]["Save"], "saveButton", constantNames["fileTab"]["tabName"]);
    addButton(constantNames["fileTab"]["Load"], "loadButton", constantNames["fileTab"]["tabName"]);

    addButton(constantNames['layersTab']["ToggleHierarchy"], "toggleHierarchyTreeButton", constantNames['layersTab']['tabName']);
    addButton(constantNames['layersTab']["MoveTo"], "moveToLayerButton", constantNames['layersTab']['tabName']);

    addButton(constantNames['settingsTab']["Fullscreen"], "fullscreenButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Exit Fullscreen"], "exitFullscreenButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Configure"], "configureButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Configure Component"], "configureComponentButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Configure Operation"], "configureOperationButton", constantNames['settingsTab']['tabName']);

}

function initButtons() {
    addAllButtons();
    addComponentTabListeners();
    addFunctionTabListeners();
    addFileTabListeners();
    addEditTabListeners();
    addHierarchyTabListeners();
    addSettingsTabListeners();
}

export { initButtons };