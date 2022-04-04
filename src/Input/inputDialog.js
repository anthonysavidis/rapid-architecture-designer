import { constantNames } from "../config/constantNames.js";
import { produceGrayLayer } from "../HtmlElements/infoBoxes.js";

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
    nameLabelDiv.className = "labelDiv";
    nameLabelDiv.innerHTML = constantNames["inputBox"]["nameLabel"]["Component"];
    var nameFormDiv = document.createElement('div');
    nameFormDiv.style.marginTop = 2.5 + "px";
    nameFormDiv.innerHTML = '<input type="text" style="width: 75%;" name="firstname">';
    nameFormExternal.appendChild(nameLabelDiv);
    nameFormExternal.appendChild(nameFormDiv);
    nameFormExternal.style.marginBottom = "10px";
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["ok"] + "</p>";
    cancelButton.className = "cancelButton";
    cancelButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["cancel"] + "</p>";

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