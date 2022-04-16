import { autoResizeAllComponents } from "../Item/resize.js";

class TextConfig {
    
    constructor() {
        this.textConfigJSON = {};
        this.textConfigJSON["textSize"] = "12pt";
        this.textConfigJSON["textFamily"] = "Arial, Helvetica, sans-serif";
        this.textConfigJSON["fontWeight"] = "normal";
        this.textConfigJSON["fontStyle"] = "normal";
        this.textConfigJSON["textDecoration"] = "none";
        this.textConfigJSON["textBackgroundColor"] = "#FFFFFF";
        this.textConfigJSON["textColor"] = "#000000";
        return;
    }

    setJSONValue(key, value) {
        this.textConfigJSON[key] = value;
        return;
    }
    
    handleChange(type, attributeChanged, value) {
        var textType = type.toLowerCase();
        var varName = "--" + textType + capitalizeFirstLetter(attributeChanged);
        this.setJSONValue(attributeChanged, value);
        var r = document.querySelector(':root');
        r.style.setProperty(varName, value);
        if (type === "Component") {
            autoResizeAllComponents();
        }
        return;
    }
}

function capitalizeFirstLetter(str) {
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
}
export { TextConfig };