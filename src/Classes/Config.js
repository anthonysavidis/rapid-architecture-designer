import { autoResizeAllComponents } from "../Item/autoResize.js";
import { capitalizeFirstLetter, TextConfig } from "./TextConfig.js";
import { constantValues } from "../config/constantValues.js";

class Config{
    constructor(){
        this.componentsText = new TextConfig();
        this.linkText = new TextConfig();
        this.operationsText = new TextConfig();
        this.configJSON={};
        this.autoFit = false;
        this.configJSON["innerMarginX"] = constantValues["initialOffsetWidth"]+"px";
        this.configJSON["innerMarginY"] = constantValues["initialOffsetHeight"]+"px";
        this.configJSON["descriptionColor"] = "#545454";
    }
    
    setJSONValue(key, value) {
        this.configJSON[key] = value;
        return;
    }
    setInitialMargins(){
        this.configJSON["innerMarginX"] = constantValues["initialOffsetWidth"]+"px";
        this.configJSON["innerMarginY"] = constantValues["initialOffsetHeight"]+"px";
    }
    getJSONValue(key){
        return this.configJSON[key];
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