import { constantNames } from "../config/constantNames.js";
import { produceComponentForm, produceLinkForm, produceOperationForm } from "../HtmlElements/configBox.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";



function createConfigBox() {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    produceGrayLayer(box, "", "", "");
    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = closeBox;
    box.appendChild(closeButton);
    produceMovingBar(box, 0);
    produceComponentForm(box);
    produceOperationForm(box);
    produceLinkForm(box);
    var closeButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    closeButton.className = "cancelButton";
    closeButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["close"] + "</p>";
    closeButton.onclick = closeBox;
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["ok"] + "</p>";
    confirmationButton.onclick = function() {
        closeBox();
    }
    box.appendChild(closeButton);
    box.appendChild(confirmationButton);
    document.getElementById('body').appendChild(box);
    return
}



function addSettingsTabListeners() {
    document.getElementById('configureButton').addEventListener('click', (e) => {
        createConfigBox();
    });
    return;
}

export { addSettingsTabListeners };