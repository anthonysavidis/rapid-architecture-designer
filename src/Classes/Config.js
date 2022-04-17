import { autoResizeAllComponents } from "../Item/resize.js";
import { capitalizeFirstLetter, TextConfig } from "./TextConfig.js";

class Config{
    constructor(){
        this.componentsText = new TextConfig();
        this.linkText = new TextConfig();
        this.operationsText = new TextConfig();
        this.configJSON={};
    }
    
    setJSONValue(key, value) {
        this.configJSON[key] = value;
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

var configStyle = new Config();

export{configStyle};