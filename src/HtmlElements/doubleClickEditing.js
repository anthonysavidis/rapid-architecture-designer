import { changeNextLayerName, changePrevLayer, changePrevLayerName } from "../Actions/inverseLayerActions.js";
import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { changeTreeName, closeLayerTree, createNodeFullPath, treeData, updateTree } from "../Layers/Tree.js";
import { showAllRefresh, showOwner } from "../Workspace/functionAppearance.js";
import { removeLayerTabRod } from "./extendingSideTabs.js";
import { replaceOnFullPath, updateFullPath } from "./pathAndLayerSpan.js";
import { autoResizeDispatch, passAutoFitRestrictions } from "../Item/autoResize.js";
import { renderLine } from "../Item/createLine.js";
import { configStyle } from "../Classes/Config.js";
import { turnOffDescription, turnOffExtension, turnOnDescription, turnOnExtension } from "./extendingComponent.js";
import { updateLayerInfoBox } from "../Layers/layerInfoFunctions.js";
import { measureSelectedView } from "../Workspace/selectedOperationsHandler.js";

function cropName(value, limit) {
    if (value.length <= limit)
        return value;
    var appearingValue = value.substring(0, limit);
    appearingValue += "...";
    return appearingValue;
}

function getTextWidth(inputText, font) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var width = context.measureText(inputText).width;
    const formattedWidth = Math.ceil(width) + "px";
    return formattedWidth;
}


function produceDoubleClickEditingName(editId) {
    var index = items.itemList.findIndex(((element) => element._id === editId));
    var inputWidth = document.getElementById(editId).getBoundingClientRect().width - 25;
    var inputLeft = document.getElementById(editId).getBoundingClientRect().left + 10;
    var val = items.itemList[index]._name;
    var input = document.createElement("input");
    input.className = "no-outline";
    const itemRec = document.getElementById(editId).getBoundingClientRect();
    input.style.width = inputWidth + "px";
    var itemType = items.itemList[index]._type;
    if (itemType === "Function") {
        input.style.width = 148 + "px";
        input.style.position = "absolute";
        input.style.zIndex = 999;
        input.style.left = itemRec.left + "px";
        input.style.top = itemRec.top + "px";
    } else
        input.style.left = inputLeft + "px";

    input.value = val;
    input.onblur = (function() {
        console.log('item db edit');
        var val = (this.value == "" || !this.value.replace(/\s/g, '').length) ? constantNames["emptyNames"][items.itemList[index]._type.toLowerCase()] : this.value;
        const originalItemStr = items.itemList[index].toString();
        items.itemList[index]._name = val;
        //getTextWidth(val, document.getElementById(editId).style.font) > document.getElementById(editId).getBoundingClientRect().width comparison
        // if (itemType === "Function")
        //     measureSelectedView(editId);
        if (itemType === "Function" && items.itemList[index].owners[0] && document.getElementById("all").checked) {
            showAllRefresh();
            // showOwner(items.itemList[index]);

        } else
            document.getElementById(items.itemList[index]._id + "name").innerHTML = val;

        if (items.itemList[index]._type === "Component" && document.getElementById("all").checked) {
            if (document.getElementById('Hierarchy').style.display === "block") {
                closeLayerTree();
                removeLayerTabRod();
            }
            showAllRefresh();
            if (document.getElementById("jstree").style.display === "block")
                updateTree();
        }
        input.remove();
        if (items.itemList[index]._type === "Component" && !passAutoFitRestrictions(items.itemList[index]._id)) {
            autoResizeDispatch["autoFit"](items.itemList[index]);
        }
        if (items.itemList[index].links) {
            renderLine(items.itemList[index]._id);
        }
        var nameChanged = detailChangeListener(editId, originalItemStr);
        console.log(nameChanged);
        if (nameChanged && document.getElementById(items.itemList[index]._id + "subComponent0")) {
            turnOffExtension(items.itemList[index]._id);
            turnOnExtension(items.itemList[index]._id);
            return;
        }
        if (nameChanged && configStyle.descriptionEnabled) {
            turnOffDescription(items.itemList[index]);
            turnOnDescription(items.itemList[index]);
        }
    });
    document.getElementById(editId + "name").innerText = "";
    if (itemType === "Function") {
        document.getElementById('body').appendChild(input);
        input.style.left = itemRec.left + 30 + "px";
        input.style.top = itemRec.top + 5 + "px";
    } else
        document.getElementById(editId + "name").appendChild(input);
    input.focus();
}

function produceDoubleClickEditingLayerName(domId, oldName, layerObject, branchRect, nodeData) {
    var input = document.createElement("input");
    input.style.left = branchRect.left + "px";
    input.className = "no-outline";
    input.style.position = "absolute";
    input.style.width = branchRect.width + "px";
    input.value = layerObject._name;
    input.style.zIndex = 90;
    input.onblur = (function() {
        var val = (this.value == "" || !this.value.replace(/\s/g, '').length) ? constantNames["emptyNames"]["layer"] : this.value;
        const oldObject = layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)].treeObj;
        layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)].updateLayerName(val);
        if (layers.idList[0] === layerObject._id)
            document.getElementById(domId).innerHTML = '<i class="jstree-icon jstree-themeicon" role="presentation"></i>' + val;
        else {
            const parentItemList = layers.getItems(layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)].parentId).itemList;
            document.getElementById(domId).innerHTML = '<i class="jstree-icon jstree-themeicon" role="presentation"></i>' + val;
        }
        input.remove();
        if (oldName !== val) {
            var parentItemList, componentName = "";
            if (layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)].parentId !== '#') {
                parentItemList = layers.getItems(layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)].parentId).itemList;
                componentName = parentItemList[parentItemList.findIndex(el => el._id === layerObject.componentId)]._name;
            }
            const prevObj = JSON.stringify([domId, layerObject._id, oldName, componentName]);
            const nextObj = JSON.stringify([domId, layerObject._id, layers.layerList[layers.layerList.findIndex(e => e._id === layerObject._id)]._name, componentName]);
            actions.saveCommand(changeNextLayerName, changePrevLayerName, prevObj, nextObj);
            changeTreeName(layerObject._id, val);
            replaceOnFullPath(oldName, val);
        }
        updateTree();
        if (document.getElementById("layerInfo")) {
            updateLayerInfoBox();

        }
    });
    document.getElementById(domId).innerHTML = "";
    document.getElementById('body').appendChild(input);
    input.style.top = branchRect.top + 5 + "px";

    input.focus();
}


function preventDrag(event) {
    if (event.type == 'dragenter' || event.type == 'dragover') //if drag over event -- allows for drop event to be captured, in case default for this is to not allow drag over target
    //prevent text dragging -- IE and new Mozilla (like Firefox 3.5+)
    {
        if (event.stopPropagation) //(Mozilla)
        {
            event.preventDefault();
            event.stopPropagation(); //prevent drag operation from bubbling up and causing text to be modified on old Mozilla (before Firefox 3.5, which doesn't have drop event -- this avoids having to capture old dragdrop event)
        }
        return false; //(IE)
    }
}

//attach event listeners after page has loaded
function preventDraggingOfCname(id) {
    var myTextInput = document.getElementById(id); //target any DOM element here

    if (myTextInput.addEventListener) //(Mozilla)
    {
        myTextInput.addEventListener('dragenter', preventDrag, true); //precursor for drop event
        myTextInput.addEventListener('dragover', preventDrag, true); //precursor for drop event
        myTextInput.addEventListener('drop', preventDrag, true);
    } else if (myTextInput.attachEvent) //(IE)
    {
        myTextInput.attachEvent('ondragenter', preventDrag);
        myTextInput.attachEvent('ondragover', preventDrag);
        myTextInput.attachEvent('ondrop', preventDrag);
    }
}


export { produceDoubleClickEditingName, produceDoubleClickEditingLayerName, preventDraggingOfCname, cropName, getTextWidth };