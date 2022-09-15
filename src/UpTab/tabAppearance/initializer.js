import { addComponentTabListeners } from "../componentTab.js";
import { addFileTabListeners } from "../fileTab.js";
import { addFunctionTabListeners } from "../functionTab.js";
import { addEditTabListeners } from "../editTab.js";
import { buttonTooltips, constantNames } from "../../config/constantNames.js";
import { getTextWidth } from "../../HtmlElements/doubleClickEditing.js";
import { addHierarchyTabListeners } from "../hierarchyTab.js";
import { addSettingsTabListeners } from "../settingsTab.js";
import { addHelpTabListeners } from "../helpTab.js";
import { addZoomMenu } from "../../Workspace/zoomSlider.js";

function addButtonSeperatingLine(tab) {
    var l = document.createElement('div');
    l.className = "seperativeLine";
    l.style.backgroundColor = "#ccc";
    l.style.display = "inline-flex";
    l.style.height = "56px";
    l.style.width = "1px";
    l.style.marginBottom = "-7px";
    l.style.marginRight = l.style.marginLeft = "2px";
    document.getElementById(tab).appendChild(l);
    return l;
}

function addButton(label, id, tab) {
    const imgName = label.includes(' ') ? label.replace(' ', '') : label;
    var buttonHtml = "";
    if (label === constantNames["fileTab"]["New"] && tab === constantNames["fileTab"]["tabName"])
        buttonHtml = '<div id="' + id + '" class="menubutton"><center><div style=\'background-image: url(./images/NewProject.png);\' class="photo_rectangle"></div></center><div id="' + id + 'tooltiptext" style="padding:3px" class="tooltipText unselectableText">' + buttonTooltips[tab][label] + ' </div><div class="buttonName unselectableText">' + label + '</div></div>';
    else
        buttonHtml = '<div id="' + id + '" class="menubutton"><center><div style=\'background-image: url(./images/' + imgName + '.png);\' class="photo_rectangle"></div></center><div id="' + id + 'tooltiptext" style="padding:3px" class="tooltipText unselectableText">' + buttonTooltips[tab][label] + ' </div><div class="buttonName unselectableText">' + label + '</div></div>';

    var buttonTempParent = document.createElement('div');
    buttonHtml = buttonHtml.includes("Elements Data") ? buttonHtml.replace("Elements Data", "Element's Data") : buttonHtml;
    buttonTempParent.innerHTML = buttonHtml;
    document.getElementById(tab).appendChild(buttonTempParent.firstChild);
    document.getElementById(id + 'tooltiptext').style.top = 107 + "px";
    // document.getElementById(id + 'tooltiptext').style.height = 25 + "px";
    document.getElementById(id + 'tooltiptext').style.width = "auto";
    // console.log(document.getElementById(id).getBoundingClientRect());
    document.getElementById(id + 'tooltiptext').style.left = "calc( (var(--positionX)) * 20)";

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
    var undoline = addButtonSeperatingLine(constantNames["editTab"]['tabName']);
    undoline.id = "undoLine";
    undoline.style.display = "none";
    addButton(constantNames["editTab"]["Grid"], "gridButton", constantNames["editTab"]["tabName"]);
    addButton(constantNames["editTab"]["GridSnapping"], "gridSnappingButton", constantNames["editTab"]["tabName"]);
    addButtonSeperatingLine(constantNames["editTab"]['tabName']);
    addButton(constantNames['settingsTab']["Fullscreen"], "fullscreenButton", constantNames['editTab']['tabName']);
    addButton(constantNames['settingsTab']["Exit Fullscreen"], "exitFullscreenButton", constantNames['editTab']['tabName']);
    var editline = addButtonSeperatingLine(constantNames["editTab"]['tabName']);
    editline.id = "editLine";
    editline.style.display = "none";
    addButton(constantNames["editTab"]["Edit"], "editButton", constantNames["editTab"]["tabName"]);
    addButtonSeperatingLine(constantNames["editTab"]['tabName']);
    addZoomMenu();

    addButton(constantNames["fileTab"]["New"], "newProjectButton", constantNames["fileTab"]["tabName"]);
    addButton(constantNames["fileTab"]["Save"], "saveButton", constantNames["fileTab"]["tabName"]);
    addButton(constantNames["fileTab"]["Load"], "loadButton", constantNames["fileTab"]["tabName"]);

    addButton(constantNames['layersTab']["ToggleHierarchy"], "toggleHierarchyTreeButton", constantNames['layersTab']['tabName']);
    addButton(constantNames['layersTab']["MoveTo"], "moveToLayerButton", constantNames['layersTab']['tabName']);
    addButton(constantNames['layersTab']["Info"], "infoLayerButton", constantNames['layersTab']['tabName']);

    addButton("Import", "loadConfigButton", constantNames['settingsTab']['tabName']);
    addButton("Export", "saveConfigButton", constantNames['settingsTab']['tabName']);
    addButtonSeperatingLine(constantNames['settingsTab']['tabName']);

    addButton(constantNames['settingsTab']["Configure Component"], "configureComponentButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Configure Operation"], "configureOperationButton", constantNames['settingsTab']['tabName']);
    addButton(constantNames['settingsTab']["Configure Link"], "configureLinkButton", constantNames['settingsTab']['tabName']);
    // addButton(constantNames['helpTab']["tabName"], "helpButton", constantNames['helpTab']['tabName']);
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