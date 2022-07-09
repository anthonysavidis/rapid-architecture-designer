import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { capitalizeFirstLetter, TextConfig } from "./TextConfig.js";
import { constantValues } from "../config/constantValues.js";
import { ConfigActions } from "./ConfigActions.js";
import { download } from "../UpTab/fileTab.js";
import { turnOnDescription } from "../HtmlElements/extendingComponent.js";
import { applyToEachComponent } from "./LayerHolder.js";

class Config {
    produceActionDispatchMembers() {
        this.actionDispatch = {
            "Link": new ConfigActions("Link"),
            "Operation": new ConfigActions("Operation"),
            "Component": new ConfigActions("Component"),
            "Subcomponent": new ConfigActions("Subcomponent"),
            "Description": new ConfigActions("Description"),
        }
    }
    constructor() {
        this.configJSON = {};
        this.autoFit = false;
        this.descriptionEnabled = false;
        this.produceActionDispatchMembers();
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
    handleChangeVar(varName, value) {
        this.setJSONValue(varName.slice(2), value);
        var r = document.querySelector(':root');
        r.style.setProperty(varName, value);
        return;
    }

    handleChange(type, attributeChanged, value, ignoreCurrent) {
        var textType = type.toLowerCase();
        var varName = "--" + textType + capitalizeFirstLetter(attributeChanged);
        this.setJSONValue(textType + capitalizeFirstLetter(attributeChanged), value);
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const oldValue = rs.getPropertyValue(varName);
        r.style.setProperty(varName, value);
        if (type === "Component" && !attributeChanged.includes("border") && (!attributeChanged.includes("color") && !attributeChanged.includes("Color")) && !ignoreCurrent) {
            // autoResizeAllComponents();
            checkAndResize(); //?????????????????????????
        }
        // if (!ignoreCurrent)
        //     this.actionDispatch[capitalizeFirstLetter(type)].addToCurrentOldSettings(varName, oldValue);
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
    applyMassiveChanges() {
        for (var x in configStyle.configJSON) {
            configStyle.handleChangeVar("--" + x, configStyle.configJSON[x]);
        }
        // document.getElementById("autofitSwitch").checked = configStyle.autoFit;
        // document.getElementById("descriptionSwitch").checked = configStyle.descriptionEnabled;
        // this.clearCurrentOldSettings();
        // refreshAllLinks();

        return;
    }

    exportConfig() {
        var exportedConfigJSON = {};
        exportedConfigJSON["autoFit"] = this.autoFit;
        exportedConfigJSON["descriptionEnabled"] = this.descriptionEnabled;
        exportedConfigJSON["configJSON"] = this.configJSON;
        var exportedConfigStr = JSON.stringify(exportedConfigJSON);
        download("settings", exportedConfigStr, ".cfg");
    }

    importConfig() {
        $("#config-file-input").click(function(e) {
            $('#config-file-input').val('');
        });
        $('#config-file-input').trigger('click');
        var input = document.getElementById("config-file-input");
        if (!input) return;
        var importCallBack = this.applyMassiveChanges;
        input.onchange = e => {
            // if (e.target.files[0].name)
            // readTextFile("http://127.0.0.1:5500/tests/" + e.target.files[0].name);
            // location.reload();

            var reader = new FileReader();

            reader.onload = function(evt) {
                if (evt.target.readyState != 2) return;
                if (evt.target.error) {
                    alert('Error while reading file');
                    return;
                }
                var filecontent = evt.target.result;
                var configObject = JSON.parse(filecontent);
                console.log(configObject);
                configStyle.autoFit = configObject["autoFit"];
                configStyle.descriptionEnabled = configObject["descriptionEnabled"];
                configStyle.configJSON = configObject["configJSON"];
                importCallBack();
                if (configStyle.descriptionEnabled) {
                    applyToEachComponent(turnOnDescription);
                }
            };
            reader.readAsText(e.target.files[0]);
        }
    }
}

var configStyle = new Config();

export { configStyle };