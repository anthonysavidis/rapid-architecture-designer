import { renderLine } from "../Item/createLine.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { configStyle } from "../Classes/Config.js";


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
    "true": autoResizeAutoFit,
    "false": autoGrow
}

function autoResizeAllComponents() {
    const currentLayerId = layers.selectedLayer._id;
    for (var x in layers.layerList) {
        layers.changeLayer(layers.layerList[x]._id);
        const layerItems = layers.itemMap.get(layers.layerList[x]._id);
        // console.log(layerItems);

        for (var y in layerItems.itemList) {
            if (layerItems.itemList[y]._type === "Component") {
                autoResizeDispatch[configStyle.autoFit.toString()](layerItems.itemList[y]);
            }
        }
    }
    layers.changeLayer(currentLayerId);

    // if (configStyle.autoFit) {
    //     autoResizeAutoFit();
    // } else {
    //     autoGrow();
    // }
    return;
}

export {autoResizeDispatch};