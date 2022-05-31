import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { createPicker, createRestoreButton, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { addMotion } from "../Input/movingModal.js";
import { createOperationColorPickers, produceOperationForm } from "../HtmlElements/operationsConfigBox.js";

var textContainer;

function produceLinkForm(box, configGrid) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');
    labelDiv.style.position = "";

    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.innerText = constantNames["configBox"]["link"];
    div.className = "formContainer";

    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.handleChange(type, attributeChanged, value); };
    var sizeStyleContainer = document.createElement('div');
    sizeStyleContainer.className = "formContainer";
    sizeStyleContainer.style.marginTop = 5 + "px";
    produceSizeForm(sizeStyleContainer, "Link", callBack);
    produceStyleButtons(sizeStyleContainer, "Link", callBack);
    produceFontFamilyForms(sizeStyleContainer, "Link", callBack);
    produceTextColor(configGrid, "Link", callBack);
    box.appendChild(div);
    box.appendChild(sizeStyleContainer);
    return;
}


function createFirstRow(box, configGrid) {
    const linkColorValue = (configStyle.getJSONValue("linkColor")) ? configStyle.getJSONValue("linkColor") : "#000000";
    const linkArrowColorValue = (configStyle.getJSONValue("linkArrowColor")) ? configStyle.getJSONValue("linkArrowColor") : "#000000";

    const linkColorPicker = createPicker(constantNames["linkConfig"]["linkColor"], linkColorValue, (value) => {
        configStyle.handleChange("Link", "color", value);
    });
    const linkArrowColorPicker = createPicker(constantNames["linkConfig"]["arrowColor"], linkArrowColorValue, (value) => {
        configStyle.handleChange("Link", "arrowColor", value);
    });
    linkColorPicker.style.float = linkArrowColorPicker.style.float = "left";
    linkColorPicker.className += " item3";
    linkArrowColorPicker.className += " item4";
    configGrid.appendChild(linkColorPicker);
    configGrid.appendChild(linkArrowColorPicker);
    return;
}

function createLinkConfigBox(box, configGrid) {
    createFirstRow(box, configGrid);
    return;
}

function produceAConfigBox(type) {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    };
    var cancelChanges = function() {
        closeBox();
        configStyle.actionDispatch[type].resetCurrentChanges();
        configStyle.actionDispatch[type].clearCurrenntOldSettings();
    };

    produceGrayLayer(box, "", cancelChanges, "");

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelChanges;
    closeButton.style.position = "absolute";
    closeButton.style.left = 720 + "px";
    produceMovingBar(box, 0);
    var configGrid = document.createElement('div');
    configGrid.className = "configGrid";
    configGrid.style.gap = "25px";
    box.appendChild(closeButton);
    if (type === "Operation") {
        produceOperationForm(box, configGrid);
        createOperationColorPickers(box, configGrid);
    } else {
        produceLinkForm(box, configGrid);
        createLinkConfigBox(box, configGrid);
        closeButton.style.left = 685 + "px";
        closeButton.style.top = 10 + "px";
    }
    box.appendChild(configGrid);
    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelButton";
    cancelButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["cancel"] + "</p>";
    cancelButton.onclick = cancelChanges;
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["apply"] + "</p>";
    confirmationButton.onclick = function() {
        closeBox();
    }
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = "relative"
    buttonsContainer.style.width = "100%";
    buttonsContainer.style.height = 40 + "px";
    buttonsContainer.style.display = "inline-block";
    var restoreButton = createRestoreButton(type, closeBox, () => { produceAConfigBox(type); });

    buttonsContainer.style.marginTop = 25 + "px";

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(restoreButton);
    buttonsContainer.appendChild(confirmationButton);
    box.appendChild(buttonsContainer);
    document.getElementById('body').appendChild(box);
    addMotion(box);
    if (type === "Operation") {
        document.getElementsByClassName("labelDiv unselectableText item1")[0].style.width = "191px";
        document.getElementsByClassName("labelDiv unselectableText item2")[0].style.width = "191px";
        document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginLeft = "105px";
        document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.float = "left";
    } else if (type === "Link") {
        document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginRight = "31px";
        document.getElementsByClassName("labelDiv unselectableText item1")[0].style.width = "90%";
        document.getElementsByClassName("labelDiv unselectableText item2")[0].style.width = "90%";
        document.getElementsByClassName("labelDiv unselectableText item4")[0].style.width = "90%";

    }
    return;
}

export { createLinkConfigBox, produceLinkForm, produceAConfigBox };