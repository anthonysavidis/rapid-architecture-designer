import { constantNames } from "../config/constantNames.js";

function produceSizeForm(box, className, callBack) {
    var select = document.createElement('select');
    select.style.width = "150px";
    select.style.marginLeft = "30px";
    select.style.float = "left";
    select.innerHTML = "<option value=\"x-small\">" + constantNames["configBox"]["xSmall"] + "</option>";
    select.innerHTML += "<option value=\"small\">" + constantNames["configBox"]["Small"] + "</option>";
    select.innerHTML += "<option value=\"medium\" selected>" + constantNames["configBox"]["Medium"] + "</option>";
    select.innerHTML += "<option value=\"large\">" + constantNames["configBox"]["Large"] + "</option>";
    select.innerHTML += "<option value=\"x-large\">" + constantNames["configBox"]["xLarge"] + "</option>";

    select.addEventListener("change", function() {
        callBack(className, select.value);
    })
    box.appendChild(select);
}

function produceFontFamilyForms(box, className, callBack) {
    var select = document.createElement('select');
    select.style.float = "right";
    select.style.width = "350px";

    select.style.marginRight = "25px";
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
        callBack(className, select.value);
    })
    box.appendChild(select);
}

const handleFontFamily = (type, value) => {
    var r = document.querySelector(':root');
    switch (type) {
        case "Component":
            r.style.setProperty('--componentTextFamily', value);
            break;
        case "Operation":
            r.style.setProperty('--operationTextFamily', value);
            break;
        case "Link":
            r.style.setProperty('--linkTextFamily', value);
            break;
        default:
            break;
    }
    return
}

const handleFontSize = (type, value) => {
    var r = document.querySelector(':root');
    switch (type) {
        case "Component":
            r.style.setProperty('--componentTextSize', value);
            break;
        case "Operation":
            r.style.setProperty('--operationTextSize', value);
            break;
        case "Link":
            r.style.setProperty('--linkTextSize', value);
            break;
        default:
            break;
    }
    return
}


function produceComponentForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "labelDiv";
    labelDiv.innerText = "Component Settings";
    var div = document.createElement('div');
    div.appendChild(labelDiv);
    produceSizeForm(div, "Component", handleFontSize);
    produceFontFamilyForms(div, "Component", handleFontFamily);
    box.appendChild(div);
    return;
}


function produceOperationForm(box) {
    var labelDiv = document.createElement('div');
    labelDiv.className = "labelDiv";
    labelDiv.innerText = "Operation Settings";
    var div = document.createElement('div');
    div.appendChild(labelDiv);

    produceSizeForm(div, "Operation", handleFontSize);
    produceFontFamilyForms(div, "Operation", handleFontFamily);
    box.appendChild(div);
    return;
}

function produceLinkForm(box) {
    var labelDiv = document.createElement('div');
    var div = document.createElement('div');

    labelDiv.className = "labelDiv";
    labelDiv.innerText = "Link Settings";
    div.appendChild(labelDiv);
    produceSizeForm(div, "Link", handleFontSize);
    produceFontFamilyForms(div, "Link", handleFontFamily);
    box.appendChild(div);
    return;
}


export { produceComponentForm, produceOperationForm, produceLinkForm };