import { constantNames } from "../config/constantNames.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { modalCallbacksDispatch } from "./modalButtonCallbacks.js";
import { addMotion } from "./movingModal.js";


function addDontSaveButton(buttonsContainer) {
    var dontSaveButton = document.createElement('div');
    dontSaveButton.innerHTML = "Don't Save";
    dontSaveButton.className = "cancelConfigButton unselectableText";
    dontSaveButton.style.marginLeft = "13px";
    dontSaveButton.style.width = "auto";
    dontSaveButton.onclick = modalCallbacksDispatch["dontSave"];
    dontSaveButton.style.float = "right";
    buttonsContainer.appendChild(dontSaveButton);
    return;
}

function produceConfirmationButtons(box, type, closeBox, saveCallBack, projectName) {
    var cancelButton = document.createElement('div');
    var confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";

    confirmationButton.className = "okButton unselectable";
    confirmationButton.innerHTML = "Save";
    cancelButton.innerHTML = constantNames["cancel"];

    cancelButton.onclick = closeBox;
    confirmationButton.onclick = () => { modalCallbacksDispatch["save"](closeBox, saveCallBack, document.getElementById("dialogInputField").value); };
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = "inline-block";
    buttonsContainer.style.float = "right";

    confirmationButton.style.float = cancelButton.style.float = "right";
    confirmationButton.style.marginLeft = "13px";
    confirmationButton.style.marginRight = "24px";
    buttonsContainer.appendChild(confirmationButton);
    (type === "newProj") ? addDontSaveButton(buttonsContainer) : 1;
    buttonsContainer.appendChild(cancelButton);
    box.appendChild(buttonsContainer)

}

{ /* <div class="tittleDiv unselectableText">Component Settings</div> */ }
//to fix

function createDialog(type, callBack) {
    var box = document.createElement('div');
    box.className = "inputBox";
    box.style.width = "392px";
    box.style.paddingTop = "0px";
    box.style.paddingBottom = "15px";
    box.style.paddingLeft = box.style.paddingRight = "0px";
    var closeBox = function () {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }
    var bar = produceMovingBar(box, 0);
    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = () => { closeBox(); }
    closeButton.style.backgroundImage = 'url("../images/whiteCloseInfo.png")';
    closeButton.style.float = "right";
    closeButton.style.height = closeButton.style.width = "12px";
    if (type === "newProj") {
        bar.innerText = "Save Opened Project";
        var messageDiv = document.createElement("div");
        messageDiv.innerText = "Save the opened project?"
        messageDiv.className = "labelModalDiv";
        messageDiv.style.fontSize = "medium";
        messageDiv.style.marginLeft = "23.5px";
        // box.appendChild(messageDiv)

    }
    if (type === "Save")
        bar.innerText = constantNames["inputDialogTitles"]["Save"];
    if (type === "SettingsSave")
        bar.innerText = constantNames["inputDialogTitles"]["SettingsSave"];
    bar.appendChild(closeButton);
    var nameFormExternal = document.createElement('div');
    var nameLabelDiv = document.createElement('div');
    nameLabelDiv.className = "labelModalDiv";
    nameLabelDiv.innerHTML = constantNames["singleFormMessages"][type];
    nameLabelDiv.style.marginLeft = "19.5px";
    nameLabelDiv.style.marginTop = "5px";
    nameLabelDiv.style.float = "left";
    var nameFormDiv = document.createElement('div');
    nameFormDiv.style.marginTop = 15 + "px";
    // nameFormDiv.style.marginLeft = -40 + "px";
    nameFormDiv.innerHTML = '<input id="dialogInputField" class="inputTextClass" type="text" style="padding:5px;width: 300px;margin-right:18px;" name="firstname">';
    // nameFormDiv.firstChild.style.width = "398px";
    // nameFormDiv.firstChild.style.marginRight = "50px";
    nameFormExternal.appendChild(nameLabelDiv);
    nameFormExternal.appendChild(nameFormDiv);
    nameFormDiv.style.marginBottom = "10px";
    // form.onmousedown = null;



    produceGrayLayer(box, type);
    box.appendChild(nameFormExternal);

    produceConfirmationButtons(box, type, closeBox, callBack, nameFormDiv.firstChild.value);
    document.getElementById("body").appendChild(box);
    addMotion(box);
}

function showInputDialog(message, callBack) {
    createDialog(message, callBack);
}




export { showInputDialog, createDialog };