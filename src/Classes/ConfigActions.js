import { turnOffDescription } from "../HtmlElements/extendingComponent.js";
import { autoResizeAllComponents } from "../Item/autoResize.js";
import { renderLine } from "../Item/createLine.js";
import { configStyle } from "./Config.js";
import { applyToEachComponent, refreshAllLinks } from "./LayerHolder.js";
import { capitalizeFirstLetter, makeSmallFirstLetter } from "./TextConfig.js";

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
            initialJSON[categoryNames[x]] = (rs.getPropertyValue(categoryNames[x]).charAt(0) === " ") ? rs.getPropertyValue(categoryNames[x]).slice(1) : rs.getPropertyValue(categoryNames[x]);
        }
        return initialJSON;
    }
    applyToConfig(changesJSON) {

        for (var x in changesJSON) {
            const atributeChanged = x.split(this.category.toLowerCase())[1];
            const value = changesJSON[x].charAt(0) === " " ? changesJSON[x].slice(1) : changesJSON[x];
            console.log(this.category + " " + makeSmallFirstLetter(atributeChanged) + " " + value);
            configStyle.handleChange(this.category, makeSmallFirstLetter(atributeChanged), value);
            // configStyle.handleChangeVar(x, changesJSON[x]);
        }
        // this.clearCurrentOldSettings();
        // refreshAllLinks();
        return;
    }

    resetCurrentChanges() {

        this.applyToConfig(this.currentOldSettings);
        return;
    }

    resetToDefault() {
        this.applyToConfig(this.initialSettings);
        console.log(this.initialSettings);
        if (this.category === "Component") {
            configStyle.setInitialMargins();
            document.getElementById('innerMarginSlider').style.display = "none";
            configStyle.autoFit = document.getElementById("autofitSwitch").checked = false;
            document.getElementById("descArea").style.display = "none";
            document.getElementById("descriptionSwitch").checked = configStyle.descriptionEnabled = false;
            applyToEachComponent((component) => {
                turnOffDescription(component);

            });
            autoResizeAllComponents();
        }
        return;
    }

    addToCurrentOldSettings(key, value) {
        this.currentOldSettings[key] = value;
    }

    clearCurrentOldSettings() {
        this.currentOldSettings = {};
    }
    setCurrentStetings(varName) {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        const value = (rs.getPropertyValue("--" + varName).charAt(0) === " ") ? rs.getPropertyValue("--" + varName).slice(1) : rs.getPropertyValue("--" + varName);
        configStyle.handleChangeVar(varName, value);
        return;
    }
}

function getAllCssVars() {
    var cssVarNames = [];
    var allCSS = [].slice.call(document.styleSheets)
        .reduce(function (prev, styleSheet) {
            if (styleSheet.cssRules) {
                return prev + [].slice.call(styleSheet.cssRules)
                    .reduce(function (prev, cssRule) {
                        if (cssRule.selectorText == ':root') {
                            var css = cssRule.cssText.split('{');
                            css = css[1].replace('}', '').split(';');
                            for (var i = 0; i < css.length; i++) {
                                var prop = css[i].split(':');
                                if (prop.length == 2 && prop[0].indexOf('--') == 1) {
                                    // console.log('Property name: ', prop[0]);
                                    // console.log('Property value:', prop[1]);
                                    var varName = prop[0].replace(' --', '--')
                                    if (!varName.includes("selectedOperationsWidth"))
                                        cssVarNames.push(varName);
                                }
                            }
                        }
                    }, '');
            }
        }, '');

    return cssVarNames;
}

export { ConfigActions, getAllCssVars };