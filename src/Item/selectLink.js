import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { spawnHelper } from "./geometry.js";

function changeLinkSelectState(id) {
    document.getElementById(id).addEventListener("mousedown", function() {
        document.getElementById(id).className = "selectedLine";
        var rect = document.getElementById(id).getBoundingClientRect();
        return;
    });

    return;
}

function getSelectedLinkIds() {
    var keys = [];
    InstanceGenerator.diagramMap[layers.selectedLayer._id].selection.each(function (n) {
        if (!(n instanceof go.Link)) 
            return;
        keys.push(n.data.key);
    });
    return keys;
}

function getSelectedLinkItems() {
    var ids = [];
    ids = getSelectedLinkIds();
    var selectedLinks = [];
    for (var i = 0; i < ids.length; i++) {
        var getItemFun = (element) => element._id === ids[i];
        var index = items.itemList.findIndex(getItemFun);
        // console.log(items.itemList[index]);
        selectedLinks.push(items.itemList[index]);
    }
    return selectedLinks;
}

function checkIfInsideHelper(id, ev) {
    var mouseX = ev.clientX;
    var mouseY = ev.clientY;
    var helperRect = document.getElementById(id + "helper").getBoundingClientRect();
    if ((mouseX > helperRect.x && mouseX < (helperRect.x + helperRect.width)) && (mouseY > helperRect.y && mouseY < (helperRect.y + helperRect.height)))
        return true;
    else
        return false;
}

function cancelSelectedLinks(ev, force) {
    // document.getElementById("linkButton").style.display="none";
    // console.log(ev);
    var y = document.getElementsByClassName("selectedLine");
    var idListToBeDeleted = [];
    for (var i = 0; i < y.length; i++) {
        if (!checkIfInsideHelper(y[i].id, ev) || force) {
            // console.log("remove" + y[i].id);
            idListToBeDeleted.push(y[i].id);
            y[i].className = "line";
        } else
            return false;
    }
    for (var i = 0; i < idListToBeDeleted.length; i++) {
        // console.log("removing" + idListToBeDeleted[i]);
        document.getElementById(idListToBeDeleted[i] + "helper").remove();
        document.getElementById(idListToBeDeleted[i]).className = "line";
    }
    return true;
}

function forceSelectLink(id) {
    document.getElementById(id).className = "selectedLine";
    var rect = document.getElementById(id).getBoundingClientRect();
    spawnHelper(id, rect.left, rect.top, rect.width, rect.height);
}

export { changeLinkSelectState, getSelectedLinkIds, getSelectedLinkItems, cancelSelectedLinks, forceSelectLink };