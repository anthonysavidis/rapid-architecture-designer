import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { autoResize } from "../Item/resize.js";
import { showAllRefresh, showOwner } from "../Workspace/functionAppearance.js";

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
    input.style.width = inputWidth + "px";
    input.style.left = inputLeft + "px";
    var itemType = items.itemList[index]._type;
    if (itemType === "Function") {
        input.style.width = 148 + "px";
        input.style.position = "absolute";
        input.style.left = inputLeft + 20 + "px";
        input.style.top = document.getElementById(editId).getBoundingClientRect().top + 5 + "px";
    }

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
            showAllRefresh();

        }
        input.remove();
        autoResize(editId, val);
        detailChangeListener(editId, originalItemStr);
    });
    document.getElementById(editId + "name").innerText = "";
    document.getElementById(editId + "name").appendChild(input);
    input.focus();
}



export { produceDoubleClickEditingName, cropName, getTextWidth };