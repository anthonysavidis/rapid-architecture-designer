import { configStyle } from "../Classes/Config.js";
import { applyToEachComponent, getAllBoundingRectMap, refreshAllLinks, setBoundingRectMap } from "../Classes/LayerHolder.js";
import { autoResizeAllComponents } from "../Item/autoResize.js";
import { appendConfigDiv, appendConfigWithSwitch, createConfigTableDiv, createPicker, createRestoreButton, createSliderRows, getSliderGroup, getSwitch, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";
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
import { detectBrowser } from "../Workspace/browserDetection.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";


function produceComponentForm(box, table) {
    // var labelDiv = document.createElement('div');
    // labelDiv.style.position = "";
    // labelDiv.className = "tittleDiv unselectableText";
    // labelDiv.innerText = constantNames["configBox"]["component"];;

    var div = document.createElement('div');
    // div.className = "formContainer";
    const callBack = (type, attributeChanged, value) => { configStyle.handleChange(type, attributeChanged, value); }
    var sizeStyleContainer = document.createElement('div');
    sizeStyleContainer.className = "formContainer";
    sizeStyleContainer.style.marginTop = 5 + "px";
    sizeStyleContainer.style.justifyContent = "center";
    sizeStyleContainer.style.display = "flex";

    sizeStyleContainer.style.marginBottom = 5 + "px";
    produceSizeForm(sizeStyleContainer, "Component", callBack);
    produceStyleButtons(sizeStyleContainer, "Component", callBack);
    const familyFont = produceFontFamilyForms(sizeStyleContainer, "Component", callBack);
    produceTextColor("Component", callBack);
    familyFont.style.width = "200px";

    box.insertBefore(div, table);
    box.insertBefore(sizeStyleContainer, table);

    // sizeStyleContainer.style.marginLeft = "36px";
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
    // if (detectBrowser() === "Firefox")
    //     backgroundColorPicker.style.width = "195px";
    // else
    //     backgroundColorPicker.style.width = "211px";
    // backgroundColorPicker.lastChild.style.float = "right";
    backgroundColorPicker.lastChild.style.marginLeft = "0px";
    // configGrid.appendChild(backgroundColorPicker);
    appendConfigDiv(backgroundColorPicker.firstChild, backgroundColorPicker.children[1], 1)

    // borderContainer = document.createElement('div');
    // borderContainer.className = "formContainer";
    // borderColorPicker.className += " item4";
    // selectedBorderColorPicker.className += " item5";

    // configGrid.appendChild(borderColorPicker);
    // configGrid.appendChild(selectedBorderColorPicker);
    appendConfigDiv(borderColorPicker.firstChild, borderColorPicker.children[1], 2);
    appendConfigDiv(selectedBorderColorPicker.firstChild, selectedBorderColorPicker.children[1], 2);
    // box.appendChild(borderContainer);
    return;
}

function produceSliders(box, configGrid) {
    const borderSliderCallBack = (value) => {
        configStyle.handleChange('Component', "borderWidth", value + "px");
        document.getElementById("widthSliderBorderValue").innerText = value + "px";
    };
    const innerMarginXCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginX", value + "px");
        // refreshAllLinks();

    };
    const innerMarginYCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginY", value + "px");
        // refreshAllLinks();
    };

    const defaultBorderSliderValue = (parseInt(configStyle.getJSONValue("componentBorderWidth"))) ? parseInt(configStyle.getJSONValue("componentBorderWidth"), 10) : 2;
    var borderWidthSlider = getSliderGroup(constantNames["configBox"]["borderWidth"], 1, 10, defaultBorderSliderValue, borderSliderCallBack);

    borderWidthSlider.children[1].style.width = "96px";
    borderWidthSlider.children[1].style.margin = "0";

    var innerMarginDiv = document.createElement('div');
    var innerMarginX = getSliderGroup("Inner Margin X:", 1, 50, configStyle.getJSONValue("componentInnerMarginX").split("px")[0], innerMarginXCallBack);
    var innerMarginY = getSliderGroup("Inner Margin Y:", 1, 50, configStyle.getJSONValue("componentInnerMarginY").split("px")[0], innerMarginYCallBack);
    innerMarginX.style.width = innerMarginY.style.width = "auto";
    innerMarginX.style.float = "left";
    innerMarginY.style.float = "right";
    innerMarginX.style.marginRight = "50px";
    innerMarginX.style.marginTop = innerMarginY.style.marginTop = "0px";
    innerMarginX.style.marginLeft = "17px";
    innerMarginX.style.fontSize = innerMarginY.style.fontSize = "small";
    innerMarginX.children[1].className = innerMarginY.children[1].className = "zoomRangeInput";
    innerMarginDiv.id = "innerMarginSlider";
    innerMarginDiv.style.backgroundColor = "rgb(237,237,237)";
    innerMarginDiv.style.paddingTop = innerMarginDiv.style.paddingBottom = "10px";
    innerMarginDiv.style.width = "100%";
    innerMarginDiv.style.display = "none";
    // innerMarginY.style.marginLeft = "8px";
    createSliderRows(borderWidthSlider, defaultBorderSliderValue, 2, "widthSliderBorderValue");
    innerMarginDiv.appendChild(innerMarginX);
    innerMarginDiv.appendChild(innerMarginY);
    box.appendChild(innerMarginDiv);
    innerMarginX.children[1].style.paddingBottom = innerMarginY.children[1].style.paddingBottom = "2px";
    return;
}

function produceSwitches(box, configGrid) {

    var switcher = getSwitch("autofitSwitch", constantNames["configBox"]["autoFitLabel"]);
    switcher.className = "labelDiv unselectableText item9";
    switcher.style.position = "relative";
    switcher.firstChild.style.marginLeft = "0px";
    switcher.firstChild.style.marginTop = "0px";
    if (detectBrowser() === "Firefox")
        switcher.lastChild.style.left = "140px";
    else
        switcher.lastChild.style.left = "153.5px";
    switcher.lastChild.style.top = "-7px";
    const label = document.createElement('div');
    label.style.float = "left";
    label.innerText = constantNames["configBox"]["autoFitLabel"];
    // appendConfigDiv(label, switcher, 3);
    switcher.lastChild.style.left = "202.5px";
    appendConfigWithSwitch(switcher, 3);
    console.log(switcher.firstChild);
    console.log(switcher.lastChild);
    // configGrid.appendChild(switcher);
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
    textColorPicker.style.float = "left";


    backgroundColorPicker.style.float = "left";
    backgroundColorPicker.className += " item7";
    textColorPicker.className += " item8";

    appendConfigDiv(backgroundColorPicker.firstChild, backgroundColorPicker.children[1], 3);
    appendConfigDiv(textColorPicker.firstChild, textColorPicker.children[1], 3);

    // configGrid.appendChild(backgroundColorPicker);

    // configGrid.appendChild(textColorPicker);
    return;
}

function descriptionHandler(noActionSave) {
    var oldBRecs = {};
    const currentLayerId = layers.selectedLayer._id;
    configStyle.descriptionEnabled = document.getElementById("descriptionSwitch").checked;
    if (document.getElementById("descriptionSwitch").checked) {
        document.getElementById("descArea").style.display = "inline-block";
        configStyle.descriptionEnabled = true;
        applyToEachComponent((component) => {
            oldBRecs[component._id] = InstanceGenerator.getNodeBoundingRect(component._id);
            // console.log(oldBRecs[component._id]);
            turnOnDescription(component);
        });
        // refreshAllLinks();
        if (!noActionSave)
            actions.saveCommand(enableDescriptionInAllComponents, disableDescriptionInAllComponents, oldBRecs, "");
    } else {
        document.getElementById("descArea").style.display = "none";
        configStyle.descriptionEnabled = false;
        applyToEachComponent((component) => {
            turnOffDescription(component);
        });
        if (!noActionSave)
            actions.saveCommand(disableDescriptionInAllComponents, enableDescriptionInAllComponents, "", "");
        // autoResizeAllComponents();
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
        document.getElementById('innerMarginSlider').style.display = "flex";
        autoResizeAllComponents();

    } else {
        configStyle.setInitialMargins();
        autoResizeAllComponents();
        document.getElementById('innerMarginSlider').style.display = "none";
    }
    return;
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
    descriptionHandler(true); //call me flag i opoia simainei oti den tha ginei save sto action stack.
    //autoFitHandler(); //TODO AUTOFIT
    setBoundingRectMap(oldBRecs);
    return;
}



function createComponentFields(box, configGrid) {
    box.appendChild(configGrid);
    // produceComponentForm(box, configGrid);
    produceComponentConfigBox(box, configGrid);
    produceSubcomponentSettings(box, configGrid);
    produceSwitches(box, configGrid);
    produceSliders(box, configGrid);
    descriptionArea(box);

    return;
}

function addApplyCancelButtons(box, cancelChanges, closeBox, createComponentConfigBox) {

    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";
    cancelButton.innerHTML = constantNames["cancel"];
    cancelButton.onclick = cancelChanges;
    confirmationButton.className = "okButton unselectableText";
    confirmationButton.style.marginRight = "20px";
    confirmationButton.innerHTML = constantNames["apply"];
    confirmationButton.onclick = function () {
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
    var restoreButton = createRestoreButton("Component", closeBox, createComponentConfigBox, cancelChanges);
    buttonsContainer.style.marginTop = 25 + "px";
    cancelButton.style.float = restoreButton.style.float = confirmationButton.style.float = "right";
    restoreButton.style.marginLeft = confirmationButton.style.marginLeft = "10px";
    buttonsContainer.appendChild(confirmationButton);
    buttonsContainer.appendChild(restoreButton);
    buttonsContainer.appendChild(cancelButton);
    box.appendChild(buttonsContainer);
    return;
}

var refreshComponentConfigContents;

function createComponentConfigBox(refresh) {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    var configGrid = document.createElement('div');
    configGrid.className = "configGrid";
    // configGrid =

    document.getElementById('body').appendChild(box);

    var closeBox = function () {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();

    };

    if (!refresh)
        storeInitialSettings();
    var cancelChanges = () => {
        loadInitialSettings();
        closeBox();
        console.log("--------------------------------------");

        console.log(configStyle.actionDispatch["Component"].currentOldSettings);
        console.log("--------------------------------------");
        configStyle.actionDispatch["Description"].resetCurrentChanges();
        configStyle.actionDispatch["Subcomponent"].resetCurrentChanges();
        configStyle.actionDispatch["Component"].resetCurrentChanges();

        configStyle.actionDispatch["Component"].clearCurrentOldSettings();
        configStyle.actionDispatch["Description"].clearCurrentOldSettings();
        configStyle.actionDispatch["Subcomponent"].clearCurrentOldSettings();
        // refreshAllLinks();
        console.log(configStyle.configJSON);

    }
    produceGrayLayer(box, "", "", cancelChanges);


    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelChanges;
    closeButton.style.width = closeButton.style.height = "12px";
    closeButton.style.float = "right";
    closeButton.style.backgroundImage = 'url("../images/whiteCloseInfo.png")';

    var bar = produceMovingBar(box, 0);
    bar.innerText = constantNames["configBox"]["component"];
    bar.appendChild(closeButton);
    const table = createConfigTableDiv();
    table.style.display = "flex";
    table.style.justifyContent = "center";
    box.appendChild(table);
    produceComponentForm(box, table);

    var fields = document.createElement('div');
    configGrid.style.marginLeft = "61px";

    createComponentFields(fields, configGrid);
    box.append(fields);
    refreshComponentConfigContents = () => {
        for (var i = 0; i < fields.childNodes.length; i++)
            fields.childNodes[i].remove();
        createComponentFields(fields, configGrid);

    }


    addApplyCancelButtons(box, cancelChanges, closeBox, createComponentConfigBox);
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

    // document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.float = "right";
    // document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginLeft = "80px";
    closeButton.style.left = box.getBoundingClientRect().width - 30 + "px";
    closeButton.style.top = 5 + "px";
    // for (var i = 1; i <= 9; i++) {
    //     document.getElementsByClassName("labelDiv unselectableText item" + i)[0].style.fontSize = "small";
    // }
    // labelDiv.style.fontSize = "small";
    // configGrid.style.gap = "16px";
    document.getElementsByClassName("configGrid")[0].remove();
    return;
}

export { produceComponentForm, createComponentConfigBox, refreshComponentConfigContents, produceComponentConfigBox, produceSliders, produceSwitches };