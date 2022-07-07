import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { askForDetails, componentContextDispatch } from "../UpTab/componentTab.js";
import { moveToCntx } from "../UpTab/hierarchyTab.js";
import { getActiveComponentButtonNames } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { addToParentContext } from "./functionsContextMenu.js";
import { produceBox } from "./infoBoxes.js";

var closeContext = () => {};


function produceComponentContextMenu(clickedComponentId, componentIdList, x, y) {
    var componentContext = document.createElement('div');
    componentContext.className = "context-menu";
    componentContext.style.left = x + "px";
    componentContext.style.top = y + "px";
    closeContext = () => {
        setTimeout(() => {
            componentContext.remove();
        }, 100);
    }

    addToParentContext("", componentContext, "New", () => {
        componentContextDispatch["New"]();
        closeContext();
    }, "");
    const contextButtonNames = getActiveComponentButtonNames();
    for (var x in contextButtonNames) {
        const label = contextButtonNames[x];
        const callBack = componentContextDispatch[contextButtonNames[x]];
        addToParentContext("", componentContext, label, () => {
            callBack();
            closeContext();
        }, "");
    }
    addToParentContext("", componentContext, "Copy", () => {
        componentContextDispatch["Copy"]();
        closeContext();
    }, "");
    addToParentContext("", componentContext, "Move To", () => {
        moveToCntx();
        closeContext();
    }, "");
    document.getElementById("body").appendChild(componentContext);
    componentContext.onclick = closeContext;
    return;
}

export { produceComponentContextMenu, closeContext };