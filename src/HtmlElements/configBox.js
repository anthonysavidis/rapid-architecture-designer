import { configStyle } from "../Classes/Config.js";
import { refreshAllLinks } from "../Classes/LayerHolder.js";
import { capitalizeFirstLetter } from "../Classes/TextConfig.js";
import { constantNames } from "../config/constantNames.js";
import { autoResizeAutoFit, autoResizeAllComponents } from "../Item/autoResize.js";
import { detectBrowser } from "../Workspace/browserDetection.js";
import { refreshOperationList } from "../Workspace/functionAppearance.js";
import { refreshComponentConfigContents } from "./componentConfig.js";

function produceSizeForm(box, className, callBack) {
    var select = document.createElement('select');
    select.style.width = "64px";
    select.style.display = "inline-block";
    select.className = "inputTextClass";

    select.style.float = "left";
    select.style.fontSize = "small";
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
    select.addEventListener("change", function () {
        callBack(className, 'textSize', select.value);
    })
    select.style.padding = 0;
    select.style.paddingLeft = "8px";
    select.style.height = "30px";
    select.style.marginBottom = 0;

    // select.style.marginTop = "20px";
    box.appendChild(select);
}


function produceFontFamilyForms(box, className, callBack) {
    var select = document.createElement('select');
    select.className = "inputTextClass";
    select.id = "fontFamilyForm";
    select.style.float = "right";
    select.style.width = "350px";
    select.style.display = "inline-block";
    // select.style.marginRight = "25px";
    select.style.fontSize = "small";
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
    select.addEventListener("change", function () {
        callBack(className, 'textFamily', select.value);
    });
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    select.value = rs.getPropertyValue('--' + className.toLowerCase() + 'TextFamily');
    (!select.value) ? select.value = "Arial, Helvetica, sans-serif" : 1;
    select.style.float = "left";
    select.style.width = 190 + "px";
    select.style.padding = 0;
    select.style.paddingLeft = "8px";
    select.style.height = "30px";
    // select.style.marginTop = "20px";
    select.style.marginBottom = 0;
    box.appendChild(select);
}

function produceStyleButtons(box, className, callBack) {
    var boldButton = document.createElement('div');
    var italicButton = document.createElement('div');
    var underlinedButton = document.createElement('div');
    [boldButton.className, italicButton.className, underlinedButton.className] = configStyle.getStyleButtonStates(className);
    boldButton.innerText = "B";
    boldButton.style.fontWeight = "bold";
    boldButton.addEventListener("click", function () {
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
    italicButton.addEventListener("click", function () {
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
    underlinedButton.addEventListener("click", function () {
        if (underlinedButton.className === "styleButton") {
            callBack(className, 'textDecoration', "underline");
            underlinedButton.className = "styleButtonPressed";
        } else {
            callBack(className, 'textDecoration', "none");
            underlinedButton.className = "styleButton";
        }
    })
    var div = document.createElement('div');
    div.className = "styleButtonsContainer unselectableText";
    div.appendChild(boldButton);
    div.appendChild(italicButton);
    div.appendChild(underlinedButton);
    div.style.float = "left";
    box.appendChild(div);
    return;
}

function createPicker(txt, selected, callBack) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "labelDiv unselectableText";

    labelDiv.innerHTML = '<div style="float:left;">' + txt + '</div>';
    var picker = document.createElement('input');
    picker.type = "color";
    picker.addEventListener("change", function () {
        callBack(picker.value);
    });
    picker.style.display = "inline-block";
    picker.style.marginLeft = "10px";
    picker.style.marginTop = "-6px";
    picker.style.float = "right";
    picker.style.width = "50px";
    if (detectBrowser() === "Firefox") {
        picker.style.marginTop = "2px";
        picker.style.height = "20px";
    }
    picker.style.border = picker.style.padding = 0;
    labelDiv.style.width = "100%";
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

    var textColor = createPicker(constantNames["configBox"]["textColor"], selectedColor, textCallBack);
    var backgroundColor = createPicker(constantNames["configBox"]["backgroundColor"], selectedBackgroundColor, textBackgroundCallBack);
    textColor.style.float = backgroundColor.style.float = "left";
    textColor.className += " item1";
    backgroundColor.className += " item2";
    // box.appendChild(textColor);
    // box.appendChild(backgroundColor);
    appendConfigDiv(textColor.firstChild, textColor.children[1], 1);
    appendConfigDiv(backgroundColor.firstChild, backgroundColor.children[1], 1);
    return;
}
//----------------------============================================================================================================----------------------------------------------------------------------


function createRestoreButton(category, closeBoxCallBack, openBoxCallBack) {
    var restoreButton = document.createElement('div');
    restoreButton.className = "cancelConfigButton unselectableText";
    restoreButton.innerHTML = constantNames["restore"];
    restoreButton.onclick = () => {
        if (category == "Component") {
            configStyle.actionDispatch["Component"].resetToDefault();
            configStyle.actionDispatch["Description"].resetToDefault();
            configStyle.actionDispatch["Subcomponent"].resetToDefault();

        } else if (category === "Operation") {
            configStyle.actionDispatch["Operation"].resetToDefault();
            refreshOperationList();
        } else if (category === "Link") {
            configStyle.actionDispatch["Link"].resetToDefault();
        }
        closeBoxCallBack();
        openBoxCallBack(true);
        // configStyle.actionDispatch[category].resetToDefault();
    }
    return restoreButton;
}

//----------------------============================================================================================================----------------------------------------------------------------------

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
    });
    if (detectBrowser() === "Firefox")
        slider.style.height = "5px";
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(span);
    return sliderContainer;
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

//adds columns.
function appendConfigDiv(label, element, row) {
    var tdLabel = document.createElement('td');
    var tdElement = document.createElement('td');
    tdElement.className = "tableElementsStyle";
    tdLabel.className = "tableLabelsStyle";
    tdLabel.appendChild(label);
    tdElement.appendChild(element);
    document.getElementById("cr" + row).appendChild(tdLabel);
    document.getElementById("cr" + row).appendChild(tdElement);
    return;
}
//pre creates the table, table body & all rows.
function createConfigTableDiv() {
    var configTable = document.createElement('table');
    configTable.innerHTML = '<tbody><tr id="cr1"></tr><tr id="cr2"></tr><tr id="cr3"></tr></tbody>';
    document.getElementById("body").appendChild(configTable);
    return configTable;
}

//label+slider mazi i timi sto element
function createSliderRows(params) {

}


export { produceSizeForm, createRestoreButton, appendConfigDiv, produceFontFamilyForms, produceStyleButtons, produceTextColor, getSwitch, createPicker, createConfigTableDiv, createSliderRows, getSliderGroup };