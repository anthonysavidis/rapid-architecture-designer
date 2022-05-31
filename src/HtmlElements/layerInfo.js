import { addMotion, addMotionToLayerInfo } from "../Input/movingModal.js";
import { countEmptyComponents, countOrphanOperations, getComponentWithTheLeastOperations, getComponentWithTheMostOperations, highlightEmptyComponents, highlightLeastOperationalComponent, highlightMostOperationalComponent, highlightOrphanOperations, resetHighlightedHints, updateLayerInfoBox } from "../Layers/layerInfoFunctions.js";
import { produceMovingBar } from "./infoBoxes.js";

var closeInfo = null;

function createLabels(box, infoGrid) {
    var orphanOperationLabel = document.createElement('div');
    var componentLabel = document.createElement('div');
    var componentMostOperationsLabel = document.createElement('div');
    var componentLeastOperationsLabel = document.createElement('div');
    orphanOperationLabel.className = componentLabel.className = componentMostOperationsLabel.className = componentLeastOperationsLabel.className = "labelDiv unselectableText";
    infoGrid.style.marginBottom = "15px";
    orphanOperationLabel.innerText = "Orphan Operations:";
    componentLabel.innerText = "Component with 0 operations:";
    componentMostOperationsLabel.innerText = "Component with most operations:";
    componentLeastOperationsLabel.innerText = "Component with least operations:";
    orphanOperationLabel.className += " item1";
    componentLabel.className += " item4";
    componentMostOperationsLabel.className += " item7";
    componentLeastOperationsLabel.className += " item10";
    orphanOperationLabel.style.whiteSpace = componentLabel.style.whiteSpace = componentMostOperationsLabel.style.whiteSpace = componentLeastOperationsLabel.style.whiteSpace = "nowrap";

    infoGrid.appendChild(orphanOperationLabel);
    infoGrid.appendChild(componentLabel);
    infoGrid.appendChild(componentMostOperationsLabel);
    infoGrid.appendChild(componentLeastOperationsLabel);
}

function createValues(box, infoGrid) {
    var orphanOperationValue = document.createElement('div');
    var componentValue = document.createElement('div');
    var componentMostOperationsValue = document.createElement('div');
    var componentLeastOperationsValue = document.createElement('div');
    orphanOperationValue.className = componentValue.className = componentMostOperationsValue.className = componentLeastOperationsValue.className = "labelDiv unselectableText";

    orphanOperationValue.id = "orphanOperationValue";
    componentValue.id = "componentValue";
    componentMostOperationsValue.id = "componentMostOperationsValue";
    componentLeastOperationsValue.id = "componentLeastOperationsValue";

    infoGrid.style.marginBottom = "15px";
    // orphanOperationValue.innerText = countOrphanOperations();
    // componentValue.innerText = countEmptyComponents();
    // componentMostOperationsValue.innerText = getComponentWithTheMostOperations()._name;
    // componentLeastOperationsValue.innerText = getComponentWithTheLeastOperations()._name;
    orphanOperationValue.className += " item2";
    componentValue.className += " item5";
    componentMostOperationsValue.className += " item8";
    componentLeastOperationsValue.className += " item11";
    infoGrid.appendChild(orphanOperationValue);
    infoGrid.appendChild(componentValue);
    infoGrid.appendChild(componentMostOperationsValue);
    infoGrid.appendChild(componentLeastOperationsValue);
}

function produceHints(infoGrid) {
    var roleHint, functionHint, maxHint, minHint;
    roleHint = document.createElement('div');
    functionHint = document.createElement('div');
    maxHint = document.createElement('div');
    minHint = document.createElement('div');
    roleHint.className = functionHint.className = maxHint.className = minHint.className = "layerInfoHint";
    functionHint.id = "functionHint";
    roleHint.id = "roleHint";
    maxHint.id = "maxHint";
    minHint.id = "minHint";
    functionHint.className += " item3";
    roleHint.className += " item6";
    maxHint.className += " item9";
    minHint.className += " item12";
    infoGrid.appendChild(roleHint);
    infoGrid.appendChild(functionHint);
    infoGrid.appendChild(maxHint);
    infoGrid.appendChild(minHint);

    functionHint.onclick = () => { highlightOrphanOperations(functionHint); }
    roleHint.onclick = () => { highlightEmptyComponents(roleHint); }
    maxHint.onclick = () => { highlightMostOperationalComponent(maxHint, minHint); }
    minHint.onclick = () => { highlightLeastOperationalComponent(minHint, maxHint); }
    return;
}

function produceLayerInfoContent(box) {
    var infoGrid = document.createElement('div');
    infoGrid.className = "configGrid";
    infoGrid.style.marginLeft = "0px";
    infoGrid.style.paddingLeft = infoGrid.style.paddingRight = "28px";
    createLabels(box, infoGrid);
    createValues(box, infoGrid);
    produceHints(infoGrid);
    box.appendChild(infoGrid);
    return;
}

function createLayerInfoModal() {
    if (document.getElementsByClassName("layerInfoBox")[0]) {
        document.getElementsByClassName("layerInfoBox")[0].remove();
        closeInfo = null;
    }
    var tittleDiv = document.createElement('div');
    tittleDiv.className = "tittleDiv unselectableText";
    tittleDiv.style.marginLeft = "32px";
    tittleDiv.style.textAlign = "center";
    tittleDiv.innerHTML = "Layer Info";
    var box = document.createElement('div');
    box.className = "layerInfoBox";
    box.id = "layerInfo";
    closeInfo = function() {
        resetHighlightedHints();
        box.remove();
        closeInfo = null;
    }
    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.style.marginTop = "-10px";
    closeButton.onclick = closeInfo;
    box.appendChild(closeButton);
    box.appendChild(tittleDiv);

    produceLayerInfoContent(box);

    document.getElementById("body").appendChild(box);
    addMotionToLayerInfo(box);
    updateLayerInfoBox();
    return;
}

export { createLayerInfoModal, closeInfo }