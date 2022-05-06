import { constantNames } from "../config/constantNames.js";

function insertUpTabs() {
    insertSideTab();
    var tabsStr = '<button id="fileTab" class="tablinks unselectableText">' + constantNames['fileTab']['tabName'] + '</button> \
    <button id="editTab" class="tablinks unselectableText">' + constantNames['editTab']['tabName'] + '</button>\
    <button id="componentTab" class="tablinks unselectableText">' + constantNames['componentsTab']['tabName'] + '</button>\
    <button id="functionTab" class="tablinks unselectableText">' + constantNames['functionsTab']['tabName'] + '</button>\
    <button id="layersTab" class="tablinks unselectableText">' + constantNames['layersTab']['tabName'] + '</button>\
    <button id="settingsTab" class="tablinks unselectableText">' + constantNames['settingsTab']['tabName'] + '</button>';
    document.getElementById('tabArea').innerHTML = tabsStr;
    return;
}

function produceOperationsTittle() {
    var tittle = document.createElement('h2');
    tittle.className = "unselectableText";
    tittle.innerText = constantNames['operationsArea']['title'];
    tittle.style.marginTop = 5 + "px";
    tittle.style.marginBottom = 5 + "px";
    tittle.style.textAlign = "center";
    return tittle;
}

function produceHR() {
    var hr = document.createElement('div');
    hr.className = "customHr";
    return hr;
}

function produceOperationRadioButtons() {
    var innerStr = '<div style="float:left;margin-left:8%;"><input type="radio" id="byComponent" value="HTML">\
    <label for="html" class="unselectableText">' + constantNames["operationsArea"]["byComponent"] + '</label></div> \
    <div style="float:left;"><input type="radio" id="all" value="CSS" checked> \
    <label for="css" class="unselectableText">' + constantNames["operationsArea"]["all"] + '</label></div>';
    var radioButtons = document.createElement('div');
    radioButtons.style.height = '24.33px';
    radioButtons.innerHTML = innerStr;
    return radioButtons;
}

function produceCurrentSelectedArea() {
    const AreaStr = '<div style="height:20px;float:left;margin-left:8%;" class="unselectableText">' + constantNames["operationsArea"]["currentComponents"] + '</div>\
    <div id="selectedComponentList" style="height:60px;float:left;margin-top:3px;margin-left:10%;width:78%;overflow-y:scroll;font-size:14px;color:gray;"></div>';
    var selectedArea = document.createElement('div');
    selectedArea.id = "currentSelectedArea";
    selectedArea.style.display = "none";
    selectedArea.style.height = "100px";
    selectedArea.innerHTML = '<div class="customHr"></div>' + AreaStr;
    return selectedArea;
}

// <hr style="margin-bottom:14px;" class="solid">
function insertSideTab() {
    var functionsRec = document.createElement('div');
    functionsRec.id = "functionArea";
    functionsRec.className = "functionRec";
    var restContainer = document.createElement('div');
    restContainer.appendChild(produceOperationsTittle());
    restContainer.appendChild(produceHR());
    restContainer.appendChild(produceOperationRadioButtons());
    restContainer.appendChild(produceCurrentSelectedArea());
    restContainer.appendChild(produceHR());
    document.getElementById('right_tab').appendChild(restContainer);
    document.getElementById('right_tab').appendChild(functionsRec);
    return;
}

function toggleSelectedComponents() {
    if (document.getElementById("currentSelectedArea").style.display === "none") {
        document.getElementById("currentSelectedArea").style.display = "block";
        document.getElementById("functionArea").style.height = "57%";
    } else {
        document.getElementById("currentSelectedArea").style.display = "none";
        document.getElementById("functionArea").style.height = "70%";

    }
    return;

}

export { insertUpTabs, toggleSelectedComponents };