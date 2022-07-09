import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { getSelectedItems } from "../Item/selectComponent.js";
import { askForDetails, componentContextDispatch } from "../UpTab/componentTab.js";
import { moveToCntx } from "../UpTab/hierarchyTab.js";
import { getActiveComponentButtonNames } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { checkToDisableOption } from "../Workspace/workspaceContextMenu.js";
import { addToParentContext } from "./functionsContextMenu.js";
import { produceBox } from "./infoBoxes.js";

var closeContext = () => {};
var editComponentCallBack = (componentId) => {
    const editingComponent = items.itemList[items.itemList.findIndex(el => el._id === componentId)];
    produceBox("input", "Component", (name, description) => {
        const componentItemStr = items.itemList[items.itemList.findIndex(el => el._id === componentId)].toString();

        if (name === "" || !name.replace(/\s/g, '').length) name = constantNames["emptyNames"][type.toLowerCase()];
        if (description === "" || !description.replace(/\s/g, '').length) description = constantNames["emptyNames"]["description"];
        items.updateNameAndDescription(componentId, name, description);
        detailChangeListener(componentId, componentItemStr)
    });
    document.getElementById("nameForm").value = editingComponent._name;
    document.getElementById("itemDescription").value = editingComponent._description;
}


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
    const selectedItems = getSelectedItems()
    var editOption = addToParentContext("", componentContext, "Edit", () => {
        if (selectedItems.length === 1) {
            editComponentCallBack(selectedItems[0]._id);
            closeContext();
        }
    }, "");

    // if (getSelectedItems().length !== 1) {
    checkToDisableOption(editOption, selectedItems.length === 1);
    // }

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
    return;
}

export { produceComponentContextMenu, closeContext, editComponentCallBack };