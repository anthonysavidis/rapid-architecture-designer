import { renderLine } from "../Item/createLine.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { configStyle } from "../Classes/Config.js";
import { getTextDimensions } from "./resize.js";
import { constantValues } from "../config/constantValues.js";
import { enableLayerDescriptionExtension } from "../Layers/switchActions.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { getNameListArgument, resizeExtended } from "../HtmlElements/extendingComponent.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";


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
    var offsetX = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];
    const textDims = InstanceGenerator.getComponentsTextBlockDims(component._id);
    var widthOfName = textDims[0];
    var heightOfName = textDims[1];
    const finalWidth = widthOfName + 2 * offsetX;
    const finalHeight = heightOfName + 2 * offsetY;
    InstanceGenerator.alterNodeDims(component._id, finalWidth, finalHeight);
    // component.updateBoundingRec();
    return;
}

var autoResizeDispatch = {
    "autoFit": autoResizeAutoFit,
    "autoGrow": autoGrow
}


function autoResizeAllComponents() {
    const currentLayerId = layers.selectedLayer._id;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        // console.log(layerItems);

        for (var y in layerItems.itemList) {
            if (layerItems.itemList[y]._type === "Component") {
                // if (!passAutoFitRestrictions(layerItems.itemList[y]._id))
                if (document.getElementById(layerItems.itemList[y]._id + 'Description')) {
                    resizeExtended(layerItems.itemList[y]._id, getNameListArgument(layerItems.itemList[y]));
                } else {
                    autoResizeAutoFit(layerItems.itemList[y]);
                }
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

function checkAndResize() {
    return;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        // console.log(layerItems);

        for (var y in layerItems.itemList) {
            const it = layerItems.itemList[y];

            if (it._type === "Component" && !passAutoFitRestrictions(it._id)) {
                // console.log(it._id);
                if (document.getElementById(it._id + 'Description')) {
                    resizeExtended(it._id, getNameListArgument(it));
                } else {
                    autoResizeAutoFit(it);
                    if (it.links) {
                        renderLine(it._id);
                    }
                }
            }
            if (it._type === "Component")
                bRecs.insertNewBoundingRec(layers.layerList[x]._id, it._id, document.getElementById(it._id).getBoundingClientRect());
        }
    }
    layers.changeLayer(layers.layerList[0]._id);
    return;
}


function canResizeAutofit(id, possibleWidth, possibleHeight) {
    var offsetX = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];
    var dims = getTextDimensions(document.getElementById(id + 'name').innerText);
    var widthOfName = dims.width + 2 * offsetX;
    var heightOfName = dims.height + 2 * offsetY;
    return !(widthOfName > possibleWidth || heightOfName > possibleHeight);
}


function passAutoFitRestrictions(id) {
    var offsetX = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];

    var dims = getTextDimensions(document.getElementById(id + 'name').innerHTML);
    var widthOfName = dims.width + 2 * offsetX;
    var heightOfName = dims.height + 2 * offsetY;
    var componentRect = document.getElementById(id).getBoundingClientRect();
    return (componentRect.width >= widthOfName && componentRect.height >= heightOfName);
}

export { autoResizeDispatch, canResizeAutofit, checkAndResize, autoResizeAllComponents, autoResizeAutoFit, setInitialSize, passAutoFitRestrictions };