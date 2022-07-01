import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addMotion, dragModalHandler } from "../Input/movingModal.js";
import { unlink } from "../Item/Link.js";
import { addToArchitectureList } from "../Layers/Tree.js";
import { closeInfo } from "./layerInfo.js";
import { keyCodes } from "../config/keyboardButtons.js";

function produceGrayLayer(box, extraInfo, callBack, cancelCallBack) {
    var grayLayer = document.createElement('div');
    grayLayer.className = "closingLayer";
    grayLayer.id = "grayLayer";
    grayLayer.onclick = () => {
        if (cancelCallBack)
            cancelCallBack();
        box.remove();
        grayLayer.remove();
        // if (callBack)
        //     callBack(constantNames["emptyNames"][extraInfo.toLowerCase()], constantNames["emptyNames"]["description"]);
    }
    document.getElementById('body').appendChild(grayLayer);
    return;
}

function produceMovingBar(box, isMsgBox) {
    if (closeInfo && !isMsgBox) {
        closeInfo();
    }
    var bar = document.createElement('div');
    bar.className = "movingBar";
    if (isMsgBox)
        bar.style.backgroundColor = "#cedff7";
    bar.id = "movingBar";
    box.appendChild(bar);
    return;
}

function produceTextArea(descriptionFormDiv) {

    var descriptionTextArea = document.createElement('textarea');
    descriptionTextArea.id = "itemDescription";
    descriptionTextArea.name = 'subject';
    descriptionTextArea.style.width = "375px";
    descriptionTextArea.style.height = "100px";
    // descriptionTextArea.style.marginLeft = "-70px";

    descriptionTextArea.onkeydown = (e) => {
        if (e.code === "Enter") {
            descriptionTextArea.value += "\n";
        }
    }
    descriptionFormDiv.appendChild(descriptionTextArea);
    return;
}


function produceBox(type, extraInfo, callBack, cancelCallBack, itemId) {
    var box = document.createElement('div');
    box.className = type + "Box";
    var cancelAction = () => {
        if (cancelCallBack)
            cancelCallBack();
        closeBox();
    }

    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelAction;

    if (type !== "updating")
        box.appendChild(closeButton);

    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";
    cancelButton.innerHTML = constantNames["cancel"];

    var title = document.createElement('h3');
    title.className = "boxTitle";
    if (type === "confirmation") {
        cancelButton.onclick = cancelAction;

        var params = extraInfo.split('@');
        title.innerText = params[0];
        title.style.marginRight = "0px";
        title.style.marginTop = "-2px";
        title.style.marginBottom = "22px";
        title.style.marginLeft = "15px";
        title.style.textAlign = "center";
        produceMovingBar(box);
        box.appendChild(title);
        confirmationButton.className = "okButton";
        confirmationButton.style.backgroundColor = "#ff6464";

        (params[1] === '1') ? confirmationButton.innerHTML = "OK": confirmationButton.innerHTML = "Delete";
        confirmationButton.onclick = function() {
            callBack();
            closeBox();
        }
        produceGrayLayer(box, "", "", cancelCallBack);
    } else if (type === "updating") {
        title.style.textAlign = "center";
        title.style.marginRight = "0px";
        title.style.paddingRight = title.style.paddingLeft = "10px";
        // title.style.paddingRight=title.style.paddingLeft="15px";
        title.innerText = extraInfo;
        // produceMovingBar(box, 1);
        title.style.marginTop = -5 + "px";
        box.appendChild(title);

        document.getElementById("body").appendChild(box);

        setTimeout(() => {
            box.remove();
        }, 2500);
        addMotion(box);

        return;
    } else if (type === "selecting") {

        box.style.width = "300px";
        box.style.height = "200px";
        closeButton.style.left = box.getBoundingClientRect().width - 30 + "px";
        closeButton.style.top = 5 + "px";
        title.innerText = extraInfo[0];
        produceMovingBar(box);
        box.appendChild(title);

        var selectExternal = document.createElement('div');
        selectExternal.style.alignContent = "center";
        selectExternal.style.margin = 0;
        selectExternal.style.width = 200 + "px";
        var select = document.createElement('select');
        select.innerHTML = extraInfo[1];
        selectExternal.appendChild(select);
        select.style.marginLeft = 47 + "px";
        select.style.marginBottom = 24 + "px";
        box.appendChild(selectExternal);
        cancelButton.onclick = cancelAction;

        confirmationButton.className = "okButton";
        confirmationButton.innerHTML = constantNames["ok"];
        confirmationButton.onclick = function() {
            callBack(select.value);
            closeBox();
        }
        produceGrayLayer(box, extraInfo, "");
    } else if (type === "input") {
        produceMovingBar(box);
        closeButton.style.marginRight = "-15px";
        box.style.width = "420px";
        // title.innerText = constantNames["inputBox"]["msg"] + extraInfo + constantNames["dot"];
        // box.appendChild(title);
        var form = document.createElement('form');
        form.id = "inputForm";
        var nameFormExternal = document.createElement('div');
        var nameLabelDiv = document.createElement('div');
        nameLabelDiv.className = "labelModalDiv";
        nameLabelDiv.innerHTML = constantNames["inputBox"]["nameLabel"][extraInfo];
        var nameFormDiv = document.createElement('div');
        nameFormDiv.style.marginTop = 2.5 + "px";
        nameFormDiv.innerHTML = '<input type="text" style="width: 375px;" name="firstname">';
        // nameFormDiv.firstChild.style.marginLeft = "-70px";
        nameFormExternal.appendChild(nameLabelDiv);
        nameFormExternal.appendChild(nameFormDiv);

        form.appendChild(nameFormExternal);

        var descriptionFormExternal = document.createElement('div');
        var descriptionLabelDiv = document.createElement('div');
        descriptionLabelDiv.className = "labelModalDiv";
        descriptionLabelDiv.innerHTML = constantNames["inputBox"]["descriptionLabel"][extraInfo];
        var descriptionFormDiv = document.createElement('div');
        descriptionFormDiv.style.marginTop = 2.5 + "px";
        nameLabelDiv.style.marginLeft = descriptionLabelDiv.style.marginLeft = "3px";
        produceTextArea(descriptionFormDiv);
        descriptionFormExternal.appendChild(descriptionLabelDiv);
        descriptionFormExternal.appendChild(descriptionFormDiv);
        form.appendChild(descriptionFormExternal);

        box.appendChild(form);
        confirmationButton.className = "okButton unselectableText";
        confirmationButton.style.marginRight = "3px";
        confirmationButton.style.marginLeft = "25px";
        cancelButton.style.float = confirmationButton.style.float = "right";
        confirmationButton.innerHTML = constantNames["ok"];
        cancelButton.onclick = function() {
            // callBack(constantNames["emptyNames"][extraInfo.toLowerCase()], constantNames["emptyNames"]["description"]);
            cancelCallBack();
            closeBox();
        }
        confirmationButton.onclick = function() {
                // if (!nameFormDiv.firstChild.value) {
                //     callBack(constantNames["emptyNames"][extraInfo.toLowerCase()], constantNames["emptyNames"]["description"]);
                // } else
                callBack(nameFormDiv.firstChild.value, descriptionFormDiv.firstChild.value);
                closeBox();
            }
            // form.onmousedown = null;
        produceGrayLayer(box, extraInfo, callBack, cancelCallBack);
    }
    var buttons = document.createElement('div');
    buttons.className = "buttonTeam";
    buttons.appendChild(confirmationButton);
    buttons.appendChild(cancelButton);
    box.appendChild(buttons);
    document.getElementById("body").appendChild(box);
    addMotion(box);
    closeButton.style.left = box.getBoundingClientRect().width - 30 + "px";
    closeButton.style.top = 5 + "px";
    return;
}

export { produceBox, produceGrayLayer, produceMovingBar };