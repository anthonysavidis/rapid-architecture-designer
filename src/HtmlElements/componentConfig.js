import { configStyle } from "../Classes/Config.js";
import { applyToEachComponent, getAllBoundingRectMap, refreshAllLinks, setBoundingRectMap } from "../Classes/LayerHolder.js";
import { autoResizeAllComponents } from "../Item/autoResize.js";
import { createPicker, createRestoreButton, getSliderGroup, getSwitch, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";
import { constantNames } from "../config/constantNames.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { addMotion } from "../Input/movingModal.js";
import { turnOnDescription, turnOffDescription } from "../HtmlElements/extendingComponent.js";
import { layers } from "../Classes/LayerHolder.js";
import { descriptionArea } from "../HtmlElements/descriptionConfig.js";
import { actions } from "../Classes/Actions.js";
import { disableDescriptionInAllComponents, enableDescriptionInAllComponents } from "../Actions/inverseActions.js";
import { canBeDeleted } from "../Workspace/trashBin.js";
import { renderLine } from "../Item/createLine.js";


function produceComponentForm(box, configGrid) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.innerText = constantNames["configBox"]["component"];;

    var div = document.createElement('div');
    div.className = "formContainer";
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.handleChange(type, attributeChanged, value); }
    var sizeStyleContainer = document.createElement('div');
    sizeStyleContainer.className = "formContainer";
    sizeStyleContainer.style.marginTop = 5 + "px";
    produceSizeForm(sizeStyleContainer, "Component", callBack);
    produceStyleButtons(sizeStyleContainer, "Component", callBack);
    produceFontFamilyForms(sizeStyleContainer, "Component", callBack);
    produceTextColor(configGrid, "Component", callBack);
    box.appendChild(div);
    box.appendChild(sizeStyleContainer);
    return;
}

var borderContainer;

function produceComponentConfigBox(box, configGrid) {

    const backgroundCallBack = (value) => { configStyle.handleChange('Component', "backgroundColor", value); };
    const borderCallBack = (value) => { configStyle.handleChange('Component', "borderColor", value); };
    const selectedBorderCallBack = (value) => { configStyle.handleChange('Component', "selectedBorderColor", value); };
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var selectedBackgroundColor = rs.getPropertyValue('--componentBackgroundColor');
    var borderColor = rs.getPropertyValue('--componentBorderColor');
    var selectedBorderColor = rs.getPropertyValue('--componentSelectedBorderColor');
    selectedBackgroundColor = selectedBackgroundColor.charAt(0) === " " ? selectedBackgroundColor.slice(1) : selectedBackgroundColor;
    selectedBorderColor = selectedBorderColor.charAt(0) === " " ? selectedBorderColor.slice(1) : selectedBorderColor;
    borderColor = borderColor.charAt(0) === " " ? borderColor.slice(1) : borderColor;
    var backgroundColorPicker = createPicker(constantNames["configBox"]["componentColor"], selectedBackgroundColor, backgroundCallBack);
    var selectedBorderColorPicker = createPicker(constantNames["configBox"]["selectedBorder"], selectedBorderColor, selectedBorderCallBack);
    var borderColorPicker = createPicker(constantNames["configBox"]["borderColor"], borderColor, borderCallBack);

    backgroundColorPicker.style.float = "left";
    borderColorPicker.style.float = "left";
    selectedBorderColorPicker.style.float = "left";
    backgroundColorPicker.className += " item3";
    configGrid.appendChild(backgroundColorPicker);
    borderContainer = document.createElement('div');
    borderContainer.className = "formContainer";
    borderColorPicker.className += " item4";
    selectedBorderColorPicker.className += " item5";

    configGrid.appendChild(borderColorPicker);
    configGrid.appendChild(selectedBorderColorPicker);
    // box.appendChild(borderContainer);
    return;
}

function produceSliders(box, configGrid) {
    const borderSliderCallBack = (value) => { configStyle.handleChange('Component', "borderWidth", value + "px"); };
    const innerMarginXCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginX", value + "px");
        refreshAllLinks();

    };
    const innerMarginYCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginY", value + "px");
        refreshAllLinks();
    };

    const defaultBorderSliderValue = (parseInt(configStyle.getJSONValue("componentBorderWidth"))) ? parseInt(configStyle.getJSONValue("componentBorderWidth"), 10) : 2;
    var borderWidthSlider = getSliderGroup(constantNames["configBox"]["borderWidth"], 1, 10, defaultBorderSliderValue, borderSliderCallBack);
    borderWidthSlider.style.float = "right";
    borderWidthSlider.style.marginTop = "7px";
    // borderWidthSlider.style.marginLeft = "-5px";
    borderWidthSlider.firstChild.style.marginLeft = -72 + "px";
    borderWidthSlider.children[2].style.position = "absolute";

    var innerMarginDiv = document.createElement('div');
    var innerMarginX = getSliderGroup("Inner Margin X:", 1, 50, configStyle.getJSONValue("componentInnerMarginX").split("px")[0], innerMarginXCallBack);
    var innerMarginY = getSliderGroup("Inner Margin Y:", 1, 50, configStyle.getJSONValue("componentInnerMarginY").split("px")[0], innerMarginYCallBack);
    innerMarginY.style.width = innerMarginX.style.width = "140%";
    innerMarginY.style.display = innerMarginX.style.display = "inline-block";
    innerMarginX.style.float = innerMarginY.style.float = "left";
    innerMarginX.style.marginLeft = innerMarginY.style.marginLeft = "15px";
    innerMarginX.style.position = innerMarginY.style.position = "absolute";
    innerMarginX.style.left = innerMarginY.style.left = -259 + "px";
    innerMarginX.style.left = -265 + "px";
    innerMarginX.children[2].style.position = innerMarginY.children[2].style.position = "absolute";
    innerMarginY.style.top = 345 + "px";
    innerMarginDiv.id = "innerMarginSlider";
    innerMarginDiv.style.backgroundColor = "rgb(237,237,237)";
    innerMarginDiv.style.marginTop = "17px";
    innerMarginDiv.style.width = "100%";
    innerMarginDiv.style.height = "94px";
    innerMarginDiv.style.display = "none";
    innerMarginY.style.marginLeft = "8px";
    borderWidthSlider.style.width = 254 + "px";
    borderWidthSlider.className += " item6";
    configGrid.appendChild(borderWidthSlider);
    innerMarginDiv.appendChild(innerMarginX);
    innerMarginDiv.appendChild(innerMarginY);
    box.appendChild(innerMarginDiv);
    return;
}

function produceSwitches(box, configGrid) {

    var switcher = getSwitch("autofitSwitch", constantNames["configBox"]["autoFitLabel"]);
    switcher.className = "item9";
    switcher.style.position = "relative";
    switcher.firstChild.style.marginLeft = "0px";
    switcher.lastChild.style.left = "167px";
    configGrid.appendChild(switcher);
    return;
}

function produceSubcomponentSettings(box, configGrid) {
    const backgroundCallBack = (value) => { configStyle.handleChange('Subcomponent', "backgroundColor", value); };
    const textColorCallBack = (value) => { configStyle.handleChange('Subcomponent', "textColor", value); };
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var backgroundColor = rs.getPropertyValue('--subcomponentBackgroundColor');
    var textColor = rs.getPropertyValue('--subcomponentTextColor');

    backgroundColor = backgroundColor.charAt(0) === " " ? backgroundColor.slice(1) : backgroundColor;
    textColor = textColor.charAt(0) === " " ? textColor.slice(1) : textColor;
    var backgroundColorPicker = createPicker(constantNames["configBox"]["subcomponentColor"], backgroundColor, backgroundCallBack);
    var textColorPicker = createPicker(constantNames["configBox"]["subcomponentTextColor"], textColor, textColorCallBack);
    textColorPicker.style.width = backgroundColorPicker.style.width = "fit-content";
    textColorPicker.style.float = "left";

    backgroundColorPicker.style.float = "left";
    backgroundColorPicker.className += " item7";
    textColorPicker.className += " item8";
    configGrid.appendChild(backgroundColorPicker);
    configGrid.appendChild(textColorPicker);
    return;
}

function descriptionHandler() {
    var oldBRecs = {};
    const currentLayerId = layers.selectedLayer._id;
    if (document.getElementById("descriptionSwitch").checked) {
        document.getElementById("descArea").style.display = "inline-block";
        configStyle.descriptionEnabled = true;
        applyToEachComponent((component) => {
            oldBRecs[component._id] = (JSON.stringify(component.boundingRec));
            turnOnDescription(component);
            if (component.links)
                renderLine(component._id);
        });
        // refreshAllLinks();
        actions.saveCommand(enableDescriptionInAllComponents, disableDescriptionInAllComponents, oldBRecs, "");
    } else {
        document.getElementById("descArea").style.display = "none";
        configStyle.descriptionEnabled = false;
        applyToEachComponent((component) => {
            turnOffDescription(component);
        });
        actions.saveCommand(disableDescriptionInAllComponents, enableDescriptionInAllComponents, "", "");
        autoResizeAllComponents();
    }
    layers.changeLayer(currentLayerId);
}

function autoFitHandler() {
    configStyle.autoFit = document.getElementById("autofitSwitch").checked;
    if (document.getElementById("autofitSwitch").checked) {
        document.getElementById('innerMarginSlider').firstChild.children[1].value = configStyle.getJSONValue("componentInnerMarginX").split("px")[0];
        document.getElementById('innerMarginSlider').firstChild.children[2].innerText = configStyle.getJSONValue("componentInnerMarginX").split("px")[0] + "px";
        document.getElementById('innerMarginSlider').lastChild.children[1].value = configStyle.getJSONValue("componentInnerMarginY").split("px")[0];
        document.getElementById('innerMarginSlider').lastChild.children[2].innerText = configStyle.getJSONValue("componentInnerMarginY").split("px")[0] + "px";
        document.getElementById('innerMarginSlider').style.display = "inline-block";
        autoResizeAllComponents();

    } else {
        configStyle.setInitialMargins();
        autoResizeAllComponents();
        document.getElementById('innerMarginSlider').style.display = "none";
    }
}

function storeInitialSettings() {
    configStyle.actionDispatch["Component"].currentOldSettings = configStyle.actionDispatch["Component"].getCategoryInitialValue("Component");
    configStyle.actionDispatch["Description"].currentOldSettings = configStyle.actionDispatch["Description"].getCategoryInitialValue("Description");
    configStyle.actionDispatch["Subcomponent"].currentOldSettings = configStyle.actionDispatch["Subcomponent"].getCategoryInitialValue("Subcomponent");
    configStyle.actionDispatch["Component"].currentOldSettings["_oldRecs"] = getAllBoundingRectMap();
    configStyle.actionDispatch["Component"].currentOldSettings["_descOn"] = configStyle.descriptionEnabled;
    configStyle.actionDispatch["Component"].currentOldSettings["_autoFit"] = configStyle.autoFit;
    return;
}

function loadInitialSettings() {
    const oldBRecs = configStyle.actionDispatch["Component"].currentOldSettings["_oldRecs"];
    document.getElementById("descriptionSwitch").checked = configStyle.actionDispatch["Component"].currentOldSettings["_descOn"];
    document.getElementById("autofitSwitch").checked = configStyle.actionDispatch["Component"].currentOldSettings["_autoFit"];
    configStyle.descriptionEnabled = configStyle.actionDispatch["Component"].currentOldSettings["_descOn"];
    configStyle.autoFit = configStyle.actionDispatch["Component"].currentOldSettings["_autoFit"];
    descriptionHandler();
    autoFitHandler();
    setBoundingRectMap(oldBRecs);
    return;
}

function createComponentConfigBox() {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    var configGrid = document.createElement('div');
    configGrid.className = "configGrid";
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();

    };
    storeInitialSettings();
    var cancelChanges = () => {
        console.log(configStyle.actionDispatch["Component"].currentOldSettings);
        loadInitialSettings();
        closeBox();
        configStyle.actionDispatch["Description"].resetCurrentChanges();
        configStyle.actionDispatch["Subcomponent"].resetCurrentChanges();
        configStyle.actionDispatch["Component"].resetCurrentChanges();

        configStyle.actionDispatch["Component"].clearCurrentOldSettings();
        configStyle.actionDispatch["Description"].clearCurrentOldSettings();
        configStyle.actionDispatch["Subcomponent"].clearCurrentOldSettings();
        refreshAllLinks();
    }
    produceGrayLayer(box, "", "", cancelChanges);


    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelChanges;
    closeButton.style.position = "absolute";
    // closeButton.style.left = 680 + "px";
    produceMovingBar(box, 0);
    box.appendChild(closeButton);
    produceComponentForm(box, configGrid);
    produceComponentConfigBox(box, configGrid);
    produceSubcomponentSettings(box, configGrid);
    box.appendChild(configGrid);
    produceSwitches(box, configGrid);
    produceSliders(box, configGrid);


    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";
    cancelButton.innerHTML = constantNames["cancel"];
    cancelButton.onclick = cancelChanges;
    confirmationButton.className = "okButton unselectableText";
    confirmationButton.innerHTML = constantNames["apply"];
    confirmationButton.onclick = function() {
        configStyle.actionDispatch["Component"].clearCurrentOldSettings();
        configStyle.actionDispatch["Description"].clearCurrentOldSettings();
        configStyle.actionDispatch["Subcomponent"].clearCurrentOldSettings();
        closeBox();
    }
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = "relative"
    buttonsContainer.style.width = "100%";
    buttonsContainer.style.height = 40 + "px";
    buttonsContainer.style.display = "inline-block";
    var restoreButton = createRestoreButton("Component", closeBox, createComponentConfigBox);
    buttonsContainer.style.marginTop = 25 + "px";
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(restoreButton);
    buttonsContainer.appendChild(confirmationButton);
    descriptionArea(box);
    box.appendChild(buttonsContainer);

    document.getElementById('body').appendChild(box);
    addMotion(box);
    document.getElementById("autofitSwitch").addEventListener("change", () => {
        autoFitHandler();
    });
    document.getElementById("descriptionSwitch").addEventListener("change", () => {
        descriptionHandler();
    });
    if (configStyle.autoFit) {
        document.getElementById("autofitSwitch").checked = true;
        document.getElementById('innerMarginSlider').style.display = "inline-block";
    }
    if (configStyle.descriptionEnabled) {
        document.getElementById("descriptionSwitch").checked = true;
        document.getElementById('descArea').style.display = "inline-block";
    }

    document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.float = "left";
    document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginLeft = "80px";
    closeButton.style.left = box.getBoundingClientRect().width - 30 + "px";
    closeButton.style.top = 5 + "px";

    return;
}

export { produceComponentForm, createComponentConfigBox, produceComponentConfigBox, produceSliders, produceSwitches };