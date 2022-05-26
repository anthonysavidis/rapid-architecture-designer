import { configStyle } from "../Classes/Config.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { getSliderGroup, createPicker, getSwitch } from "./configBox.js";
import { turnOffDescription, turnOnDescription } from "./extendingComponent.js";



function refreshDescriptionLines() {
    for (var l in layers.layerList) {
        const layerItems = layers.itemMap.get(layers.layerList[l]._id);
        for (var i in layerItems.itemList) {
            if (layerItems.itemList[i]._type === "Component") {
                turnOffDescription(layerItems.itemList[i]);
                turnOnDescription(layerItems.itemList[i]);
            }
        }
    }
}

function descriptionArea(box) {
    var descriptionGrid = document.createElement('div');
    descriptionGrid.className = "configGrid";
    var descriptionSwitchContainer = document.createElement('div');
    descriptionSwitchContainer.className = "formContainer";

    var switcher = getSwitch("descriptionSwitch", constantNames["configBox"]["descriptionLabel"]);
    switcher.firstChild.style.marginLeft = "0px";
    switcher.style.marginTop = "12px";
    switcher.style.width = "147px";
    switcher.className += " item1";
    descriptionGrid.appendChild(switcher);

    var descDiv = document.createElement('div');
    descDiv.id = "descArea";
    descDiv.style.backgroundColor = "rgb(237,237,237)";
    descDiv.style.marginTop = "17px";
    descDiv.style.width = "100%";
    descDiv.style.height = "46px";
    descDiv.style.display = "none";

    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const lineNoCallBack = (value) => {
        // configStyle.handleChange('Component', "descLineNo", value + "px");
        configStyle.setJSONValue('descriptionLines', value);
        r.style.setProperty('--descriptionLines', value);
        refreshDescriptionLines();
    };
    const descriptionColorCallBack = (value) => {
        configStyle.setJSONValue('descriptionColor', value);
        r.style.setProperty('--descriptionColor', value);
    };
    var lineNoSlider = getSliderGroup(constantNames["configBox"]["lineNo"], 1, 5, parseInt(rs.getPropertyValue('--descriptionLines'), 10), lineNoCallBack, 1);
    var descriptionColor = configStyle.getJSONValue("descriptionColor");

    var descriptionColorPicker = createPicker(constantNames["configBox"]["descriptionColor"], descriptionColor, descriptionColorCallBack);
    descDiv.appendChild(lineNoSlider);
    lineNoSlider.style.display = "inline-block";
    lineNoSlider.style.float = "left";
    lineNoSlider.firstChild.style.marginLeft = -49 + "px";
    lineNoSlider.style.marginTop = 12 + "px";
    lineNoSlider.style.marginLeft = 5 + "px";
    lineNoSlider.className += " item4";
    descriptionColorPicker.style.display = "inline-block";
    descriptionColorPicker.style.float = "right";
    descriptionColorPicker.style.width = "200px";
    descriptionColorPicker.firstChild.style.marginLeft = "-8px";
    descriptionColorPicker.lastChild.style.marginRight = "-12px";
    descriptionColorPicker.style.marginTop = 12 + "px";
    descriptionColorPicker.style.marginRight = 50 + "px";
    // descriptionColorPicker.style.marginRight = "32.5px";
    descDiv.appendChild(descriptionColorPicker);
    descriptionColorPicker.style.marginLeft = -50 + "px";
    descriptionColorPicker.className += " item6";
    box.appendChild(descriptionGrid);

    descriptionGrid.appendChild(descDiv);
    box.appendChild(descDiv);
    return;
}

export { descriptionArea };