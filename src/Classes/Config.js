import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { capitalizeFirstLetter, makeSmallFirstLetter, TextConfig } from "./TextConfig.js";
import { constantValues } from "../config/constantValues.js";
import { ConfigActions } from "./ConfigActions.js";
import { download } from "../UpTab/fileTab.js";
import { turnOnDescription } from "../HtmlElements/extendingComponent.js";
import { applyToEachComponent } from "./LayerHolder.js";
import { showInputDialog } from "../Input/inputDialog.js";
import { InstanceGenerator } from "./InstanceCreator.js";
import { alterFocusedColor } from "../HtmlElements/goWorkspace.js";
import { measureAllLayersOperations } from "../Workspace/selectedOperationsHandler.js";

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
        this.configJSON["componentFontStyle"] = "normal";
        this.configJSON["componentTextDecoration"] = "none";
        this.configJSON["componentFontWeight"] = "normal";
        this.configJSON["componentTextFamily"] = "Arial, Helvetica, sans-serif";
        this.configJSON["componentTextSize"] = "10pt";
        this.configJSON["linkFontStyle"] = "normal";
        this.configJSON["linkTextDecoration"] = "none";
        this.configJSON["linkFontWeight"] = "normal";
        this.configJSON["linkTextFamily"] = "Arial, Helvetica, sans-serif";
        this.configJSON["linkTextSize"] = "10pt";
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
        const type = varName.split(/(?=[A-Z])/);
        console.log(type[0].slice(2) + " " + makeSmallFirstLetter(type[1]) + type[2] + " " + value);
        const atributeChanged = type[0].slice(2) + makeSmallFirstLetter(type[1]);
        if (atributeChanged === "linkcolor")
            configStyle.handleChange(capitalizeFirstLetter(type[0].slice(2)), "color", value);
        else
            configStyle.handleChange(capitalizeFirstLetter(type[0].slice(2)), makeSmallFirstLetter(type[1]) + type[2], value);
        return;
    }
    handleComponentChange(varName, type, textType, attributeChanged, value) {
        if (type === "Component") {
            if (varName === "--componentTextSize" || varName === "--componentFontStyle" || varName === "--componentTextFamily" || varName === "--componentFontWeight") {
                const font = this.configJSON["componentFontStyle"] + " normal " + this.configJSON["componentFontWeight"] + " " + this.configJSON["componentTextSize"] + " " + this.configJSON["componentTextFamily"];
                InstanceGenerator.modifyNodeProperty("componentFont", font);
            } else {
                if (varName.includes("componentBorderWidth")) {
                    InstanceGenerator.modifyNodeProperty(textType + capitalizeFirstLetter(attributeChanged), parseInt(value.slice(0, -2), 10)); //<-string
                }
                else if (varName.includes("componentTextDecoration")) {
                    const finalValue = !(value.includes("none"));
                    InstanceGenerator.modifyNodeProperty("componentTextUnderlined", finalValue);
                }
                else if (varName.includes("SelectedBorderColor")) {
                    InstanceGenerator.modifyNodeProperty("componentSelectedBorderColor", value);
                }
                else if (varName.includes("InnerMargin") && this.autoFit) {
                    autoResizeAllComponents();
                }
                else {
                    InstanceGenerator.modifyNodeProperty(textType + capitalizeFirstLetter(attributeChanged), value);
                }
            }

        }
    }
    handleLinkChange(type, attributeChanged, value, completeVarName) {
        if (type === "Link") {
            if (attributeChanged === "textSize" || attributeChanged === "textFamily" || attributeChanged === "fontWeight" || attributeChanged === "fontStyle") {
                const font = this.configJSON["linkFontStyle"] + " normal " + this.configJSON["linkFontWeight"] + " " + this.configJSON["linkTextSize"] + " " + this.configJSON["linkTextFamily"];
                InstanceGenerator.modifyLinkProperty("linkFont", font);
            }
            else if (attributeChanged === "textDecoration") {
                const finalValue = !(value.includes("none"));
                console.log(finalValue)
                InstanceGenerator.modifyLinkProperty("linkTextUnderlined", finalValue);
            } else if (attributeChanged === "arrowColor") {

                console.log('arowwww');
                InstanceGenerator.modifyLinkProperty("fromColor", value);
                InstanceGenerator.modifyLinkProperty("toColor", value);
            }
            else {
                console.log(type.toLowerCase() + capitalizeFirstLetter(attributeChanged));
                InstanceGenerator.modifyLinkProperty(type.toLowerCase() + capitalizeFirstLetter(attributeChanged), value);
            }

        }
    }

    handleChange(type, attributeChanged, value, completeVarName) {
        var textType = type.toLowerCase();
        var varName = "--" + textType + capitalizeFirstLetter(attributeChanged);
        this.setJSONValue(textType + capitalizeFirstLetter(attributeChanged), value);
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const oldValue = rs.getPropertyValue(varName);
        r.style.setProperty(varName, value);
        if (varName === "--operationTextSize")
            measureAllLayersOperations();
        // if (type === "Component" && !attributeChanged.includes("border") && (!attributeChanged.includes("color") && !attributeChanged.includes("Color")) && !ignoreCurrent) {
        //     // autoResizeAllComponents();
        //     checkAndResize(); //?????????????????????????
        // }
        this.handleComponentChange(varName, type, textType, attributeChanged, value);
        if (varName.includes("subcomponent")) {
            InstanceGenerator.modifyExtensionProperty("subcomponent" + capitalizeFirstLetter(attributeChanged), value);
        }
        console.log(varName);
        if (type.includes("desc") && this.descriptionEnabled) {
            console.log(value);
            InstanceGenerator.modifyDescriptionProperty("", value);
        }
        this.handleLinkChange(type, attributeChanged, value, "");
        // if (!ignoreCurrent)
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
        var callBack = (name, cancelled) => {
            if (cancelled)
                return;
            // name = "myArchitecture.txt";
            if (name === undefined)
                name = "settings";
            download(name, exportedConfigStr, ".cfg");
        }
        showInputDialog("SettingsSave", callBack);
    }

    importConfig() {
        $("#config-file-input").click(function (e) {
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

            reader.onload = function (evt) {
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