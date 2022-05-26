import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { capitalizeFirstLetter, TextConfig } from "./TextConfig.js";
import { constantValues } from "../config/constantValues.js";
import { ConfigActions } from "./ConfigActions.js";

class Config {
    constructor() {
        this.componentsText = new TextConfig();
        this.linkText = new TextConfig();
        this.operationsText = new TextConfig();
        this.configJSON = {};
        this.autoFit = false;
        this.descriptionEnabled = false;
        this.actionDispatch = {
            "Link": new ConfigActions("Link"),
            "Operation": new ConfigActions("Operation"),
            "Component": new ConfigActions("Component"),
            "Subcomponent": new ConfigActions("Subcomponent"),
            "Description": new ConfigActions("Description"),
        }
        this.configJSON["componentInnerMarginX"] = constantValues["initialOffsetWidth"] + "px";
        this.configJSON["componentInnerMarginY"] = constantValues["initialOffsetHeight"] + "px";
        this.configJSON["descriptionColor"] = "#545454";
        this.configJSON["descriptionLines"] = "3";
    }

    setJSONValue(key, value) {
        this.configJSON[key] = value;
        return;
    }
    setInitialMargins() {
        this.configJSON["innerMarginX"] = constantValues["initialOffsetWidth"] + "px";
        this.configJSON["innerMarginY"] = constantValues["initialOffsetHeight"] + "px";
    }
    getJSONValue(key) {
        return this.configJSON[key];
    }

    handleChange(type, attributeChanged, value, ignoreCurrent) {
        var textType = type.toLowerCase();
        var varName = "--" + textType + capitalizeFirstLetter(attributeChanged);
        this.setJSONValue(textType + capitalizeFirstLetter(attributeChanged), value);
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const oldValue = rs.getPropertyValue(varName);
        r.style.setProperty(varName, value);
        if (type === "Component" && !attributeChanged.includes("border") && (!attributeChanged.includes("color") && !attributeChanged.includes("Color"))) {
            autoResizeAllComponents();
            // checkAndResize(); //?????????????????????????
        }
        if (!ignoreCurrent)
            this.actionDispatch[capitalizeFirstLetter(type)].addToCurrentOldSettings(varName, oldValue);
        return;
    }
    getStyleButtonStates(className) {
        // FontWeight,FontStyle,TextDecoration
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        var buttonStates = [];
        rs.getPropertyValue("--" + className.toLowerCase() + "FontWeight") === "bold" ? buttonStates.push("styleButtonPressed") : buttonStates.push("styleButton");
        rs.getPropertyValue("--" + className.toLowerCase() + "FontStyle") === "italic" ? buttonStates.push("styleButtonPressed") : buttonStates.push("styleButton");
        rs.getPropertyValue("--" + className.toLowerCase() + "TextDecoration") === "underline" ? buttonStates.push("styleButtonPressed") : buttonStates.push("styleButton");
        return buttonStates;
    }
}

var configStyle = new Config();

export { configStyle };