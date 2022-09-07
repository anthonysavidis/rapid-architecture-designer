import { items } from "../Classes/ItemArray.js";
import { applyToEachOperation, layers } from "../Classes/LayerHolder.js";
import { getCustomTextDimensions } from "../Item/resize.js";

var maxSelectedWidthMap = {

}

function getSelectedFunctionWidth(id) {
    // const displayOld = document.getElementById(id).style.display;
    // document.getElementById(id).style.display = "block";
    // // document.getElementById(id).style.width = "fit-content";

    // document.getElementById(id).className = "selectedFunction";
    // const fRect = document.getElementById(id).getBoundingClientRect();
    // const opWidth = fRect.width;
    // document.getElementById(id).className = "function";
    // document.getElementById(id).style.display = displayOld;
    // // document.getElementById(id).style.width = "var(--selectedOperationsWidth)";
    const textDims = getCustomTextDimensions("var(--operationTextFamily)", "var(--operationTextSize)", document.getElementById(id + 'name').innerHTML);
    const opWidth = textDims.width + 43 + 14 + 4;
    return opWidth;
}

function changeMaxWidth(fWidth) {

    maxSelectedWidthMap[layers.selectedLayer._id] = fWidth;
    var r = document.querySelector(':root');

    r.style.setProperty("--selectedOperationsWidth", fWidth + "px");
    return;
}

function resetWidthToDefault() {
    // maxSelectedWidthMap[layers.selectedLayer._id] = 0;

    var r = document.querySelector(':root');
    r.style.setProperty("--selectedOperationsWidth", "fit-content");
    return;
}

function measureSelectedView(id, oneUpdated) {
    const fWidth = getSelectedFunctionWidth(id);
    // console.log(maxSelectedWidthMap[layers.selectedLayer._id]);
    if (!maxSelectedWidthMap[layers.selectedLayer._id] || fWidth > maxSelectedWidthMap[layers.selectedLayer._id]) {
        maxSelectedWidthMap[layers.selectedLayer._id] = fWidth;
        changeMaxWidth(maxSelectedWidthMap[layers.selectedLayer._id]);
    }
    return;
}

function selectLayersMaxOperationWidth(lid) {
    var r = document.querySelector(':root');
    (maxSelectedWidthMap[lid]) ? r.style.setProperty("--selectedOperationsWidth", maxSelectedWidthMap[lid] + "px") : r.style.setProperty("--selectedOperationsWidth", "fit-content");
    return;
}

function measureSelectedLayer() {
    maxSelectedWidthMap[layers.selectedLayer._id] = 0;
    for (var x in items.itemList) {
        if (items.itemList[x]._type === "Function")
            measureSelectedView(items.itemList[x]._id);
    }

}

//called on load/copy/move & on their u/r actions.
function measureAllLayersOperations() {
    // resetWidthToDefault();
    // console.log('measure ls called');

    setTimeout(() => {
        const measureCallBack = (operation) => {
            measureSelectedView(operation._id);
        }
        applyToEachOperation(measureCallBack);
        // changeMaxWidth(maxSelectedWidthMap[layers.selectedLayer._id]);

    }, 100);
}

export { measureAllLayersOperations, changeMaxWidth, measureSelectedLayer, resetWidthToDefault, measureSelectedView, selectLayersMaxOperationWidth, getSelectedFunctionWidth };