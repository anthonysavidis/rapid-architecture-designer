import { constantNames } from "../config/constantNames.js";
import { produceGrayLayer } from "../HtmlElements/infoBoxes.js";


//to fix
function createDialog(type, callBack) {
    var box = document.createElement('div');
    box.className = "inputBox";
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }
    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = () => { closeBox(); }
    box.appendChild(closeButton);
    var cancelButton = document.createElement('div');
    var confirmationButton = document.createElement('div');
    var nameFormExternal = document.createElement('div');
    var nameLabelDiv = document.createElement('div');
    nameLabelDiv.className = "labelModalDiv";
    nameLabelDiv.innerHTML = constantNames["singleFormMessages"][type];
    var nameFormDiv = document.createElement('div');
    nameFormDiv.style.marginTop = 2.5 + "px";
    nameFormDiv.innerHTML = '<input type="text" style="width: 75%;" name="firstname">';
    nameFormExternal.appendChild(nameLabelDiv);
    nameFormExternal.appendChild(nameFormDiv);
    nameFormExternal.style.marginBottom = "10px";
    confirmationButton.className = "okButton unselectable";
    confirmationButton.innerHTML = constantNames["ok"];
    cancelButton.className = "cancelConfigButton";
    cancelButton.innerHTML = constantNames["cancel"];

    cancelButton.onclick = function() {
        callBack(constantNames["emptyNames"][type], 1);
        closeBox();
    }
    confirmationButton.onclick = function() {
            if (!nameFormDiv.firstChild.value) {
                callBack(constantNames["emptyNames"][type]);
            } else
                callBack(nameFormDiv.firstChild.value);
            closeBox();
        }
        // form.onmousedown = null;

    produceGrayLayer(box);
    box.appendChild(nameFormExternal);
    box.appendChild(confirmationButton);
    box.appendChild(cancelButton);
    document.getElementById("body").appendChild(box);
}

function showInputDialog(message, callBack) {
    createDialog(message, callBack);
}




export { showInputDialog };