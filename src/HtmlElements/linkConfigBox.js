import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { createPicker, createRestoreButton, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { addMotion } from "../Input/movingModal.js";
import { createOperationColorPickers, produceOperationForm } from "../HtmlElements/operationsConfigBox.js";
import { alterConstantValue } from "../config/functionStyle.js";
import { refreshOperationList } from "../Workspace/functionAppearance.js";

var textContainer;

function produceLinkForm(box, configGrid) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');
    labelDiv.style.position = "";

    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.style.marginLeft = "0px";
    labelDiv.style.textAlign = "center";
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
    sizeStyleContainer.lastChild.style.width = "363px";

    produceTextColor(configGrid, "Link", callBack);
    sizeStyleContainer.style.marginLeft = "11px";
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

function storeInitialSettings(type) {
    configStyle.actionDispatch[type].currentOldSettings = configStyle.actionDispatch[type].getCategoryInitialValue(type);
    console.log(configStyle.actionDispatch[type].currentOldSettings);
    return;
}

function loadInitialSettings(type) {
    configStyle.actionDispatch[type].resetCurrentChanges();
    configStyle.actionDispatch[type].clearCurrentOldSettings();
    if (type === "Operation") {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const attachedValue = rs.getPropertyValue('--operationSettedColor');
        const draggedValue = rs.getPropertyValue('--operationDraggingColor');
        console.log(attachedValue + " " + draggedValue);
        // alterConstantValue("attached", attachedValue);
        // alterConstantValue("ondrag", draggedValue);
        refreshOperationList();
    }
    return;
}

function produceAConfigBox(type, refresh) {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    };
    if (!refresh)
        storeInitialSettings(type);
    var cancelChanges = function() {
        loadInitialSettings(type);
        closeBox();
    };

    produceGrayLayer(box, "", "", cancelChanges);

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelChanges;
    closeButton.style.position = "absolute";

    produceMovingBar(box, 0);
    var configGrid = document.createElement('div');
    configGrid.className = "configGrid";
    configGrid.style.gap = "25px";
    box.appendChild(closeButton);
    if (type === "Operation") {
        produceOperationForm(box, configGrid);
        createOperationColorPickers(box, configGrid);
        configStyle.actionDispatch["Operation"].currentOldSettings = configStyle.actionDispatch["Operation"].getCategoryInitialValue("Operation");

    } else {
        produceLinkForm(box, configGrid);
        createLinkConfigBox(box, configGrid);
        configStyle.actionDispatch["Link"].currentOldSettings = configStyle.actionDispatch["Link"].getCategoryInitialValue("Link");
        // closeButton.style.left = 685 + "px";
        // closeButton.style.top = 10 + "px";
    }
    box.appendChild(configGrid);


    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectable";
    cancelButton.innerHTML = constantNames["cancel"];
    cancelButton.onclick = cancelChanges;
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = constantNames["apply"];
    confirmationButton.onclick = function() {
        if (type === "Operation") {
            configStyle.actionDispatch["Operation"].clearCurrentOldSettings();
        } else if (type === "Link") {
            configStyle.actionDispatch["Link"].clearCurrentOldSettings();
        }
        closeBox();
    }
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = "relative"
    buttonsContainer.style.width = "100%";
    buttonsContainer.style.height = 40 + "px";
    buttonsContainer.style.display = "inline-block";
    var restoreButton = createRestoreButton(type, closeBox, () => { produceAConfigBox(type, true); });

    buttonsContainer.style.marginTop = confirmationButton.style.marginLeft = 25 + "px";
    cancelButton.style.float = restoreButton.style.float = confirmationButton.style.float = "right";

    buttonsContainer.appendChild(confirmationButton);
    buttonsContainer.appendChild(restoreButton);
    buttonsContainer.appendChild(cancelButton);
    box.appendChild(buttonsContainer);
    document.getElementById('body').appendChild(box);
    addMotion(box);
    if (type === "Operation") {
        configGrid.style.marginLeft = "64px";
        document.getElementsByClassName("labelDiv unselectableText item1")[0].style.width = "155px";
        document.getElementsByClassName("labelDiv unselectableText item2")[0].style.width = "191px";
        // document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginLeft = "105px";
        document.getElementsByClassName("labelDiv unselectableText item3")[0].style.width = "228px";
    } else if (type === "Link") {
        document.getElementsByClassName("labelDiv unselectableText item3")[0].lastChild.style.marginRight = "31px";
        document.getElementsByClassName("labelDiv unselectableText item1")[0].style.width = "90%";
        document.getElementsByClassName("labelDiv unselectableText item2")[0].style.width = "90%";
        document.getElementsByClassName("labelDiv unselectableText item4")[0].style.width = "90%";

    }
    for (var i = 1; i <= 8; i++) {
        if (document.getElementsByClassName("labelDiv unselectableText item" + i)[0]) {
            document.getElementsByClassName("labelDiv unselectableText item" + i)[0].style.fontSize = "small";
            console.log(document.getElementsByClassName("labelDiv unselectableText item" + i)[0]);
        }
    }
    closeButton.style.left = box.getBoundingClientRect().width - 30 + "px";
    closeButton.style.top = 5 + "px";
    return;
}

export { createLinkConfigBox, produceLinkForm, produceAConfigBox };