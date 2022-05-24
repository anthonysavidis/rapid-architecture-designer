import { configStyle } from "./Config.js";

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
            initialJSON[categoryNames[x]] = rs.getPropertyValue("--" + categoryNames[x]);
        }
        return;
    }
    applyToConfig(changesJSON) {
        for (var x in changesJSON) {
            const type = x.split(/(?=[A-Z])/)[0];
            const attributeChanged = x.replace(type, "");
            configStyle.handleChange(type, attributeChanged, changesJSON[x]);
        }
        this.clearCurrenntOldSettings();
        return;
    }

    resetCurrentChanges() {
        this.applyToConfig(this.currentOldSettings);
        return;
    }

    resetToDefault() {
        this.applyToConfig(this.initialSettings);
        return;
    }

    addToCurrentOldSettings(key, value) {
        this.currentOldSettings[key] = value;
    }

    clearCurrenntOldSettings() {
        this.currentOldSettings[key] = {};
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
                                    cssVarNames.push(prop[0].replace(' --', ''));
                                }
                            }
                        }
                    }, '');
            }
        }, '');

    return cssVarNames;
}

export { ConfigActions, getAllCssVars };