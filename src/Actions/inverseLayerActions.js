import { layers } from "../Classes/LayerHolder.js";

function changeNextLayer(actionItems) {
    layers.changeLayer(actionItems.updatedItem);
}

function changePrevLayer(actionItems) {
    layers.changeLayer(actionItems.initialItem);
}

export { changeNextLayer, changePrevLayer }