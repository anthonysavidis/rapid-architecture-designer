import { configStyle } from "../Classes/Config.js";
import { getSliderGroup,createPicker } from "./configBox.js";

function changeAllDescriptionColors(val){

}

function refreshDescriptionLines(value){
    
}

function descriptionArea(box) {
    var descDiv = document.getElementById('div');
    descDiv.id = "descArea"; 
    descDiv.style.backgroundColor = "rgb(237,237,237)";
    descDiv.style.marginTop = "17px";
    descDiv.style.width = "100%";
    descDiv.style.height = "100px";
    descDiv.style.display = "none";

    const lineNoCallBack = (value) => { configStyle.handleChange('Component', "descLineNo", value + "px");refreshDescriptionLines(value); };
    const descriptionColorCallBack = (value) => { configStyle.setJSONValue('descriptionColor',value);changeAllDescriptionColors(value); };
    var lineNoSlider = getSliderGroup("Number of description lines:",1, 5, 3, lineNoCallBack);

    
    var descriptionColor = configStyle.getJSONValue("descriptionColor");

    var borderColorPicker = createPicker("Description Color:", borderColor, borderCallBack);

}