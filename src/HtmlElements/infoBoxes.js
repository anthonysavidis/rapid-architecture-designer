import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addMotion, dragModalHandler } from "../Input/movingModal.js";
import { unlink } from "../Item/Link.js";
import { addToArchitectureList } from "../Layers/Tree.js";
import { closeInfo } from "./layerInfo.js";


function produceGrayLayer(box, extraInfo, callBack, cancelCallBack) {
    var grayLayer = document.createElement('div');
    grayLayer.className = "closingLayer";
    grayLayer.id = "grayLayer";
    grayLayer.onclick = () => {
        box.remove();
        grayLayer.remove();
        // if (callBack)
        //     callBack(constantNames["emptyNames"][extraInfo.toLowerCase()], constantNames["emptyNames"]["description"]);
        if (cancelCallBack)
            cancelCallBack();
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
    cancelButton.className = "cancelButton";
    cancelButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["cancel"] + "</p>";

    var title = document.createElement('h3');
    title.className = "boxTitle";
    if (type === "confirmation") {
        cancelButton.onclick = cancelAction;

        var params = extraInfo.split('@');
        title.innerText = params[0];
        produceMovingBar(box);
        box.appendChild(title);
        confirmationButton.className = "deleteButton";
        (params[1] === '1') ? confirmationButton.innerHTML = "<p style=\"margin-top:9px\">OK</p>": confirmationButton.innerHTML = "<p style=\"margin-top:9px\">Delete</p>";
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
        closeButton.style.left = closeButton.getBoundingClientRect().x + 220 + "px";
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
        confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["ok"] + "</p>";
        confirmationButton.onclick = function() {
            callBack(select.value);
            closeBox();
        }
        produceGrayLayer(box, extraInfo, "");
    } else if (type === "input") {
        produceMovingBar(box);
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
        nameFormDiv.innerHTML = '<input type="text" style="width: 75%;" name="firstname">';
        nameFormExternal.appendChild(nameLabelDiv);
        nameFormExternal.appendChild(nameFormDiv);

        form.appendChild(nameFormExternal);

        var descriptionFormExternal = document.createElement('div');
        var descriptionLabelDiv = document.createElement('div');
        descriptionLabelDiv.className = "labelModalDiv";
        descriptionLabelDiv.innerHTML = constantNames["inputBox"]["descriptionLabel"][extraInfo];
        var descriptionFormDiv = document.createElement('div');
        descriptionFormDiv.style.marginTop = 2.5 + "px";
        descriptionFormDiv.innerHTML = '<textarea id="itemDescription" name="subject" style="width: 75%;height:100px"></textarea>';
        descriptionFormExternal.appendChild(descriptionLabelDiv);
        descriptionFormExternal.appendChild(descriptionFormDiv);
        form.appendChild(descriptionFormExternal);

        box.appendChild(form);
        confirmationButton.className = "okButton";
        confirmationButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["ok"] + "</p>";
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
    buttons.appendChild(cancelButton);
    buttons.appendChild(confirmationButton);
    box.appendChild(buttons);
    document.getElementById("body").appendChild(box);
    addMotion(box);
    return;
}

export { produceBox, produceGrayLayer, produceMovingBar };