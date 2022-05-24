import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { alterConstantValue } from "../config/functionStyle.js";
import { showAllRefresh } from "../Workspace/functionAppearance.js";
import { createPicker, getSliderGroup, produceFontFamilyForms, produceSizeForm, produceStyleButtons, produceTextColor } from "./configBox.js";

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

function createFirstRowPickers(box) {
    box.style.width = 760 + "px";
    var defaultValues = getFirstRowValues();
    var operationColorPicker = createPicker(constantNames["operationConfig"]["operationColor"], defaultValues[0], (value) => { configStyle.handleChange("Operation", "color", value); })
    var operationBorderPicker = createPicker(constantNames["operationConfig"]["operationBorder"], defaultValues[1], (value) => { configStyle.handleChange("Operation", "borderColor", value); });
    var selectedOperationBorderPicker = createPicker(constantNames["operationConfig"]["operationSelectedBorder"], defaultValues[2], (value) => { configStyle.handleChange("Operation", "selectedBorderColor", value); });
    operationColorPicker.style.float = "left";
    operationBorderPicker.style.float = "left";
    selectedOperationBorderPicker.style.float = "right";
    selectedOperationBorderPicker.style.marginRight = "40px";
    var container = document.createElement('div');
    container.appendChild(operationColorPicker);
    container.appendChild(operationBorderPicker);
    container.appendChild(selectedOperationBorderPicker);
    container.style.width = "97%";
    container.style.height = "fit-content";
    container.style.display = "inline-block";
    container.style.marginTop = "30px";
    box.appendChild(container);
    return;
}

function createSecondRowPickers(box) {
    var defaultValues = getSecondRowValues();
    var settedOperationPicker = createPicker(constantNames["operationConfig"]["attachedColor"], defaultValues[0], (value) => {
        const finalValue = (value.charAt(0) === " ") ? value.slice(1) : value;
        configStyle.handleChange("Operation", "settedColor", finalValue);
        alterConstantValue("attached", finalValue);
        if (document.getElementById("all").checked)
            showAllRefresh();
    });
    var dragOperationPicker = createPicker(constantNames["operationConfig"]["draggingColor"], defaultValues[1], (value) => {
        const finalValue = (value.charAt(0) === " ") ? value.slice(1) : value;
        configStyle.handleChange("Operation", "draggingColor", finalValue);
        alterConstantValue("ondrag", finalValue);
    });
    var container = document.createElement('div');
    settedOperationPicker.style.float = "left";
    dragOperationPicker.style.float = "right";
    dragOperationPicker.style.marginRight = "40px";

    container.appendChild(settedOperationPicker);
    container.appendChild(dragOperationPicker);
    container.style.width = "97%";
    container.style.float = "left";
    container.style.display = "inline-block";
    container.style.marginTop = "10px";
    container.style.marginLeft = "7px";
    box.appendChild(container);
}

function createThirdRow(box) {
    var borderDefaultValue = (configStyle.getJSONValue("operationBorderWidth")) ? configStyle.getJSONValue("operationBorderWidth").split("px")[0] : 2;
    var borderSlider = getSliderGroup(constantNames["operationConfig"]["operationBorderWidth"], 1, 8, borderDefaultValue, (value) => {
        configStyle.handleChange("Operation", "borderWidth", value + "px");
    });
    borderSlider.style.marginLeft = "2px";
    borderSlider.style.marginTop = "20px";
    borderSlider.style.float = "left";
    box.appendChild(borderSlider);
    return;
}

function createOperationColorPickers(box) {
    // createFirstRowPickers(box);
    createFirstRowPickers(box);
    createSecondRowPickers(box);
    createThirdRow(box);
    return;
}

function produceOperationForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.style.position = "relative";
    labelDiv.innerText = constantNames["configBox"]["operation"];

    var div = document.createElement('div');
    div.className = "formContainer";
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.operationsText.handleChange(type, attributeChanged, value) };
    produceSizeForm(div, "Operation", callBack);
    produceStyleButtons(div, "Operation", callBack);
    produceFontFamilyForms(div, "Operation", callBack);
    produceTextColor(div, "Operation", callBack);
    box.appendChild(div);
    return;
}



export { createOperationColorPickers, produceOperationForm };