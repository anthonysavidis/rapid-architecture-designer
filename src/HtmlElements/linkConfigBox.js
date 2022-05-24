import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { createPicker, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { addMotion } from "../Input/movingModal.js";
import { createOperationColorPickers, produceOperationForm } from "../HtmlElements/operationsConfigBox.js";


function produceLinkForm(box) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');
    labelDiv.style.position = "";

    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.innerText = constantNames["configBox"]["link"];
    div.className = "formContainer";

    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.linkText.handleChange(type, attributeChanged, value) };
    produceSizeForm(div, "Link", callBack);
    produceStyleButtons(div, "Link", callBack);
    produceFontFamilyForms(div, "Link", callBack);
    produceTextColor(div, "Link", callBack);
    div.style.marginBottom = "30px";
    box.appendChild(div);
    return;
}


function createFirstRow(box) {
    const linkColorValue = (configStyle.getJSONValue("linkColor")) ? configStyle.getJSONValue("linkColor") : "#000000";
    const linkArrowColorValue = (configStyle.getJSONValue("linkArrowColor")) ? configStyle.getJSONValue("linkArrowColor") : "#000000";

    const linkColorPicker = createPicker(constantNames["linkConfig"]["linkColor"], linkColorValue, (value) => {
        configStyle.handleChange("Link", "color", value);
    });
    const linkArrowColorPicker = createPicker(constantNames["linkConfig"]["arrowColor"], linkArrowColorValue, (value) => {
        configStyle.handleChange("Link", "arrowColor", value);
    });
    var container = document.createElement("div");
    linkColorPicker.style.float = linkArrowColorPicker.style.float = "left";
    container.style.marginTop = "10px";
    container.style.width = "626.17px";
    container.style.float = "left";
    container.style.display = "inline-block";
    container.style.marginTop = "10px";
    container.style.marginLeft = "7px";
    container.appendChild(linkColorPicker);
    container.appendChild(linkArrowColorPicker);
    box.appendChild(container);
    return;
}


function createLinkConfigBox(box) {
    createFirstRow(box);
    return;

}

function produceAConfigBox(type) {
    var box = document.createElement('div');
    box.className = 'configurationBox';

    produceGrayLayer(box, "", "", "");
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    };

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = closeBox;
    closeButton.style.position = "absolute";
    closeButton.style.left = 720 + "px";
    produceMovingBar(box, 0);
    box.appendChild(closeButton);
    if (type === "Operation") {
        produceOperationForm(box);
        createOperationColorPickers(box);
    } else {
        produceLinkForm(box);
        createLinkConfigBox(box);
        closeButton.style.left = 685 + "px";
        closeButton.style.top = 10 + "px";
    }
    var closeButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    closeButton.className = "cancelButton";
    closeButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["close"] + "</p>";
    closeButton.onclick = closeBox;
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["ok"] + "</p>";
    confirmationButton.onclick = function() {
        closeBox();
    }
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = "relative"
    buttonsContainer.style.width = "100%";
    buttonsContainer.style.height = 40 + "px";
    buttonsContainer.style.display = "inline-block";

    buttonsContainer.style.marginTop = 25 + "px";
    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(confirmationButton);
    box.appendChild(buttonsContainer);
    document.getElementById('body').appendChild(box);
    addMotion(box);
    return;
}

export { createLinkConfigBox, produceLinkForm, produceAConfigBox };