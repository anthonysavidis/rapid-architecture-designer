import { constantNames } from "../config/constantNames.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { modalCallbacksDispatch } from "./modalButtonCallbacks.js";
import { addMotion } from "./movingModal.js";


function addDontSaveButton(buttonsContainer) {
    var dontSaveButton = document.createElement('div');
    dontSaveButton.innerHTML = "Don't Save";
    dontSaveButton.className = "cancelConfigButton unselectableText";
    dontSaveButton.style.marginLeft = "25px";
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
    buttonsContainer.style.marginTop = "8px";
    buttonsContainer.style.marginRight = "2px";
    buttonsContainer.style.display = "inline-block";
    buttonsContainer.style.float = "right";
    buttonsContainer.style.marginRight = "2px";

    confirmationButton.style.float = cancelButton.style.float = "right";
    confirmationButton.style.marginLeft = "25px";
    buttonsContainer.appendChild(confirmationButton);
    (type === "newProj") ? addDontSaveButton(buttonsContainer): 1;
    buttonsContainer.appendChild(cancelButton);
    box.appendChild(buttonsContainer)

}

{ /* <div class="tittleDiv unselectableText">Component Settings</div> */ }
//to fix

function createDialog(type, callBack) {
    var box = document.createElement('div');
    box.className = "inputBox";
    box.style.width = "450px";
    box.style.paddingLeft = box.style.paddingRight = "0px";
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }
    produceMovingBar(box, 0);
    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.style.marginTop = -15 + "px";
    closeButton.style.marginRight = "5px";
    closeButton.onclick = () => { closeBox(); }
        // box.appendChild(closeButton);
    var title = document.createElement('h3');
    // title.className = "boxTitle";
    title.style.marginTop = "-10px";
    title.style.marginLeft = "25px";
    title.style.marginBottom = "12px";
    if (type === "newProj")
        title.innerText = 'Save current project before closing?';
    if (type === "Save")
        title.innerText = 'Save current project?';
    if (type === "SettingsSave")
        title.innerText = 'Save current settings?';
    box.appendChild(title);
    var nameFormExternal = document.createElement('div');
    var nameLabelDiv = document.createElement('div');
    nameLabelDiv.className = "labelModalDiv";
    nameLabelDiv.innerHTML = constantNames["singleFormMessages"][type];
    // nameLabelDiv.style.marginLeft = "26px";
    var nameFormDiv = document.createElement('div');
    nameFormDiv.style.marginTop = 2.5 + "px";
    // nameFormDiv.style.marginLeft = -40 + "px";
    nameFormDiv.innerHTML = '<input id="dialogInputField" type="text" style="width: 75%;" name="firstname">';
    nameFormDiv.firstChild.style.width = "398px";
    // nameFormDiv.firstChild.style.marginRight = "50px";
    nameFormExternal.appendChild(nameLabelDiv);
    nameFormExternal.appendChild(nameFormDiv);
    nameFormDiv.style.marginBottom = "10px";
    nameFormDiv.style.display = "flex";
    nameFormDiv.style.justifyContent = "center";
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