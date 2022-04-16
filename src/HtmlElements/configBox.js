import { configStyle } from "../Classes/Config.js";
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
    (!select.value) ? select.value = "medium": 1;
    select.addEventListener("change", function() {
        callBack(className,'textSize', select.value);
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
        callBack(className,'textFamily' ,select.value);
    })
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    select.value = rs.getPropertyValue('--' + className.toLowerCase() + 'TextFamily');
    (!select.value) ? select.value = "Arial, Helvetica, sans-serif": 1;

    box.appendChild(select);
}

function produceStyleButtons(box,className,callBack) {
    var boldButton = document.createElement('div');
    var italicButton = document.createElement('div');
    var underlinedButton = document.createElement('div');
    boldButton.className =italicButton.className=underlinedButton.className= "styleButton";
    boldButton.innerText = "B";
    boldButton.style.fontWeight = "bold";
    
    italicButton.innerText = "I";
    italicButton.style.fontStyle="italic";
    underlinedButton.innerText = "U";
    underlinedButton.style.textDecoration="underline";
    var div = document.createElement('div');
    div.className="styleButtonsContainer";
    div.appendChild(boldButton);
    div.appendChild(italicButton);
    div.appendChild(underlinedButton);
    box.appendChild(div);
    return;
}

function produceComponentForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.style.position = "";
    labelDiv.className = "labelDiv";
    labelDiv.innerText = "Component Settings";
    var div = document.createElement('div');
    div.className="formContainer";
    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value)=>{configStyle.componentsText.handleChange(type, attributeChanged, value);}
    produceSizeForm(div, "Component",callBack);
    produceStyleButtons(div,"Component",callBack);
    produceFontFamilyForms(div, "Component",callBack);
    box.appendChild(div);
    return;
}


function produceOperationForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "labelDiv";
    labelDiv.style.position = "relative";

    labelDiv.innerText = "Operation Settings";
    labelDiv.style.marginTop="10px";

    var div = document.createElement('div');
    div.className="formContainer";

    div.appendChild(labelDiv);
    const callBack = (type, attributeChanged, value)=>{configStyle.operationsText.handleChange(type, attributeChanged, value)};
    produceSizeForm(div, "Operation",callBack );
    produceStyleButtons(div,"Operation",callBack);
    produceFontFamilyForms(div, "Operation",callBack );
    box.appendChild(div);
    return;
}

function produceLinkForm(box) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');
    labelDiv.style.position = "";

    labelDiv.className = "labelDiv";
    labelDiv.innerText = "Link Settings";
    div.className="formContainer";

    div.appendChild(labelDiv);
    const callBack =  (type, attributeChanged, value)=>{configStyle.linkText.handleChange(type, attributeChanged, value)};
    produceSizeForm(div, "Link",callBack);
    produceStyleButtons(div,"Link",callBack);
    produceFontFamilyForms(div, "Link", callBack);
    box.appendChild(div);
    return;
}


export { produceComponentForm, produceOperationForm, produceLinkForm };