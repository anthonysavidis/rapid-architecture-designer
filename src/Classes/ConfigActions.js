import { turnOffDescription } from "../HtmlElements/extendingComponent.js";
import { autoResizeAllComponents } from "../Item/autoResize.js";
import { renderLine } from "../Item/createLine.js";
import { configStyle } from "./Config.js";
import { applyToEachComponent, refreshAllLinks } from "./LayerHolder.js";
import { capitalizeFirstLetter } from "./TextConfig.js";

class ConfigActions {
    constructor(category) {
        this.category = category;
        this.currentOldSettings = {};
        this.initialSettings = this.getCategoryInitialValue(category);
    }
    getCategoryInitialValue(category) {
        var categoryNames = getAllCssVars().filter((el) => el.includes(category.toLowerCase()));
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        var initialJSON = {};
        for (var x in categoryNames) {
            initialJSON[categoryNames[x]] = {};
            initialJSON[categoryNames[x]] = rs.getPropertyValue(categoryNames[x]).slice(1);
        }
        return initialJSON;
    }
    applyToConfig(changesJSON) {
        for (var x in changesJSON) {
            const value = changesJSON[x];
            const type = x.split(/(?=[A-Z])/)[0].slice(2);
            const attributeChanged = x.replace(type, "").slice(2);
            configStyle.handleChange(capitalizeFirstLetter(type), attributeChanged, value, 1);
        }
        this.clearCurrenntOldSettings();
        // refreshAllLinks();
        return;
    }

    resetCurrentChanges() {
        console.log(this.currentOldSettings);
        this.applyToConfig(this.currentOldSettings);
        return;
    }

    resetToDefault() {
        this.applyToConfig(this.initialSettings);
        if (this.category === "Component") {
            configStyle.setInitialMargins();
            document.getElementById('innerMarginSlider').style.display = "none";
            configStyle.autoFit = document.getElementById("autofitSwitch").checked = false;
            document.getElementById("descArea").style.display = "none";
            document.getElementById("descriptionSwitch").checked = configStyle.descriptionEnabled = false;
            applyToEachComponent((component) => {
                turnOffDescription(component);
                if (component.links)
                    renderLine(component._id);
            });
            autoResizeAllComponents();
        }
        return;
    }

    addToCurrentOldSettings(key, value) {
        this.currentOldSettings[key] = value;
    }

    clearCurrenntOldSettings() {
        this.currentOldSettings = {};
    }
    setCurrentSettings(varName) {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const value = (rs.getPropertyValue("--" + varName).charAt(0) === " ") ? rs.getPropertyValue("--" + varName).slice(1) : rs.getPropertyValue("--" + varName);
        const type = varName.split(/(?=[A-Z])/)[0];
        const attributeChanged = varName.replace(type, "");
        configStyle.handleChange(capitalizeFirstLetter(type), attributeChanged, value, 1);
        return;
    }
}

function getAllCssVars() {
    var cssVarNames = [];
    var allCSS = [].slice.call(document.styleSheets)
        .reduce(function(prev, styleSheet) {
            if (styleSheet.cssRules) {
                return prev + [].slice.call(styleSheet.cssRules)
                    .reduce(function(prev, cssRule) {
                        if (cssRule.selectorText == ':root') {
                            var css = cssRule.cssText.split('{');
                            css = css[1].replace('}', '').split(';');
                            for (var i = 0; i < css.length; i++) {
                                var prop = css[i].split(':');
                                if (prop.length == 2 && prop[0].indexOf('--') == 1) {
                                    // console.log('Property name: ', prop[0]);
                                    // console.log('Property value:', prop[1]);
                                    cssVarNames.push(prop[0].replace(' --', '--'));
                                }
                            }
                        }
                    }, '');
            }
        }, '');

    return cssVarNames;
}

export { ConfigActions, getAllCssVars };