import { renderLine } from "../Item/createLine.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { configStyle } from "../Classes/Config.js";
import { getTextDimensions } from "./resize.js";
import { constantValues } from "../config/constantValues.js";


function autoGrow(component) {
    const text = component._name;
    const id = component._id;
    const textDims = getTextDimensions(text);
    var p = document.getElementById(id);
    const resizedItem = items.itemList[items.itemList.findIndex(el => el._id === id)];
    if (resizedItem._type === "Link" || resizedItem._type === "Function")
        return; //no need for resize

    p.style.width = 165 + (textDims.width > 130 ? textDims.width - 100 : 0) + "px";

    if (resizedItem.links)
        renderLine(id);
    // renderInfoButton(id);
    return;
}


function autoResizeAutoFit(component) {
    var offsetX = configStyle.getJSONValue("innerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("innerMarginY").split("px")[0];
    var dims = getTextDimensions(document.getElementById(component._id + 'name').innerText);
    var widthOfName = dims.width;
    var heightOfName = dims.height;
    document.getElementById(component._id).style.width = widthOfName + 2 * offsetX + "px";
    document.getElementById(component._id).style.height = heightOfName + 2 * offsetY + "px";
    
    return;
}

var autoResizeDispatch = {
    "autoFit": autoResizeAutoFit,
    "autoGrow": autoGrow
}

// tin prwti fora 127
// meta 98.

function autoResizeAllComponents() {
    const currentLayerId = layers.selectedLayer._id;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        // console.log(layerItems);

        for (var y in layerItems.itemList) {
            if (layerItems.itemList[y]._type === "Component") {
                // if (!passAutoFitRestrictions(layerItems.itemList[y]._id))
                    autoResizeDispatch["autoFit"](layerItems.itemList[y]);
                    if (layerItems.itemList[y].links)
                        renderLine(layerItems.itemList[y]._id);
            }
        }
    }
    layers.changeLayer(currentLayerId);
    return;
}

function setInitialSize(id, text) {
    var textDims = getTextDimensions(document.getElementById(id + 'name').innerText);
    var totalWidth = 2 * constantValues["initialOffsetWidth"] + document.getElementById(id + 'name').getBoundingClientRect().width;
    var totalHeight = textDims.height + 2 * constantValues["initialOffsetHeight"];
    document.getElementById(id).style.width = totalWidth + "px";
    document.getElementById(id).style.height = totalHeight + "px";
    return;
}

function canResizeAutofit(id, possibleWidth, possibleHeight) {
    var offsetX = configStyle.getJSONValue("innerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("innerMarginY").split("px")[0];
    var dims = getTextDimensions(document.getElementById(id + 'name').innerText);
    var widthOfName = dims.width + 2 * offsetX;
    var heightOfName = dims.height + 2 * offsetY;
    return !(widthOfName > possibleWidth && heightOfName > possibleHeight);
}


function passAutoFitRestrictions(id) {
    var offsetX = configStyle.getJSONValue("innerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("innerMarginY").split("px")[0];

    var dims = getTextDimensions(document.getElementById(id + 'name').innerText);
    var widthOfName = dims.width + 2 * offsetX;
    var heightOfName = dims.height + 2 * offsetY;
    var componentRect = document.getElementById(id).getBoundingClientRect();
    return (componentRect.width >= widthOfName && componentRect.height >= heightOfName);
}

export { autoResizeDispatch, canResizeAutofit, autoResizeAllComponents, autoResizeAutoFit, setInitialSize, passAutoFitRestrictions };