import { createSpecificLayer, deleteSpecificLayer } from "../Actions/inverseActions.js";
import { changeNextLayer, changePrevLayer } from "../Actions/inverseLayerActions.js";
import { alterItemsDetails, inverseItemsDetails } from "../Actions/inversePropertiesTab.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { showInputDialog } from "../Input/inputDialog.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { produceNewLayer, subdivideAction } from "../UpTab/componentTab.js";
import { spawnTab } from "../UpTab/tabSwitch.js";
import { getSubcomponentButton } from "./extendingComponent.js";

function produceClosingButton(tooltip, id) {
    var closeTooltip = document.createElement('div');
    closeTooltip.id = id + 'closeTooltip';
    closeTooltip.className = "closeTooltip";
    tooltip.appendChild(closeTooltip);
    var title = document.createElement('div');
    title.className = "tooltipTittle";
    title.innerText = "Details";
    title.style.fontSize = 16 + "pt";
    title.style.textAlign = "center";
    tooltip.appendChild(title);

    return;
}

function produceMainPart(tooltip, src, id, itemType, description, moreInfo) {
    var mainPart = document.createElement('div'),
        editButton = document.createElement('div'),
        descriptionDiv = document.createElement('div'),
        moreInfoTittle = document.createElement('div'),
        moreInfoDiv = document.createElement('div'),
        sublayerImage = document.createElement('div');

    var title = document.createElement('div');
    title.className = "tooltipTitle";
    title.innerText = constantNames['infoTooltip']['imageTitle'];
    title.style.marginLeft = 6 + "px";
    title.style.marginTop = 3 + "px";
    // mainPart.appendChild(title);

    mainPart.className = "mainPart";
    if (itemType === "Component") {
        sublayerImage.id = id + 'sublayerImage';
        sublayerImage.className = "sublayerImage";
        sublayerImage.style.backgroundSize = 215 + "px";
        sublayerImage.style.backgroundImage = "url(" + src + ")"; //χρειαζεται ρεσκειλ
        editButton.id = id + 'architectureEditButton';
        editButton.className = "architectureEditButton";
    } else {
        if (itemType === "Link") {
            title.innerText = constantNames["infoTooltip"]["al"];
            var select = document.createElement('select');
            select.style.width = 205 + "px";
            var optionMap = new Map([
                ["", ""],
                ["point2", ""],
                ["point1", ""],
                ["bidirectional", ""]
            ]);
            var linkIndex = items.itemList.findIndex(el => el._id === id);
            var linkItem = items.itemList[linkIndex];
            var linkState = linkItem.linkState;
            var name1 = items.getNameFromId(linkItem.idComponent1);
            var name2 = items.getNameFromId(linkItem.idComponent2)
            optionMap[linkState] = "selected";
            select.innerHTML = "<option value=\"noneChoice\" " + optionMap[""] + ">" + constantNames["infoTooltip"]["none"] + "</option>";
            select.innerHTML += "<option value=\"pointTo2Choice\" " + optionMap["point2"] + ">" + constantNames["infoTooltip"]["->"] + "</option>";
            select.innerHTML += "<option value=\"pointTo1Choice\" " + optionMap["point1"] + ">" + constantNames["infoTooltip"]["<-"] + "</option>";
            select.innerHTML += "<option value=\"bidirectionalChoice\" " + optionMap["bidirectional"] + ">" + constantNames["infoTooltip"]["<->"] + "</option>";
            select.addEventListener("change", function() {
                chooseLineType(id, select.value);
            })
            mainPart.appendChild(select);
            select.style.marginLeft = 15 + "px";
        } else
            title.remove();
        var descTitle = document.createElement('div');
        descTitle.className = "tooltipTitle";
        descTitle.innerText = constantNames['infoTooltip']['descTitle'];
        descTitle.style.marginLeft = 6 + "px";
        descTitle.style.marginBottom = 4 + "px";
        descTitle.style.marginTop = 2 + "px";
        mainPart.appendChild(descTitle);
    }
    descriptionDiv.className = "tooltipDesc";
    descriptionDiv.innerHTML = '<i style="border-color:"transparent";outline-color:"transparent">' + description + '</i>';
    descriptionDiv.contentEditable = true;
    descriptionDiv.style.outline = "0px";
    descriptionDiv.onblur = (function() {
        var itemIndex = items.itemList.findIndex(el => el._id === id);
        var originalItemStr = items.itemList[itemIndex].toString();
        items.itemList[itemIndex]._description = descriptionDiv.innerText;
        var alteredItemStr = items.itemList[itemIndex].toString();
        actions.saveCommand(alterItemsDetails, inverseItemsDetails, originalItemStr, alteredItemStr);
    });


    moreInfoTittle.className = "tooltipTitle";
    moreInfoTittle.innerText = constantNames['infoTooltip']['moreInfo'];
    moreInfoTittle.style.marginBottom = 4 + "px";
    moreInfoTittle.style.marginTop = 2 + "px";
    moreInfoDiv.className = "tooltipDesc";
    moreInfoDiv.innerHTML = '<i>' + moreInfo + '</i>';
    moreInfoDiv.contentEditable = true;
    moreInfoDiv.style.outline = "0px";
    moreInfoDiv.style.paddingBottom = 10 + "px";
    moreInfoDiv.onblur = (function() {
        var itemIndex = items.itemList.findIndex(el => el._id === id);
        var originalItemStr = items.itemList[itemIndex].toString();
        items.itemList[itemIndex].moreInfo = moreInfoDiv.innerText;
        var alteredItemStr = items.itemList[itemIndex].toString();
        actions.saveCommand(alterItemsDetails, inverseItemsDetails, originalItemStr, alteredItemStr);
    });
    if (itemType === "Component") {
        // sublayerImage.appendChild(editButton);
        mainPart.appendChild(sublayerImage);
    }
    mainPart.appendChild(descriptionDiv);
    // mainPart.appendChild(moreInfoTittle);
    // mainPart.appendChild(moreInfoDiv);
    tooltip.appendChild(mainPart);
    return;
}

function produceExternal(tooltip, id) {
    var externalDiv = document.createElement('div');
    externalDiv.id = id + "tooltipExternal";
    externalDiv.className = "tooltip";
    externalDiv.style.position = "absolute";
    externalDiv.appendChild(tooltip);
    document.getElementById("main").appendChild(externalDiv);
    return externalDiv;
}

function fixPositionAndArrow(tooltip, id, itemType, itemRect, x, y) {

    var tooltipArrow = document.createElement('div');
    tooltipArrow.id = id + "tooltipArrow";
    tooltipArrow.className = "infoArrow";
    document.getElementById("main").appendChild(tooltipArrow);
    if (itemType === "Component") {
        var infoRec = document.getElementById(id + "infoIcon").getBoundingClientRect();
        document.getElementById(id + "tooltipArrow").style.left = infoRec.x + 10 + "px";
        document.getElementById(id + "tooltipArrow").style.top = infoRec.y + "px";
        document.getElementById(tooltip.id).style.left = infoRec.x + 20 + "px";
        document.getElementById(tooltip.id).style.top = infoRec.y - 125 + "px";

    } else if (itemType === "Link") {
        document.getElementById(id + "tooltipArrow").remove();
        document.getElementById(tooltip.id).style.left = x - 100 + "px";
        document.getElementById(tooltip.id).style.top = y - 100 + "px";
    } else if (itemType === "Function") {
        document.getElementById(id + "tooltipArrow").className = "fInfoArrow";
        document.getElementById(id + "tooltipArrow").style.left = x + 8 + "px";
        document.getElementById(id + "tooltipArrow").style.top = y + "px";

        document.getElementById(tooltip.id).style.left = x - 250 + "px";
        document.getElementById(tooltip.id).style.top = y - 150 + "px";

    }
    return;
}

function closeOthers() {
    const otherTooltip = document.getElementsByClassName("tooltiptext")[0];
    if (!otherTooltip)
        return;
    const arrowId = otherTooltip.id + 'Arrow';
    otherTooltip.remove();
    if (document.getElementById(arrowId))
        document.getElementById(arrowId).remove();

    return;
}

function produceTooltip(x, y, src, id) {
    closeOthers();
    var description = items.itemList[items.itemList.findIndex((el) => el._id === id)]._description;
    var itemType = items.itemList[items.itemList.findIndex((el) => el._id === id)]._type;
    var moreInfo = items.itemList[items.itemList.findIndex((el) => el._id === id)].moreInfo;
    var itemRect = document.getElementById(id).getBoundingClientRect();
    var tooltip = document.createElement('span');
    tooltip.className = "tooltiptext";
    tooltip.id = id + "tooltip";
    produceClosingButton(tooltip, id);
    produceMainPart(tooltip, src, id, itemType, description, moreInfo);
    var externalDiv = produceExternal(tooltip, id);

    var layerExists = !(src === './images/noSub.png' || itemType !== "Component");
    console.log(layerExists);
    console.log(src);
    setUpTooltipListeners(id, layerExists);
    fixPositionAndArrow(tooltip, id, itemType, itemRect, x, y);
    return;
}

function closeTooltip(id) {
    if (!document.getElementById(id + "tooltip"))
        return;
    document.getElementById(id + "tooltip").remove();
    if (document.getElementById(id + "tooltipArrow"))
        document.getElementById(id + "tooltipArrow").remove();
    if (document.getElementById(id + "tooltipExternal"))
        document.getElementById(id + "tooltipExternal").remove();
    return;
}

// function createEmptySubArchitecture(id) {
//     var callBack = (name, cancelled) => {
//         if (cancelled === 1)
//             return;
//lath0s
//         var layerCreated = produceNewLayer(id, name);
//         actions.saveCommand(createSpecificLayer, deleteSpecificLayer, "", layerCreated.toString());
//         closeTooltip(id);
//     }

//     showInputDialog("layer", callBack);
//     return;
// }

function setUpTooltipListeners(id, layerExists) {
    //x kai edit
    document.getElementById(id + 'closeTooltip').addEventListener("click", function() {
        closeTooltip(id);
    });
    if (!layerExists) {
        var itemIndex = items.itemList.findIndex((el) => el._id === id);
        if (items.itemList[itemIndex]._type === "Component") {
            // span.innerText = "Double click to subdivide.";
            const imgRec = document.getElementById(id + 'sublayerImage').getBoundingClientRect();
        }
    }
}

export { produceTooltip, closeTooltip };