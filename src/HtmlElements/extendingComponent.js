import { collapseSubcomponentsAction, extendSubcomponentsAction } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { renderLine } from "../Item/createLine.js";
import { addResize, autoResize, getTextDimensions } from "../Item/resize.js";
import { closeTooltip } from "./infoTooltip.js";

function getSubComponentWidth(text) {
    const textDims = getTextDimensions(text);
    const compWidth = 150 + (textDims.width > 150 ? textDims.width - 140 : 0);
    return compWidth;
    // renderInfoButton(id);
}


function addSubcomponents(id, nameList) {
    const numberOfSubcomponets = nameList.length;
    var l1 = document.createElement('div'),
        l2 = document.createElement('div');
    l1.className = l2.className = "seperativeLine";
    l1.id = id + 'l1';
    l2.style.marginTop = 3 + "px";
    l2.id = id + 'l2';
    document.getElementById(id).appendChild(l1);
    document.getElementById(id).appendChild(l2);
    document.getElementById(id).style.height = 50 + "px"
    for (let index = 0; index < numberOfSubcomponets; index++) {
        document.getElementById(id).style.height = parseInt(document.getElementById(id).style.height, 10) + 56 + "px";
        var subComponent = document.createElement('p');
        subComponent.id = id + 'subComponent' + index;
        subComponent.className = "subComponent";
        subComponent.innerText = nameList[index];
        var subWidth = getSubComponentWidth(nameList[index]);
        if (subWidth > document.getElementById(id).getBoundingClientRect().width) {
            document.getElementById(id).style.width = subWidth + "px";
        }
        document.getElementById(id).append(subComponent);
        if (index !== (numberOfSubcomponets - 1)) {
            var seperateLine = document.createElement('div');
            seperateLine.className = "seperativeLine";
            seperateLine.id = id + 'subComponent' + index + 'Line';
            document.getElementById(id).append(seperateLine);
        }
    }
}

function collapseSubcomponents(id) {
    if (!document.getElementById(id + 'l1')) //means isn't extended.
        return;
    document.getElementById(id + 'l1').remove();
    document.getElementById(id + 'l2').remove();
    var index = 0;
    // for (let index = 0; index < numberOfSubcomponets; index++) {
    while (document.getElementById(id + 'subComponent' + index)) {
        document.getElementById(id + 'subComponent' + index).remove();
        if (document.getElementById(id + 'subComponent' + index + 'Line'))
            document.getElementById(id + 'subComponent' + index + 'Line').remove();
        index++;
    }
    document.getElementById(id).style.height = 75 + "px";
    return;
}


function calculateSubcomponents(id) {
    const component = items.itemList[items.itemList.findIndex((el) => el._id === id)];
    const subLayerItems = layers.itemMap.get(component.subLayers[0]);
    var componentNames = [];
    for (var x in subLayerItems.itemList) {
        (subLayerItems.itemList[x]._type === "Component") ? componentNames.push(subLayerItems.itemList[x]._name): 1;
    }
    return componentNames;
}

function turnOnExtension(id) {
    const subComponentsName = calculateSubcomponents(id);
    if (subComponentsName.length === 0)
        return;
    addSubcomponents(id, subComponentsName);
    closeTooltip(id);
    document.getElementById(id + "resizer").remove();
    if (items.itemList[items.itemList.findIndex(el => el._id === id)].links)
        renderLine(id);
    return;
}

function turnOffExtension(id) {
    const subComponentsName = calculateSubcomponents(id);

    collapseSubcomponents(id);
    // closeTooltip(id);
    addResize(id);
    if (items.itemList[items.itemList.findIndex(el => el._id === id)].links)
        renderLine(id);
    return;
}

function getSubcomponentButton(componentId) {
    var switchButton = document.createElement('button');
    switchButton.style.marginRight = 122 + "px";
    switchButton.style.marginBottom = 5 + "px";
    if (document.getElementById(componentId + 'l1')) {
        switchButton.innerText = constantNames["infoTooltip"]["collapse"];
        switchButton.className = "deleteButton";
        switchButton.style.width = getTextDimensions(constantNames["infoTooltip"]["collapse"]).width + "px";
        switchButton.addEventListener("click", function() {
            turnOffExtension(componentId);
            actions.saveCommand(collapseSubcomponentsAction, extendSubcomponentsAction, componentId, "");
        });
    } else {
        switchButton.innerText = constantNames["infoTooltip"]["extended"];
        switchButton.className = "okButton";
        switchButton.style.width = getTextDimensions(constantNames["infoTooltip"]["extended"]).width + "px";
        switchButton.addEventListener("click", function() {
            turnOnExtension(componentId);
            actions.saveCommand(extendSubcomponentsAction, collapseSubcomponentsAction, componentId, "");
        });
    }
    return switchButton;
}

function areAllExtendable(itemsList) {
    var extentable = true;
    for (var x in itemsList) {
        if (itemsList[x].subLayers.length === 0) {
            var extentable = false;
        }
    }
    return extentable;
}

function areAllCollapsed(itemsList) {
    var collapsed = true;
    for (var x in itemsList) {
        if (!document.getElementById(itemsList[x]._id + "resizer")) {
            var collapsed = false;
        }
    }
    return collapsed;
}

function areAllExtended(itemsList) {
    var extended = true;
    for (var x in itemsList) {
        if (document.getElementById(itemsList[x]._id + "resizer")) {
            var extended = false;
        }
    }
    return extended;
}

export { turnOnExtension, turnOffExtension, getSubcomponentButton, areAllExtendable, areAllCollapsed, areAllExtended };