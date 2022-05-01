import { configStyle } from "../Classes/Config.js";
import { layers } from "../Classes/LayerHolder.js";
import { getSliderGroup, createPicker } from "./configBox.js";
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
    var descDiv = document.createElement('div');
    descDiv.id = "descArea";
    descDiv.style.backgroundColor = "rgb(237,237,237)";
    descDiv.style.marginTop = "17px";
    descDiv.style.width = "100%";
    descDiv.style.height = "100px";
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
    var lineNoSlider = getSliderGroup("Number of description lines:", 1, 5, parseInt(rs.getPropertyValue('--descriptionLines'), 10), lineNoCallBack, 1);
    console.log(rs.getPropertyValue('--descriptionLines'));
    var descriptionColor = configStyle.getJSONValue("descriptionColor");

    var descriptionColorPicker = createPicker("Description Color:", descriptionColor, descriptionColorCallBack);
    descDiv.appendChild(lineNoSlider);
    lineNoSlider.style.display = "inline-block";
    lineNoSlider.style.float = "left";
    descriptionColorPicker.style.display = "inline-block";
    descriptionColorPicker.style.float = "right";
    descriptionColorPicker.style.marginRight = "25px";
    descDiv.appendChild(descriptionColorPicker);
    box.appendChild(descDiv);
    return;
}

export { descriptionArea };