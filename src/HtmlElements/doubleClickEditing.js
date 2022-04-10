import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { autoResize } from "../Item/resize.js";
import { closeLayerTree, updateTree } from "../Layers/Tree.js";
import { showAllRefresh, showOwner } from "../Workspace/functionAppearance.js";
import { removeLayerTabRod } from "./extendingSideTabs.js";

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

        if (itemType === "Function" && items.itemList[index].owners[0] && document.getElementById("all").checked) {
            // showOwner(items.itemList[index]);
            showAllRefresh();
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
        autoResize(editId, val);
        detailChangeListener(editId, originalItemStr);
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



export { produceDoubleClickEditingName, cropName, getTextWidth };