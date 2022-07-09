import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { askForDetails } from "../UpTab/componentTab.js";
import { addToParentContext } from "./functionsContextMenu.js";
import { produceBox } from "./infoBoxes.js";

var closeContext = () => {};
var editLinkCallback = (linkId) => {
    const linkItem = items.itemList[items.itemList.findIndex(el => el._id === linkId)];

    produceBox("input", "Link", (name, description) => {
        const linkItemStr = linkItem.toString();
        if (name === "" || !name.replace(/\s/g, '').length) name = "";
        if (description === "" || !description.replace(/\s/g, '').length) description = constantNames["emptyNames"]["description"];
        items.updateNameAndDescription(linkId, name, description);
        detailChangeListener(linkId, linkItemStr);
    });
    document.getElementById("nameForm").value = linkItem._name;
    document.getElementById("itemDescription").value = linkItem._description;
};



var chooseDirectionCallback = (id) => {
    const linkState = items.itemList[items.itemList.findIndex(el => el._id === id)].linkState;

    var optionMap = new Map([
        ["", ""],
        ["point2", ""],
        ["point1", ""],
        ["bidirectional", ""]
    ]);
    optionMap[linkState] = "selected";
    var selectStr = ""
    selectStr = "<option value=\"noneChoice\" " + optionMap[""] + ">" + constantNames["infoTooltip"]["none"] + "</option>";
    selectStr += "<option value=\"pointTo2Choice\" " + optionMap["point2"] + ">" + constantNames["infoTooltip"]["->"] + "</option>";
    selectStr += "<option value=\"pointTo1Choice\" " + optionMap["point1"] + ">" + constantNames["infoTooltip"]["<-"] + "</option>";
    selectStr += "<option value=\"bidirectionalChoice\" " + optionMap["bidirectional"] + ">" + constantNames["infoTooltip"]["<->"] + "</option>";


    produceBox('selecting', ["Choose link direction", selectStr], function(selectedValue) {
        chooseLineType(id, selectedValue);
    });
};

function produceLinkContextMenu(linkId, x, y) {
    var linkContext = document.createElement('div');
    linkContext.className = "context-menu";
    linkContext.style.left = x + "px";
    linkContext.style.top = y + "px";

    addToParentContext(linkId, linkContext, "Edit", editLinkCallback, linkId);
    addToParentContext(linkId, linkContext, "ChooseDirection", chooseDirectionCallback, linkId);
    // addToParentContext(linkId, linkContext, constantNames["functionsContext"]["delete"], deleteCallBack, "");
    closeContext = () => {
        linkContext.remove();
    }
    document.getElementById("body").appendChild(linkContext);
    linkContext.onclick = closeContext;
    return;
}

export { produceLinkContextMenu, closeContext };