import { configStyle } from "../Classes/Config.js";
import { refreshAllLinks } from "../Classes/LayerHolder.js";
import { capitalizeFirstLetter } from "../Classes/TextConfig.js";
import { constantNames } from "../config/constantNames.js";
import { autoResizeAutoFit, autoResizeAllComponents } from "../Item/autoResize.js";

function produceSizeForm(box, className, callBack) {
    var select = document.createElement('select');
    select.style.width = "150px";
    select.style.display = "inline-block";

    select.style.marginLeft = "30px";
    select.style.float = "left";
    var selectStr = "";
    for (var i = 4; i <= 24; i += 2) {
        selectStr += "<option value=\"" + i + "pt\">" + i + "pt" + "</option>"
    }
    select.innerHTML = selectStr;
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const rsValue = rs.getPropertyValue('--' + className.toLowerCase() + 'TextSize');
    select.value = rsValue.charAt(0) === " " ? rsValue.slice(1) : rsValue;
    // (!select.value) ? select.value = "medium" : 1;
    select.addEventListener("change", function() {
        callBack(className, 'textSize', select.value);
    })
    box.appendChild(select);
}


function produceFontFamilyForms(box, className, callBack) {
    var select = document.createElement('select');
    select.style.float = "right";
    select.style.width = "350px";
    select.style.display = "inline-block";
    select.style.marginRight = "25px";
    select.style.marginLeft = "5px";
    select.innerHTML = ' <option value=\"Georgia\">Georgia</option>   \
  <option value=\"Palatino\">Palatino Linotype</option>\
  <option value=\"Book Antiqua\">Book Antiqua</option>\
  <option value=\"Times New Roman\">Times New Roman</option>\
  <option value=\"Arial\">Arial</option>\
  <option value=\"Arial, Helvetica, sans-serif\"selected>Arial, Helvetica, sans-serif</option>\
  <option value=\"Helvetica\">Helvetica</option>\
  <option value=\"Arial Black\">Arial Black</option>\
  <option value=\"Impact\">Impact</option>\
  <option value=\"Lucida Sans Unicode\">Lucida Sans Unicode</option>\
  <option value=\"Tahoma\">Tahoma</option>\
  <option value=\"Verdana\">Verdana</option>\
  <option value=\"Courier New\">Courier New</option>\
  <option value=\"Lucida Console\">Lucida Console</option>';
    select.addEventListener("change", function() {
        callBack(className, 'textFamily', select.value);
    });
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    select.value = rs.getPropertyValue('--' + className.toLowerCase() + 'TextFamily');
    (!select.value) ? select.value = "Arial, Helvetica, sans-serif": 1;

    box.appendChild(select);
}

function produceStyleButtons(box, className, callBack) {
    var boldButton = document.createElement('div');
    var italicButton = document.createElement('div');
    var underlinedButton = document.createElement('div');
    boldButton.className = italicButton.className = underlinedButton.className = "styleButton";
    boldButton.innerText = "B";
    boldButton.style.fontWeight = "bold";
    boldButton.addEventListener("click", function() {
        if (boldButton.className === "styleButton") {
            callBack(className, 'fontWeight', "bold");
            boldButton.className = "styleButtonPressed";
        } else {
            callBack(className, 'fontWeight', "normal");
            boldButton.className = "styleButton";
        }
    })
    italicButton.innerText = "I";
    italicButton.style.fontStyle = "italic";
    italicButton.addEventListener("click", function() {
        if (italicButton.className === "styleButton") {
            callBack(className, 'fontStyle', "italic");
            italicButton.className = "styleButtonPressed";
        } else {
            callBack(className, 'fontStyle', "normal");
            italicButton.className = "styleButton";
        }
    })
    underlinedButton.innerText = "U";
    underlinedButton.style.textDecoration = "underline";
    underlinedButton.addEventListener("click", function() {
        if (underlinedButton.className === "styleButton") {
            callBack(className, 'textDecoration', "underline");
            underlinedButton.className = "styleButtonPressed";
        } else {
            callBack(className, 'textDecoration', "none");
            underlinedButton.className = "styleButton";
        }
    })
    var div = document.createElement('div');
    div.className = "styleButtonsContainer";
    div.appendChild(boldButton);
    div.appendChild(italicButton);
    div.appendChild(underlinedButton);
    box.appendChild(div);
    return;
}

function createPicker(txt, selected, callBack) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "labelDiv unselectableText";

    labelDiv.innerText = txt;
    var picker = document.createElement('input');
    picker.type = "color";
    picker.addEventListener("change", function() {
        callBack(picker.value);
    })
    picker.style.display = "inline-block";
    picker.style.marginLeft = "10px";
    picker.value = selected.charAt(0) === " " ? selected.slice(1) : selected;
    // picker.value= rs.getPropertyValue('--' + className.toLowerCase() + capitalizeFirstLetter(selected));
    labelDiv.appendChild(picker);
    // picker.defaultValue = rs.getPropertyValue('--' + className.toLowerCase() + capitalizeFirstLetter(selected));
    return labelDiv;
}

function getTransparentCheckBox(label, callBack) {
    // <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
    /* <label for="vehicle1"> I have a bike</label><br></br> */
}

function produceTextColor(box, className, callBack) {


    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const selectedColor = rs.getPropertyValue('--' + className.toLowerCase() + "TextColor");
    const selectedBackgroundColor = rs.getPropertyValue('--' + className.toLowerCase() + "TextBackgroundColor");

    const textCallBack = (value) => { callBack(className, "textColor", value); };
    const textBackgroundCallBack = (value) => { callBack(className, "textBackgroundColor", value); };

    console.log(selectedColor + "," + selectedBackgroundColor);
    var textColor = createPicker(constantNames["configBox"]["textColor"], selectedColor, textCallBack);
    var backgroundColor = createPicker(constantNames["configBox"]["backgroundColor"], selectedBackgroundColor, textBackgroundCallBack);
    textColor.style.float = "left";

    box.appendChild(textColor);
    backgroundColor.style.float = "right";
    backgroundColor.style.marginRight = "186px";

    box.appendChild(backgroundColor);
    // box.appendChild(picker);
    return;
}
//----------------------============================================================================================================----------------------------------------------------------------------

function produceComponentForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.innerText = constantNames["configBox"]["component"];;
    var div = document.createElement('div');
    div.className = "formContainer";
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.componentsText.handleChange(type, attributeChanged, value); }
    produceSizeForm(div, "Component", callBack);
    produceStyleButtons(div, "Component", callBack);
    produceFontFamilyForms(div, "Component", callBack);
    produceTextColor(div, "Component", callBack);
    box.appendChild(div);
    return;
}


function produceOperationForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "tittleDiv unselectableText";
    labelDiv.style.position = "relative";
    labelDiv.innerText = constantNames["configBox"]["operation"];
    labelDiv.style.marginTop = "10px";

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

//----------------------============================================================================================================----------------------------------------------------------------------
function produceComponentConfigBox(box) {

    const backgroundCallBack = (value) => { configStyle.handleChange('Component', "backgroundColor", value); };
    const borderCallBack = (value) => { configStyle.handleChange('Component', "borderColor", value); };
    const selectedBorderCallBack = (value) => { configStyle.handleChange('Component', "selectedBorderColor", value); };
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var selectedBackgroundColor = rs.getPropertyValue('--componentBackgroundColor');
    var borderColor = rs.getPropertyValue('--componentBorderColor');
    var selectedBorderColor = rs.getPropertyValue('--componentSelectedBorderColor');
    console.log(borderColor.slice(1) + "," + selectedBackgroundColor.slice(1) + "," + selectedBorderColor.slice(1));
    selectedBackgroundColor = selectedBackgroundColor.charAt(0) === " " ? selectedBackgroundColor.slice(1) : selectedBackgroundColor;
    selectedBorderColor = selectedBorderColor.charAt(0) === " " ? selectedBorderColor.slice(1) : selectedBorderColor;
    borderColor = borderColor.charAt(0) === " " ? borderColor.slice(1) : borderColor;
    var backgroundColorPicker = createPicker(constantNames["configBox"]["componentColor"], selectedBackgroundColor, backgroundCallBack);
    var selectedBorderColorPicker = createPicker(constantNames["configBox"]["selectedBorder"], selectedBorderColor, selectedBorderCallBack);
    var borderColorPicker = createPicker(constantNames["configBox"]["borderColor"], borderColor, borderCallBack);

    backgroundColorPicker.style.float = "left";
    borderColorPicker.style.float = "right";
    selectedBorderColorPicker.style.float = "right";
    borderColorPicker.style.marginRight = 25 + "px";
    selectedBorderColorPicker.style.marginRight = 30 + "px";
    selectedBorderColorPicker.style.marginTop = backgroundColorPicker.style.marginTop = borderColorPicker.style.marginTop = 40 + "px";
    selectedBorderColorPicker.style.marginBottom = backgroundColorPicker.style.marginBottom = borderColorPicker.style.marginBottom = 20 + "px";
    box.appendChild(backgroundColorPicker);
    box.appendChild(selectedBorderColorPicker);
    box.appendChild(borderColorPicker);
    return;
}

function getSliderGroup(labelName, minVal, maxVal, defVal, callBack, noPixels) {
    var sliderContainer = document.createElement('div');
    sliderContainer.className = "slidecontainer";
    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = minVal;
    slider.max = maxVal;
    slider.value = defVal;
    slider.className = "slider";
    var label = document.createElement('span');
    label.className = "unselectableText";
    label.innerText = labelName;
    label.style.display = "inline-block";
    label.style.marginLeft = 10 + "px";
    sliderContainer.appendChild(label);
    var span = document.createElement('span');
    span.className = "unselectableText";
    span.innerText = (!noPixels) ? defVal + "px" : defVal;
    span.style.marginLeft = 8 + "px";
    slider.style.marginLeft = 10 + "px";
    slider.addEventListener("change", () => {
        span.innerText = (!noPixels) ? slider.value + "px" : slider.value;
        callBack(slider.value);
    })
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(span);
    return sliderContainer;
}

function produceSliders(box) {
    const borderSliderCallBack = (value) => { configStyle.handleChange('Component', "borderWidth", value + "px"); };
    const innerMarginXCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginX", value + "px");
        refreshAllLinks();

    };
    const innerMarginYCallBack = (value) => {
        configStyle.handleChange('Component', "innerMarginY", value + "px");
        refreshAllLinks();
    };


    var borderWidthSlider = getSliderGroup("Component's border width:", 1, 10, 2, borderSliderCallBack);
    borderWidthSlider.style.float = "right";
    borderWidthSlider.style.marginRight = "20px";
    borderWidthSlider.style.marginTop = "17px";

    var innerMarginDiv = document.createElement('div');
    var innerMarginX = getSliderGroup("Inner Margin X:", 1, 50, configStyle.getJSONValue("innerMarginX").split("px")[0], innerMarginXCallBack);
    var innerMarginY = getSliderGroup("Inner Margin Y:", 1, 50, configStyle.getJSONValue("innerMarginY").split("px")[0], innerMarginYCallBack);
    innerMarginY.style.width = innerMarginX.style.width = "140%";
    innerMarginY.style.display = innerMarginX.style.display = "inline-block";
    innerMarginX.style.float = innerMarginY.style.float = "left";
    innerMarginX.style.marginLeft = innerMarginY.style.marginLeft = "15px";
    innerMarginX.style.position = innerMarginY.style.position = "absolute";
    innerMarginX.style.left = innerMarginY.style.left = -247 + "px";
    innerMarginDiv.id = "innerMarginSlider";
    innerMarginDiv.style.backgroundColor = "rgb(237,237,237)";
    innerMarginDiv.style.marginTop = "17px";
    innerMarginDiv.style.width = "100%";
    innerMarginDiv.style.height = "94px";
    innerMarginDiv.style.display = "none";

    box.appendChild(borderWidthSlider);
    innerMarginDiv.appendChild(innerMarginX);
    innerMarginDiv.appendChild(innerMarginY);
    box.appendChild(innerMarginDiv);
    innerMarginY.style.top = 205 + "px";
    return;
}

function getSwitch(id, labelText) {
    var container = document.createElement('div');
    var label = document.createElement('span');
    label.innerText = labelText;
    label.className = "unselectableText";
    label.style.display = "inline-block";
    label.style.float = "left";
    label.style.marginLeft = 10 + "px";
    label.style.marginRight = 10 + "px";
    label.style.marginTop = 7 + "px";

    container.appendChild(label);
    container.innerHTML += '<input type="checkbox" id="' + id + '"class="checkbox" style="position:absolute;" /><label for="' + id + '" class="toggle">';
    container.style.display = 'inline-block';
    container.style.width = "150px";
    container.style.height = "25px";
    container.style.float = "left";
    return container;
}

function produceSwitches(box) {

    var switcher = getSwitch("autofitSwitch", constantNames["configBox"]["autoFitLabel"]);
    switcher.style.marginLeft = "22px";
    switcher.style.marginTop = "12px";
    switcher.style.width = "auto";
    box.appendChild(switcher);
    return;
}

function produceSubComponentForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "tittleDiv";
    labelDiv.style.position = "relative";
    labelDiv.style.marginTop = "10px";
    labelDiv.style.float = "left";
    labelDiv.innerText = constantNames["configBox"]["subcomponentSettings"];
    var div = document.createElement('div');
    div.className = "formContainer";
    div.style.width = "100%";
    div.appendChild(labelDiv);
    var colorContainer = document.createElement('div');
    colorContainer.style.width = "100%";
    const callBack = (type, attributeChanged, value) => { configStyle.componentsText.handleChange(type, attributeChanged, value); }
        // produceStyleButtons(div, "Component", callBack);
        // produceFontFamilyForms(div, "Component", callBack);
        // produceTextColor(colorContainer, "SubComponent", callBack);

    box.appendChild(div);
    box.appendChild(colorContainer);
    return;
}



export { produceSubComponentForm, produceComponentForm, produceOperationForm, produceLinkForm, getSwitch, produceComponentConfigBox, produceSliders, produceSwitches, createPicker, getSliderGroup };