import { configStyle } from "../Classes/Config.js";
import { constantNames } from "../config/constantNames.js";
import { createPicker, getSliderGroup } from "./configBox.js";

function createFirstRow(box) {
    const linkColorValue = (configStyle.getJSONValue("linkColor")) ? configStyle.getJSONValue("linkColor") : "#000000";
    const linkArrowColorValue = (configStyle.getJSONValue("linkArrowColor")) ? configStyle.getJSONValue("linkArrowColor") : "#000000";

    const linkColorPicker = createPicker(constantNames["linkConfig"]["linkColor"], linkColorValue, (value) => {
        configStyle.handleChange("Link", "color", value);
    });
    const linkArrowColorPicker = createPicker(constantNames["linkConfig"]["arrowColor"], linkArrowColorValue, (value) => {
        configStyle.handleChange("Link", "arrowColor", value);
    });
    var container = document.createElement("div");
    linkColorPicker.style.float = linkArrowColorPicker.style.float = "left";
    container.style.marginTop = "10px";
    container.style.width = "626.17px";
    container.style.float = "left";
    container.style.display = "inline-block";
    container.style.marginTop = "10px";
    container.style.marginLeft = "7px";
    container.appendChild(linkColorPicker);
    container.appendChild(linkArrowColorPicker);
    box.appendChild(container);
    return;
}


function createLinkConfigBox(box) {
    createFirstRow(box);
    return;

}
export { createLinkConfigBox };