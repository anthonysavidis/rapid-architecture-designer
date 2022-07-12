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
    return bar;
}

function produceTextArea(descriptionFormDiv) {

    var descriptionTextArea = document.createElement('textarea');
    descriptionTextArea.id = "itemDescription";
    descriptionTextArea.className = "inputTextClass";
    descriptionTextArea.name = 'subject';
    descriptionTextArea.style.width = "375px";
    descriptionTextArea.style.height = "100px";
    descriptionTextArea.style.resize = "none";
    descriptionTextArea.style.fontFamily = "Arial, Helvetica, sans-serif";
    // descriptionTextArea.style.marginLeft = "-70px";
    descriptionTextArea.autocomplete = "off";
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
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }
    var cancelAction = () => {
        if (cancelCallBack)
            cancelCallBack();
        closeBox();
    }


    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.style.backgroundImage = 'url("../images/whiteCloseInfo.png")';
    closeButton.onclick = cancelAction;
    if (type !== "updating" && type !== "selecting")
        box.appendChild(closeButton);

    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";
    cancelButton.innerHTML = constantNames["cancel"];

    var title = document.createElement('div');
    title.className = "boxTitle";
    var buttons = document.createElement('div');
    buttons.className = "buttonTeam";
    if (type === "confirmation") {
        closeButton.remove();
        var params = extraInfo.split('@');
        closeButton.style.width = closeButton.style.height = "12px";
        closeButton.style.float = "right";
        var bar = produceMovingBar(box);
        bar.innerText = params[2];
        bar.appendChild(closeButton);
        bar.style.position = "relative";
        cancelButton.onclick = cancelAction;
        box.style.width = "318px";
        buttons.style.marginTop = "45px";

        if (params[0].includes("subarchitecture")) {
            // title = document.createElement('h4');
            title.style.paddingRight = title.style.paddingLeft = "10px";
            buttons.style.marginTop = "65px";

        }
        title.innerText = params[0];

        title.style.width = "100%";
        title.style.display = "flex";
        title.style.justifyContent = "center";
        title.style.position = "absolute";
        title.style.top = "-10px";
        title.style.marginTop = "38px";
        box.appendChild(title);
        confirmationButton.className = "okButton";
        confirmationButton.style.backgroundColor = "#ff6464";
        confirmationButton.style.borderColor = "#969696";

        (params[1] === '1') ? confirmationButton.innerHTML = "OK": confirmationButton.innerHTML = "Delete";
        confirmationButton.onclick = function() {
            callBack();
            closeBox();
        }
        cancelButton.style.float = "right";
        confirmationButton.style.marginLeft = "20px";
        confirmationButton.style.marginRight = "20px";
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
        buttons.style.display = "inline-block";
        buttons.style.width = "100%";
        buttons.style.marginTop = "-10px";

        box.style.width = "310px";
        title.innerText = extraInfo[0];
        title.style.marginTop = "32px";
        title.style.marginLeft = "25px";
        title.style.left = "0px";
        // title.style.marginLeft = "27px";
        title.style.textAlign = "left";
        title.style.marginBottom = "6px";
        box.style.height = "172px";
        closeButton.remove();
        closeButton.style.width = closeButton.style.height = "12px";
        closeButton.style.float = "right";
        var bar = produceMovingBar(box);
        bar.style.position = "absolute";
        bar.innerText = extraInfo[2];
        bar.appendChild(closeButton);
        box.appendChild(title);
        var selectExternal = document.createElement('div');
        selectExternal.style.alignContent = "center";
        selectExternal.style.margin = 0;
        selectExternal.style.width = 200 + "px";
        var select = document.createElement('select');
        select.innerHTML = extraInfo[1];
        select.style.width = "250px";
        selectExternal.appendChild(select);
        select.style.marginLeft = 25 + "px";
        select.style.marginTop = 0 + "px";
        select.style.marginBottom = 24 + "px";
        select.style.outline = 0;
        box.appendChild(selectExternal);
        cancelButton.onclick = cancelAction;
        cancelButton.style.float = "right";
        confirmationButton.className = "okButton";
        confirmationButton.style.marginLeft = "25px";
        confirmationButton.style.marginRight = "30px";
        confirmationButton.innerHTML = constantNames["ok"];
        confirmationButton.onclick = function() {
            callBack(select.value);
            closeBox();
        }
        produceGrayLayer(box, extraInfo, "");
        box.style.height = "153px";

    } else if (type === "input") {
        closeButton.remove();
        closeButton.style.width = closeButton.style.height = "12px";
        closeButton.style.float = "right";
        var bar = produceMovingBar(box, undefined, extraInfo);
        bar.style.position = "absolute";
        bar.style.top = 0;
        bar.style.left = 0;
        bar.innerText = extraInfo
            // closeButton.style.marginRight = "-15px";
        bar.appendChild(closeButton);

        box.style.width = "420px";

        // title.innerText = constantNames["inputBox"]["msg"] + extraInfo + constantNames["dot"];
        // box.appendChild(title);
        var form = document.createElement('form');
        form.id = "inputForm";
        form.style.marginTop = "28px";
        var nameFormExternal = document.createElement('div');
        var nameLabelDiv = document.createElement('div');
        nameLabelDiv.className = "labelModalDiv";
        nameLabelDiv.innerHTML = constantNames["inputBox"]["nameLabel"];
        var nameFormDiv = document.createElement('div');
        nameFormDiv.style.marginTop = 2.5 + "px";
        nameFormDiv.innerHTML = '<input id="nameForm" class="inputTextClass" autocomplete="off" type="text" style="width: 375px;" name="firstname">';
        // nameFormDiv.firstChild.style.marginLeft = "-70px";
        nameFormExternal.appendChild(nameLabelDiv);
        nameFormExternal.appendChild(nameFormDiv);

        form.appendChild(nameFormExternal);

        var descriptionFormExternal = document.createElement('div');
        var descriptionLabelDiv = document.createElement('div');
        descriptionLabelDiv.className = "labelModalDiv";
        descriptionLabelDiv.innerHTML = constantNames["inputBox"]["descriptionLabel"];
        var descriptionFormDiv = document.createElement('div');
        descriptionFormDiv.style.marginTop = 2.5 + "px";
        nameLabelDiv.style.marginLeft = descriptionLabelDiv.style.marginLeft = "0";
        produceTextArea(descriptionFormDiv);
        // descriptionFormDiv.id = "descriptionForm";
        descriptionFormExternal.appendChild(descriptionLabelDiv);
        descriptionFormExternal.appendChild(descriptionFormDiv);
        form.appendChild(descriptionFormExternal);

        box.appendChild(form);
        confirmationButton.className = "okButton unselectableText";
        confirmationButton.style.marginRight = "0.5px";
        confirmationButton.style.marginLeft = "20px";
        cancelButton.style.float = confirmationButton.style.float = "right";
        confirmationButton.innerHTML = constantNames["ok"];
        cancelButton.onclick = function() {
            // callBack("", constantNames["emptyNames"]["description"]);
            cancelAction();
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