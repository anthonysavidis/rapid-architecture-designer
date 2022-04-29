import { collapseSubcomponentsAction, extendSubcomponentsAction } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { renderLine } from "../Item/createLine.js";
import { addResize, getTextDimensions, getCustomTextDimensions } from "../Item/resize.js";
import { closeTooltip } from "./infoTooltip.js";
import { autoResizeDispatch } from "../Item/autoResize.js";
import { configStyle } from "../Classes/Config.js";

function getSubComponentWidth(text) {
    const textDims = getTextDimensions(text);
    const compWidth = 150 + (textDims.width > 150 ? textDims.width - 140 : 0);
    return compWidth;
    // renderInfoButton(id);
}

function addDoubleLine(id) {
    var l1 = document.createElement('div'),
        l2 = document.createElement('div');
    var offsetX = configStyle.getJSONValue("innerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("innerMarginY").split("px")[0];

    l1.className = l2.className = "seperativeLine";
    l1.style.marginTop = offsetY + "px";
    l1.id = id + 'l1';
    l2.style.marginTop = 3 + "px";
    l2.id = id + 'l2';
    document.getElementById(id + 'name').style.marginTop = offsetY + "px";
    document.getElementById(id).appendChild(l1);
    document.getElementById(id).appendChild(l2);
    return;
}


function addSubcomponents(id, nameList) {
    const numberOfSubcomponets = nameList.length;
    addDoubleLine(id);
    document.getElementById(id).style.height = "fit-content";
    document.getElementById(id).style.width = "fit-content";
    for (let index = 0; index < numberOfSubcomponets; index++) {
        document.getElementById(id).style.height = parseInt(document.getElementById(id).style.height, 10) + 56 + "px";
        var subComponent = document.createElement('div');
        subComponent.id = id + 'subComponent' + index;
        subComponent.className = "subComponent";
        // subComponent.style.width = parseInt(document.getElementById(id).style.width, 10)-2+"px";
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
        (subLayerItems.itemList[x]._type === "Component") ? componentNames.push(subLayerItems.itemList[x]._name) : 1;
    }
    return componentNames;
}

function resizeExtended(id, nameList) {
    var maxWidth = 0;
    nameList.forEach((el) => {
        var width = getTextDimensions(el).width;
        (width > maxWidth) ? maxWidth = width : 1;
    });
    var offsetX = configStyle.getJSONValue("innerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("innerMarginY").split("px")[0];

    document.getElementById(id).style.width = maxWidth + 2 * offsetX + "px";
    // document.getElementById(component._id).style.height = heightOfName + 2 * offsetY + "px";
    for (var i = 0; i < nameList.length; i++) {
        document.getElementById(id + 'subComponent' + i).style.height = getTextDimensions(nameList[i]).height + 2 * offsetY + "px";
    }
    return;
}

function turnOnExtension(id) {
    // var r = document.querySelector(':root');
    //     r.style.setProperty("--componentDisplay", "block");
    document.getElementById(id).style.display = "block";

    const subComponentsName = calculateSubcomponents(id);
    if (subComponentsName.length === 0)
        return;
    addSubcomponents(id, subComponentsName);
    closeTooltip(id);
    document.getElementById(id + "resizer").remove();
    const component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    // autoResizeDispatch["autoFit"](component);
    resizeExtended(id, subComponentsName);
    if (component.links)
        renderLine(id);
    return;
}

function turnOffExtension(id) {
    const subComponentsName = calculateSubcomponents(id);
    // var r = document.querySelector(':root');
    document.getElementById(id).style.display = "flex";
    // r.style.setProperty("--componentDisplay", "flex");
    document.getElementById(id + 'name').style.marginTop = "0";

    collapseSubcomponents(id);
    // closeTooltip(id);
    addResize(id);
    const component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    autoResizeDispatch["autoFit"](component);
    if (component.links)
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
        switchButton.addEventListener("click", function () {
            turnOffExtension(componentId);
            actions.saveCommand(collapseSubcomponentsAction, extendSubcomponentsAction, componentId, "");
        });
    } else {
        switchButton.innerText = constantNames["infoTooltip"]["extended"];
        switchButton.className = "okButton";
        switchButton.style.width = getTextDimensions(constantNames["infoTooltip"]["extended"]).width + "px";
        switchButton.addEventListener("click", function () {
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
const getWidth = (txt) => {
    return getCustomTextDimensions("Arial, Helvetica, sans-serif", "small", txt).width;
}

function handleSplitDescription(description, lineNo) {
    description="Lorem ipsum dol ori ahora que si.ahora que si.ahora que si.ahora que si.";
    // var descDims = getCustomTextDimensions("Arial, Helvetica, sans-serif","small",description);
    var words = description.split(" ");
    var lines = [];
    var word_counter = 0;
    const PIXELS_LIMIT = 50;
    for (var i = 0; i < lineNo; i++) {
        var line = "";
        var totalPixels = 0;
        while (words[word_counter] && (totalPixels + getWidth(words[word_counter] + " ")) < PIXELS_LIMIT) {
            line += words[word_counter] + " ";
            word_counter++;
            totalPixels += getWidth(words[word_counter]+" ");
        }
        line.slice(0, -1);
        lines.push(line);
    }
    return lines;
}

function turnOnDescription(component) {
    const id = component._id;
    if (document.getElementById(id + 'l1'))
        return; //is already extended...
    document.getElementById(id).style.display = "block";
    // document.getElementById(id).style.height = "fit-content";

    addDoubleLine(id);
    document.getElementById(id).style.height = "fit-content";
    document.getElementById(id).style.width = "fit-content";
    var subComponent = document.createElement('div');
    subComponent.id = id + 'Description';
    subComponent.className = "subComponent";
    subComponent.style.fontSize = "small";
    subComponent.style.color = "#545454";
    const descriptionLines = handleSplitDescription(component._description, 4);
    var lineMaxWidth=0,lineIndex=0;
    for (var x in descriptionLines) {
        if(lineMaxWidth<getWidth(descriptionLines[x])){
            lineMaxWidth=getWidth(descriptionLines[x]);
            lineIndex=x;
        } 
        subComponent.innerHTML += descriptionLines[x] + "<br />";
    }
    // document.getElementById(id).style.height = parseInt(document.getElementById(id).style.height, 10) +56 + "px";
    var subWidth = lineMaxWidth;
    const offsetX=configStyle.getJSONValue("innerMarginX").split("px")[0];
    if ((subWidth+2*offsetX) > document.getElementById(id).getBoundingClientRect().width) {
        document.getElementById(id).style.width = subWidth+2*offsetX + "px";
    }
    document.getElementById(id).append(subComponent);
    document.getElementById(id + 'resizer').remove();
    if (component.links)
        renderLine(id);
}

function turnOffDescription(component) {
    const id = component._id;
    document.getElementById(id).style.display = "flex";
    document.getElementById(id + 'name').style.marginTop = "0";
    document.getElementById(id + 'Description').remove();
    document.getElementById(id + 'l1').remove();
    document.getElementById(id + 'l2').remove();
    addResize(id);
    // const component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    autoResizeDispatch["autoFit"](component);
    if (component.links)
        renderLine(id);
    return;
}



export { turnOnExtension, turnOffExtension, turnOnDescription, turnOffDescription, getSubcomponentButton, areAllExtendable, areAllCollapsed, areAllExtended };