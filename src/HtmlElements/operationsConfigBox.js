import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { alterConstantValue } from "../config/functionStyle.js";
import { detectBrowser } from "../Workspace/browserDetection.js";
import { refreshOperationList, showAllRefresh } from "../Workspace/functionAppearance.js";
import { appendConfigDiv, createPicker, getSliderGroup, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";

function getFirstRowValues() {
    const operationColorValue = (configStyle.getJSONValue("operationColor")) ? configStyle.getJSONValue("operationColor") : "#FFFFFF";
    const operationBorderColorValue = (configStyle.getJSONValue("operationBorderColor")) ? configStyle.getJSONValue("operationBorderColor") : "#FFFFFF";
    const operationSelectedBorderColorValue = (configStyle.getJSONValue("operationSelectedBorderColor")) ? configStyle.getJSONValue("operationSelectedBorderColor") : "#0000FF";
    return [operationColorValue, operationBorderColorValue, operationSelectedBorderColorValue];
}

function getSecondRowValues() {
    const settedColorValue = (configStyle.getJSONValue("operationSettedColor")) ? configStyle.getJSONValue("operationSettedColor") : "#99ff00";
    const draggingColorValue = (configStyle.getJSONValue("operationDraggingColor")) ? configStyle.getJSONValue("operationDraggingColor") : "#009dff";
    return [settedColorValue, draggingColorValue];
}
var secondContainer;

function createFirstRowPickers(box, configGrid) {
    box.style.width = 760 + "px";
    var defaultValues = getFirstRowValues();
    var operationColorPicker = createPicker(constantNames["operationConfig"]["operationColor"], defaultValues[0], (value) => { configStyle.handleChange("Operation", "color", value); })
    var operationBorderPicker = createPicker(constantNames["operationConfig"]["operationBorder"], defaultValues[1], (value) => { configStyle.handleChange("Operation", "borderColor", value); });
    var selectedOperationBorderPicker = createPicker(constantNames["operationConfig"]["operationSelectedBorder"], defaultValues[2], (value) => { configStyle.handleChange("Operation", "selectedBorderColor", value); });
    operationColorPicker.style.float = "left";
    operationBorderPicker.style.float = "left";
    selectedOperationBorderPicker.style.float = "left";
    // operationBorderPicker.className += " item4";
    // selectedOperationBorderPicker.className += " item5";
    // operationColorPicker.className += " item3";
    if (detectBrowser() === "Firefox") {
        operationColorPicker.lastChild.style.float = "right";
        operationColorPicker.style.width = "193px";
    }

    // configGrid.appendChild(operationColorPicker);
    // configGrid.appendChild(operationBorderPicker);
    // configGrid.appendChild(selectedOperationBorderPicker);
    appendConfigDiv(operationColorPicker.firstChild, operationColorPicker.children[1], 1);
    appendConfigDiv(operationBorderPicker.firstChild, operationBorderPicker.children[1], 2);
    appendConfigDiv(selectedOperationBorderPicker.firstChild, selectedOperationBorderPicker.children[1], 2);

    selectedOperationBorderPicker.style.width = "191px";
    operationBorderPicker.style.width = "152px";
    // operationColorPicker.style.width = "193px";

    // configGrid.appendChild(createWidthSlider());
    return;
}

function createSecondRowPickers(box, configGrid) {
    var defaultValues = getSecondRowValues();

    var dragOperationPicker = createPicker(constantNames["operationConfig"]["draggingColor"], defaultValues[1], (value) => {
        const finalValue = (value.charAt(0) === " ") ? value.slice(1) : value;
        configStyle.handleChange("Operation", "draggingColor", finalValue);
        // alterConstantValue("ondrag", finalValue);
    });
    dragOperationPicker.style.float = "left";
    dragOperationPicker.className += " item6";
    dragOperationPicker.children[1].style.float = "left";

    // configGrid.appendChild(settedOperationPicker);
    // configGrid.appendChild(dragOperationPicker);
    appendConfigDiv(dragOperationPicker.firstChild, dragOperationPicker.children[1], 2);

    // dragOperationPicker.style.width = "193px";
}

function createWidthSlider() {
    var borderDefaultValue = (configStyle.getJSONValue("operationBorderWidth")) ? configStyle.getJSONValue("operationBorderWidth").split("px")[0] : 2;
    var borderSlider = getSliderGroup(constantNames["operationConfig"]["operationBorderWidth"], 1, 6, borderDefaultValue, (value) => {
        configStyle.handleChange("Operation", "borderWidth", value + "px");
        // refreshOperationList();
    });
    borderSlider.style.fontSize = "small";
    borderSlider.firstChild.style.marginLeft = "-123px";
    borderSlider.style.width = "345px";
    borderSlider.style.marginTop = "7px";
    borderSlider.style.float = "left";
    borderSlider.className += " item6";
    return borderSlider;
}

function createOperationColorPickers(box, configGrid) {
    createFirstRowPickers(box, configGrid);
    createSecondRowPickers(box, configGrid);

    return;
}
var textContainer;

function produceOperationForm(box, configGrid) {


    const callBack = (type, attributeChanged, value) => { configStyle.handleChange(type, attributeChanged, value) };
    var sizeStyleContainer = document.createElement('div');
    sizeStyleContainer.className = "formContainer";
    sizeStyleContainer.style.marginTop = 5 + "px";
    produceSizeForm(sizeStyleContainer, "Operation", callBack);
    produceStyleButtons(sizeStyleContainer, "Operation", callBack);
    produceFontFamilyForms(sizeStyleContainer, "Operation", callBack);
    sizeStyleContainer.lastChild.style.width = "351px";
    produceTextColor(configGrid, "Operation", callBack);

    box.appendChild(sizeStyleContainer);
    return;
}



export { createOperationColorPickers, produceOperationForm };