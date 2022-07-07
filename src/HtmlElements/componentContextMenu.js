import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { askForDetails } from "../UpTab/componentTab.js";
import { addToParentContext } from "./functionsContextMenu.js";
import { produceBox } from "./infoBoxes.js";

var closeContext = () => {};
var editLinkCallback = (linkId) => {

};


var chooseDirectionCallback = (id) => {

};

function produceComponentContextMenu(clickedComponentId, componentIdList, x, y) {
    var componentContext = document.createElement('div');
    componentContext.className = "context-menu";
    componentContext.style.left = x + "px";
    componentContext.style.top = y + "px";

    addToParentContext(clickedComponentId, componentContext, "Edit", editLinkCallback, componentIdList);
    addToParentContext(clickedComponentId, componentContext, "ChooseDirection", chooseDirectionCallback, componentIdList);
    // addToParentContext(linkId, componentContext, constantNames["functionsContext"]["delete"], deleteCallBack, "");
    closeContext = () => {
        componentContext.remove();
    }
    document.getElementById("body").appendChild(componentContext);
    componentContext.onclick = closeContext;
    return;
}

export { produceComponentContextMenu, closeContext };