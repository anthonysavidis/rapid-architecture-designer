import { constantNames } from "../config/constantNames.js";

function insertUpTabs() {
    insertSideTab();
    var tabsStr = '<div id="fileTab" class="tabButton unselectableText">' + constantNames['fileTab']['tabName'] + '</div> \
    <div id="editTab" class="tabButton unselectableText">' + constantNames['editTab']['tabName'] + '</div>\
    <div id="componentTab" class="tabButton unselectableText">' + constantNames['componentsTab']['tabName'] + '</div>\
    <div id="functionTab" class="tabButton unselectableText">' + constantNames['functionsTab']['tabName'] + '</div>\
    <div id="layersTab" class="tabButton unselectableText">' + constantNames['layersTab']['tabName'] + '</div>\
    <div id="settingsTab" class="tabButton unselectableText">' + constantNames['settingsTab']['tabName'] + '</div>';
    document.getElementById('tabArea').innerHTML = tabsStr;
    return;
}

function produceOperationsTittle() {
    var tittle = document.createElement('div');
    tittle.className = "sideTabTittle unselectableText";
    tittle.innerText = constantNames['operationsArea']['title'];
    // tittle.style.marginTop = -1 + "px";
    // tittle.style.paddingTop = tittle.style.paddingLeft = tittle.style.paddingBottom = 5 + "px";
    // tittle.style.color = "black";
    // tittle.style.backgroundColor = "#e6e6e6";
    // tittle.style.marginBottom = 5 + "px";
    // tittle.style.width = "100%";
    // tittle.style.fontSize = "x-large";
    return tittle;
}

function produceHierarchyTittle() {
    var tittle = document.createElement('div');
    tittle.className = "sideTabTittle unselectableText";
    tittle.innerText = "Hierarchy";

    return tittle;
}

function produceHR() {
    var hr = document.createElement('div');
    hr.className = "customHr";
    return hr;
}

function produceOperationRadioButtons() {
    var innerStr = '<div class="unselectableText" style="float:left;margin-left:2.5px;"><input type="radio" id="byComponent" value="HTML">\
    <label for="html" class="unselectableText">' + constantNames["operationsArea"]["byComponent"] + '</label></div> \
    <div class="unselectableText" style="float:left;"><input type="radio" id="all" value="CSS" checked> \
    <label for="css" class="unselectableText">' + constantNames["operationsArea"]["all"] + '</label></div>';
    var radioButtons = document.createElement('div');
    radioButtons.style.height = '24.33px';
    radioButtons.style.marginBottom = '15px';
    radioButtons.style.marginTop = '10px';
    radioButtons.innerHTML = innerStr;
    return radioButtons;
}

function produceCurrentSelectedArea() {
    const AreaStr = '<div style="height:20px;float:left;margin-left:8.5px;color:#557da5;" class="unselectableText">' + constantNames["operationsArea"]["currentComponents"] + '</div>\
    <div id="selectedComponentList" style="height:60px;float:left;margin-top:3px;margin-left:10px;width:78%;overflow-y:scroll;font-size:14px;color:gray;"></div>';
    var selectedArea = document.createElement('div');
    selectedArea.id = "currentSelectedArea";
    selectedArea.style.display = "none";
    selectedArea.style.height = "100px";
    selectedArea.style.marginTop = "10px";
    selectedArea.innerHTML = AreaStr;
    return selectedArea;
}

// <hr style="margin-bottom:14px;" class="solid">
function insertSideTab() {
    var functionsRec = document.createElement('div');
    functionsRec.id = "functionArea";
    functionsRec.className = "functionRec";
    var restContainer = document.createElement('div');
    restContainer.appendChild(produceOperationsTittle());
    // restContainer.appendChild(produceHR());
    restContainer.appendChild(produceOperationRadioButtons());
    restContainer.appendChild(produceCurrentSelectedArea());
    // restContainer.appendChild(produceHR());
    document.getElementById('right_tab').appendChild(restContainer);
    document.getElementById('right_tab').appendChild(functionsRec);
    return;
}

function toggleSelectedComponents() {
    if (document.getElementById("currentSelectedArea").style.display === "none") {
        document.getElementById("currentSelectedArea").style.display = "block";
        document.getElementById("functionArea").style.height = "64.5%";
    } else {
        document.getElementById("currentSelectedArea").style.display = "none";
        document.getElementById("functionArea").style.height = "83%";

    }
    return;

}

export { insertUpTabs, toggleSelectedComponents };