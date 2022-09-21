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
import { appearComponentButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { produceExpandedNode } from "./goExtendedComponents.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";

function getSubComponentWidth(text) {
    const textDims = getTextDimensions(text);
    const compWidth = 150 + (textDims.width > 150 ? textDims.width - 140 : 0);
    return compWidth;
    // renderInfoButton(id);
}

function addDoubleLine(id) {
    var l1 = document.createElement('div'),
        l2 = document.createElement('div');
    var offsetX = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];

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

function createASubcomponent(subid, compid, text) {
    var subComponent = document.createElement('div');
    subComponent.id = subid;
    subComponent.className = "subComponent";
    // subComponent.style.width = parseInt(document.getElementById(id).style.width, 10)-2+"px";
    subComponent.innerText = text;
    document.getElementById(compid).append(subComponent);
    return;
}

function addSubcomponents(id, nameList) {
    const numberOfSubcomponets = nameList.length;
    addDoubleLine(id);
    document.getElementById(id).style.height = "fit-content";
    document.getElementById(id).style.width = "fit-content";
    for (let index = 0; index < numberOfSubcomponets; index++) {
        document.getElementById(id).style.height = parseInt(document.getElementById(id).style.height, 10) + 56 + "px";
        createASubcomponent(id + "subComponent" + index, id, nameList[index]);
        var subWidth = getSubComponentWidth(nameList[index]);
        if (subWidth > document.getElementById(id).getBoundingClientRect().width) {
            document.getElementById(id).style.width = subWidth + "px";
        }
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
    var offsetX = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
    var offsetY = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];

    var maxWidth = 0;
    // document.getElementById(component._id).style.height = heightOfName + 2 * offsetY + "px";
    if (document.getElementById(id + "Description")) {
        maxWidth = getTextDimensions(document.getElementById(id + 'name').innerText).width;
        var heightAcc = 0;
        for (var i = 0; i < nameList.length; i++) {
            var textDims = getCustomTextDimensions("Arial, Helvetica, sans-serif", "small", nameList[i]);
            (textDims.width > maxWidth) ? maxWidth = textDims.width : 1;
            heightAcc += textDims.height;
        }
        document.getElementById(id + "Description").style.height = heightAcc + 2 * offsetY + "px";
        document.getElementById(id).style.width = maxWidth + 2 * offsetX + "px";
    } else {
        maxWidth = getTextDimensions(document.getElementById(id + 'name').innerText).width;
        nameList.forEach((el) => {
            var width = getTextDimensions(el).width;
            (width > maxWidth) ? maxWidth = width : 1;
        });
        document.getElementById(id).style.width = maxWidth + 2 * offsetX + "px";
        for (var i = 0; i < nameList.length; i++) {
            document.getElementById(id + 'subComponent' + i).style.height = getTextDimensions(nameList[i]).height + 2 * offsetY + "px";
        }
        renderLine(id);
    }
    return;
}


function getNameListArgument(component) {
    const id = component._id;
    if (document.getElementById(id + "Description")) {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const lineNo = rs.getPropertyValue("--descriptionLines");
        return handleSplitDescription(component._description, lineNo)
    } else {
        return calculateSubcomponents(id);
    }
}


function turnOnExtension(id) {
    // var r = document.querySelector(':root');
    //     r.style.setProperty("--componentDisplay", "block");
    const component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    if (document.getElementById(id + "Description")) {
        turnOffDescription(component);
    }
    document.getElementById(id).style.display = "block";
    const subComponentsName = calculateSubcomponents(id);
    addSubcomponents(id, subComponentsName);
    closeTooltip(id);
    document.getElementById(id + "resizer").remove();
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
    addResize(id);
    const component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    autoResizeDispatch["autoFit"](component);
    if (component.links)
        renderLine(id);
    appearComponentButtons();
    if (configStyle.descriptionEnabled) {
        turnOffDescription(component);
        turnOnDescription(component);
        // autoResizeDispatch["autoFit"](component);
    }
    return;
}

function areAllExtendable(itemsList) {
    var extentable = true;
    for (var x in itemsList) {
        if (!itemsList[x].subLayers[0] || (itemsList[x].subLayers[0] && layers.getItems(itemsList[x].subLayers[0]).itemList.length === 0)) {
            extentable = false;
        }
    }
    return extentable;
}

function areAllCollapsed(itemsList) {
    var collapsed = true;
    for (var x in itemsList) {
        if (!document.getElementById(itemsList[x]._id + "resizer") && !document.getElementById(itemsList[x]._id + "Description")) {
            collapsed = false;
        }
    }
    return collapsed;
}

function areAllExtended(itemsList) {
    var extended = true;
    for (var x in itemsList) {
        if (document.getElementById(itemsList[x]._id + "resizer") || document.getElementById(itemsList[x]._id + "Description")) {
            var extended = false;
        }
    }
    return extended;
}
const getWidth = (txt) => {
    return getCustomTextDimensions("Arial, Helvetica, sans-serif", "small", txt).width;
}

function handleSplitDescription(description, lineNo) {
    // description = "Lorem ipsum dol ori ahora que si.ahora que si.ahora que si.ahora que si.";
    // var descDims = getCustomTextDimensions("Arial, Helvetica, sans-serif","small",description);
    var words = description.split(" ");
    // const CHARS_LIMIT = 35;
    var lines = description.match(/.{1,22}/g) || [];;
    var word_counter = 0;
    // for (var i = 0; i < lineNo; i++) {
    //     var line = "";
    //     var totalPixels = 0;
    //     while (words[word_counter] && (totalPixels + getWidth(words[word_counter])) < PIXELS_LIMIT) {
    //         line += words[word_counter] + " ";
    //         word_counter++;
    //         totalPixels += getWidth(words[word_counter] + " ");
    //     }
    //     line.slice(0, -1);
    //     if (line === "" || !line.replace(/\s/g, '').length)
    //         continue;
    //     lines.push(line);
    // }

    return lines;
}

function findMaxChars(descLines) {
    var max = -1;
    for (var x in descLines)
        max = (max < descLines[x].length) ? descLines[x].length : max;
    return max;
}

function handleDescriptionExtension(component, lineNo) {
    const id = component._id;
    addDoubleLine(id);
    document.getElementById(id).style.height = "fit-content";
    document.getElementById(id).style.width = "fit-content";
    var subComponent = document.createElement('div');
    subComponent.id = id + 'Description';
    subComponent.className = "subComponent";
    subComponent.style += " -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
    subComponent.style.fontSize = "small";
    subComponent.style.color = "var(--descriptionColor)";

    const descriptionLines = handleSplitDescription(component._description, lineNo);
    var lineMaxWidth = 0,
        lineIndex = 0;
    for (var x in descriptionLines) {
        if (lineMaxWidth < getWidth(descriptionLines[x])) {
            lineMaxWidth = getWidth(descriptionLines[x]);
            lineIndex = x;
        }
        subComponent.innerHTML += descriptionLines[x] + "<br />";
    }
    document.getElementById(id).append(subComponent);
    document.getElementById(id).style.width = document.getElementById(id).getBoundingClientRect().width + "px";
    document.getElementById(id).style.height = document.getElementById(id).getBoundingClientRect().height + "px";
    // subComponent.style.width = "fit-content";
    // subComponent.style.height = "fit-content";

    return descriptionLines;
}


function makeDescriptionUnselectable() {
    // -webkit-touch-callout: none;
    // -webkit-user-select: none;
    // -khtml-user-select: none;
    // -moz-user-select: none;
    // -ms-user-select: none;
    // user-select: none;


}

function turnOnDescription(component) {
    const id = component._id;
    if (component.isDescExtended) {
        return;
    }
    items.itemList[items.itemList.findIndex(el => el._id === component._id)].isDescExtended = true;

    const initialNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(component._id);
    produceExpandedNode(id, [component._description], initialNode, true);

    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const lineNo = rs.getPropertyValue("--descriptionLines");
    const descLines = handleSplitDescription(component._description, lineNo);
    const descMAxChars = findMaxChars(descLines);
    const maxChars = descMAxChars > component._name.length ? descMAxChars : component._name.length;

    // initialNode.findObject("SUB_COMPONENT_TEXT0").lineCount = lineNo;
    initialNode.findObject("SUB_COMPONENT0").strokeWidth = 0;

    const textWidth = initialNode.findObject("DESCRIPTION_TEXT0").naturalBounds.width + 20;
    var componentFinalWidth = textWidth > 240 ? 240 : textWidth;
    initialNode.width = componentFinalWidth > initialNode.width ? componentFinalWidth : initialNode.width;
    componentFinalWidth = initialNode.width;

    initialNode.findObject("DESCRIPTION_TEXT0").left = 0;
    initialNode.findObject("SUB_COMPONENT0").width = initialNode.findObject("DB_LINE").width = componentFinalWidth;
    initialNode.height = 87;
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(id).findObject("COMPONENT").resizable = false;
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(id).findObject("DESCRIPTION_TEXT0").maxLines = lineNo;
    if (descLines.length > 2 && lineNo > 2) {
        const descMulFactor = (descLines.length - 2) > 5 ? 5 : (descLines.length - 2);
        const subHeight = descMulFactor * 18;
        initialNode.findObject("SUB_COMPONENT0").height += subHeight;
        initialNode.findObject("COMPONENT").height += subHeight;
    }

    var finalStr = "";
    for (var x in descLines)
        finalStr += descLines[x] + '\n';
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(id).findObject("DESCRIPTION_TEXT0").text = finalStr;
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(id).findObject("DESCRIPTION_TEXT0").margin = new go.Margin(10, 0, 0, 0);
    // resizeExtended(id, handleDescriptionExtension(component, lineNo));
    // if (component.links)
    // renderLine(id);
    // document.getElementById(id).style.height = "fit-content";
    // component.updateBoundingRec();
    return;
}

function turnOffDescription(component) {
    if (!component.isDescExtended)
        return;
    items.itemList[items.itemList.findIndex(el => el._id === component._id)].isDescExtended = false;

    // const prevLocation = delNode.location;
    var delNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(component._id)
    delNode.height -= delNode.findObject("SUB_COMPONENT0").height;
    delNode.remove(component.expandedNode);
    // delNode.findObject("COMPONENT_TEXT_BLOCK").textAlign = "center";
    // delNode.findObject("COMPONENT_TEXT_BLOCK").position = "center";
    InstanceGenerator.diagramMap[layers.selectedLayer._id].model.setDataProperty(delNode.data, "textblockPosition", go.Spot.Center);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(component._id).findObject("COMPONENT_TEXT_BLOCK").margin = new go.Margin(0, 0, 0, 0);

    // InstanceGenerator.diagramMap[layers.selectedLayer._id].remove(delNode);
    // items.itemList[items.itemList.findIndex(el => el._id === component._id)].spawnComponent();
    InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(component._id).findObject("COMPONENT").resizable = true;

    return;
}



export { turnOnExtension, turnOffExtension, calculateSubcomponents, getNameListArgument, resizeExtended, turnOnDescription, turnOffDescription, areAllExtendable, areAllCollapsed, areAllExtended };