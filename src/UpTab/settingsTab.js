import { constantNames } from "../config/constantNames.js";
import { createPicker, produceComponentConfigBox, produceComponentForm, produceLinkForm, produceOperationForm, produceSliders, produceSubComponentForm, produceSwitches, getSwitch } from "../HtmlElements/configBox.js";
import { produceGrayLayer, produceMovingBar } from "../HtmlElements/infoBoxes.js";
import { addMotion } from "../Input/movingModal.js";
import { configStyle } from "../Classes/Config.js";
import { autoResizeAllComponents } from "../Item/autoResize.js";
import { turnOnDescription } from "../HtmlElements/extendingComponent.js";
import { items } from "../Classes/ItemArray.js";



function createConfigBox() {
    var box = document.createElement('div');
    box.className = 'configurationBox';
    produceGrayLayer(box, "", "", "");
    var closeBox = function () {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    };

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = closeBox;
    closeButton.style.position = "absolute";
    closeButton.style.left = 680 + "px";
    produceMovingBar(box, 0);
    box.appendChild(closeButton);
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
    confirmationButton.onclick = function () {
        closeBox();
    }
    box.appendChild(closeButton);
    box.appendChild(confirmationButton);
    document.getElementById('body').appendChild(box);
    addMotion(box);
    return;
}


function createComponentConfigBox() {
    var box = document.createElement('div');
    box.className = 'configurationBox';

    produceGrayLayer(box, "", "", "");
    var closeBox = function () {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    };

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = closeBox;
    closeButton.style.position = "absolute";
    closeButton.style.left = 680 + "px";
    produceMovingBar(box, 0);
    box.appendChild(closeButton);
    produceComponentConfigBox(box);
    produceSwitches(box);
    produceSliders(box);
    const backgroundCallBack = (value) => { configStyle.handleChange('Subcomponent', "backgroundColor", value); };
    const textColorCallBack = (value) => { configStyle.handleChange('Subcomponent', "textColor", value); };
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var backgroundColor = rs.getPropertyValue('--subcomponentBackgroundColor');
    var textColor = rs.getPropertyValue('--subcomponentTextColor');

    backgroundColor = backgroundColor.charAt(0) === " " ? backgroundColor.slice(1) : backgroundColor;
    textColor = textColor.charAt(0) === " " ? textColor.slice(1) : textColor;
    var backgroundColorPicker = createPicker(constantNames["configBox"]["subcomponentColor"], backgroundColor, backgroundCallBack);
    var textColorPicker = createPicker(constantNames["configBox"]["subcomponentTextColor"], textColor, textColorCallBack);
    var subSettingsContainer = document.createElement('div');
    textColorPicker.style.width = backgroundColorPicker.style.width = "fit-content";
    textColorPicker.style.float = "left";

    backgroundColorPicker.style.float = "right";
    subSettingsContainer.appendChild(backgroundColorPicker);
    subSettingsContainer.appendChild(textColorPicker);
    subSettingsContainer.style = "float:left;margin-top: 20px;width:95.5%;height:50px;display:inline-block;";
    box.appendChild(subSettingsContainer);
    // produceSubComponentForm(box);
    /*
    <input type="checkbox" id="switch"
                    class="checkbox" />
        <label for="switch" class="toggle">
    */
   var switcher = getSwitch("descriptionSwitch",constantNames["configBox"]["descriptionLabel"]);

   
   switcher.style.marginLeft = "22px";
   switcher.style.marginTop = "12px";
   switcher.style.width = "auto";
   box.appendChild(switcher);

    var closeButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    closeButton.className = "cancelButton";
    closeButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["close"] + "</p>";
    closeButton.onclick = closeBox;
    confirmationButton.className = "okButton";
    confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["ok"] + "</p>";
    confirmationButton.onclick = function () {
        closeBox();
    }
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = "relative"
    buttonsContainer.style.width = "100%";
    buttonsContainer.style.height = 40 + "px";
    buttonsContainer.style.display = "inline-block";

    buttonsContainer.style.marginTop = 25 + "px";
    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(confirmationButton);
    box.appendChild(buttonsContainer);

    document.getElementById('body').appendChild(box);
    addMotion(box);
    document.getElementById("autofitSwitch").addEventListener("change", () => {
        configStyle.autoFit = document.getElementById("autofitSwitch").checked;

        if (document.getElementById("autofitSwitch").checked) {
            document.getElementById('innerMarginSlider').firstChild.children[1].value = configStyle.getJSONValue("innerMarginX").split("px")[0];
            document.getElementById('innerMarginSlider').firstChild.children[2].innerText = configStyle.getJSONValue("innerMarginX").split("px")[0]+"px";
            document.getElementById('innerMarginSlider').lastChild.children[1].value = configStyle.getJSONValue("innerMarginY").split("px")[0];
            document.getElementById('innerMarginSlider').lastChild.children[2].innerText = configStyle.getJSONValue("innerMarginY").split("px")[0]+"px";
            document.getElementById('innerMarginSlider').style.display = "inline-block";
        }
        else {
            configStyle.setInitialMargins();
            autoResizeAllComponents();
            document.getElementById('innerMarginSlider').style.display = "none";
        }
    });
    document.getElementById("descriptionSwitch").addEventListener("change", () => {
        if(document.getElementById("descriptionSwitch").checked){
            turnOnDescription(items.itemList[0]._id);
        }
    });
    return;
}


function addSettingsTabListeners() {
    document.getElementById('configureButton').addEventListener('click', (e) => {
        createConfigBox();
    });
    document.getElementById('configureComponentButton').addEventListener('click', (e) => {
        createComponentConfigBox();
        if (configStyle.autoFit) {
            document.getElementById("autofitSwitch").checked = true;
            document.getElementById('innerMarginSlider').style.display = "inline-block";
        }
    });
    return;
}

export { addSettingsTabListeners };