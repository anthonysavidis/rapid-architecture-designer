import { applyToEachOperation, layers } from "../Classes/LayerHolder.js";

var maxSelectedWidthMap = {

}

function getSelectedFunctionWidth(id) {
    document.getElementById(id).className = "selectedFunction";
    const fRect = document.getElementById(id).getBoundingClientRect();
    const opWidth = fRect.width;
    document.getElementById(id).className = "function";
    return opWidth;
}

function measureSelectedView(id) {
    console.log(id);
    const fWidth = getSelectedFunctionWidth(id);
    if (!maxSelectedWidthMap[layers.selectedLayer._id] || fWidth > maxSelectedWidthMap[layers.selectedLayer._id]) {
        maxSelectedWidthMap[layers.selectedLayer._id] = fWidth;
        var r = document.querySelector(':root');
        r.style.setProperty("--selectedOperationsWidth", fWidth + "px");
    }
    return;
}

function selectLayersMaxOperationWidth(lid) {
    var r = document.querySelector(':root');
    (maxSelectedWidthMap[lid]) ? r.style.setProperty("--selectedOperationsWidth", maxSelectedWidthMap[lid] + "px"): r.style.setProperty("--selectedOperationsWidth", "fit-content");
    return;
}

//called on load/copy/move & on their u/r actions.
function measureAllLayersOperations() {
    setTimeout(() => {
        const measureCallBack = (operation) => {
            measureSelectedView(operation._id);
        }
        applyToEachOperation(measureCallBack);
        console.log(maxSelectedWidthMap);

    }, 100);
}

export { measureAllLayersOperations, measureSelectedView, selectLayersMaxOperationWidth };