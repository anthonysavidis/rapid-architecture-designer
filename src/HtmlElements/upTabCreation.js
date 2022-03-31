import { constantNames } from "../config/constantNames.js";

function insertUpTabs() {
    insertSideTab();
    var tabsStr = '<button id="fileTab" class="tablinks">' + constantNames['fileTab']['tabName'] + '</button> \
    <button id="editTab" class="tablinks">' + constantNames['editTab']['tabName'] + '</button>\
    <button id="componentTab" class="tablinks">' + constantNames['componentsTab']['tabName'] + '</button>\
    <button id="functionTab" class="tablinks">' + constantNames['functionsTab']['tabName'] + '</button>\
    <button id="layersTab" class="tablinks">' + constantNames['layersTab']['tabName'] + '</button>';
    document.getElementById('tabArea').innerHTML = tabsStr;
    return;
}

function insertSideTab() {
    var sideTabStr = '<h2 style="text-align: center; margin-top:5px;">' + constantNames['operationsArea']['title'] + '</h2>\
    <hr style="margin-bottom:14px;" class="solid">\
    <div style="float:left;margin-left:12px;margin-top:-15px"><input type="radio" id="byComponent" value="HTML">\
    <label for="html">' + constantNames["operationsArea"]["byComponent"] + '</label></div> \
    <div style="float:right; margin-right:4px; margin-top:-15px"><input type="radio" id="all" value="CSS" checked> \
    <label for="css">' + constantNames["operationsArea"]["all"] + '</label></div><br><hr style="margin-bottom:14px;"  class="solid">    \
    <div id="functionArea" class="functionRec">\
    </div>';
    document.getElementById('right_tab').innerHTML = sideTabStr;
    return;
}

export { insertUpTabs };