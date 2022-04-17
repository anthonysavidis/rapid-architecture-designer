import { configStyle } from "../Classes/Config.js";
import { capitalizeFirstLetter } from "../Classes/TextConfig.js";
import { constantNames } from "../config/constantNames.js";
import { autoResizeAllComponents } from "../Item/resize.js";

function produceSizeForm(box, className, callBack) {
    var select = document.createElement('select');
    select.style.width = "150px";
    select.style.display = "inline-block";

    select.style.marginLeft = "30px";
    select.style.float = "left";
    select.innerHTML = "<option value=\"small\">" + constantNames["configBox"]["Small"] + "</option>";
    select.innerHTML += "<option value=\"medium\">" + constantNames["configBox"]["Medium"] + "</option>";
    select.innerHTML += "<option value=\"large\">" + constantNames["configBox"]["Large"] + "</option>";
    select.innerHTML += "<option value=\"x-large\">" + constantNames["configBox"]["xLarge"] + "</option>";

    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    select.value = rs.getPropertyValue('--' + className.toLowerCase() + 'TextSize');
    (!select.value) ? select.value = "medium" : 1;
    select.addEventListener("change", function () {
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
    select.addEventListener("change", function () {
        callBack(className, 'textFamily', select.value);
    })
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    select.value = rs.getPropertyValue('--' + className.toLowerCase() + 'TextFamily');
    (!select.value) ? select.value = "Arial, Helvetica, sans-serif" : 1;

    box.appendChild(select);
}

function produceStyleButtons(box, className, callBack) {
    var boldButton = document.createElement('div');
    var italicButton = document.createElement('div');
    var underlinedButton = document.createElement('div');
    boldButton.className = italicButton.className = underlinedButton.className = "styleButton";
    boldButton.innerText = "B";
    boldButton.style.fontWeight = "bold";
    boldButton.addEventListener("click", function () {
        if (boldButton.className === "styleButton") {
            callBack(className, 'fontWeight', "bold");
            boldButton.className = "styleButtonPressed";
        }
        else {
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
        }
        else {
            callBack(className, 'fontStyle',"normal");
            italicButton.className = "styleButton";
        }
    })
    underlinedButton.innerText = "U";
    underlinedButton.style.textDecoration = "underline";
    underlinedButton.addEventListener("click", function () {
        if (underlinedButton.className === "styleButton") {
            callBack(className, 'textDecoration', "underline");
            underlinedButton.className = "styleButtonPressed";
        }
        else {
            callBack(className, 'textDecoration',"none");
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

function createPicker(txt,selected,callBack) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "labelDiv";

    labelDiv.innerText = txt;
    var picker = document.createElement('input');
    picker.type="color";
    picker.addEventListener("change",function () {
        callBack(picker.value);
    })
    picker.style.display="inline-block";
    picker.style.marginLeft="10px";
    picker.value=selected.charAt(0)===" "?selected.slice(1):selected;
    // picker.value= rs.getPropertyValue('--' + className.toLowerCase() + capitalizeFirstLetter(selected));
    labelDiv.appendChild(picker);
    // picker.defaultValue = rs.getPropertyValue('--' + className.toLowerCase() + capitalizeFirstLetter(selected));
    return labelDiv;
}

function produceTextColor(box,className,callBack) {

    
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const selectedColor= rs.getPropertyValue('--' + className.toLowerCase() + "TextColor");
    const selectedBackgroundColor= rs.getPropertyValue('--' + className.toLowerCase() + "TextBackgroundColor");

    const textCallBack = (value)=>{callBack(className,"textColor",value);};
    const textBackgroundCallBack = (value)=>{callBack(className,"textBackgroundColor",value);};


    var textColor = createPicker("Text color:",selectedColor,textCallBack);
    var backgroundColor = createPicker("Background color:",selectedBackgroundColor,textBackgroundCallBack);
    textColor.style.float="left";
    
    box.appendChild(textColor);
    backgroundColor.style.float="right";
    backgroundColor.style.marginRight = "186px";
    box.appendChild(backgroundColor);
    // box.appendChild(picker);
    return;
}
function produceComponentForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "tittleDiv";
    labelDiv.innerText = "Component Settings";
    var div = document.createElement('div');
    div.className = "formContainer";
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.componentsText.handleChange(type, attributeChanged, value); }
    produceSizeForm(div, "Component", callBack);
    produceStyleButtons(div, "Component", callBack);
    produceFontFamilyForms(div, "Component", callBack);
    produceTextColor(div,"Component",callBack); 
    box.appendChild(div);
    return;
}


function produceOperationForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "tittleDiv";
    labelDiv.style.position = "relative";
    
    labelDiv.innerText = "Operation Settings";
    labelDiv.style.marginTop = "10px";
    
    var div = document.createElement('div');
    div.className = "formContainer";
    
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.operationsText.handleChange(type, attributeChanged, value) };
    produceSizeForm(div, "Operation", callBack);
    produceStyleButtons(div, "Operation", callBack);
    produceFontFamilyForms(div, "Operation", callBack);
    produceTextColor(div,"Operation",callBack); 
    box.appendChild(div);
    return;
}

function produceLinkForm(box) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');
    labelDiv.style.position = "";

    labelDiv.className = "tittleDiv";
    labelDiv.innerText = "Link Settings";
    div.className = "formContainer";

    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value) => { configStyle.linkText.handleChange(type, attributeChanged, value) };
    produceSizeForm(div, "Link", callBack);
    produceStyleButtons(div, "Link", callBack);
    produceFontFamilyForms(div, "Link", callBack);
    produceTextColor(div,"Link",callBack); 
    box.appendChild(div);
    return;
}


export { produceComponentForm, produceOperationForm, produceLinkForm };