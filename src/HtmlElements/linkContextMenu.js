import { detailChangeListener } from "../Actions/inversePropertiesTab.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addMotion } from "../Input/movingModal.js";
import { chooseLineType } from "../Item/lineTypeListeners.js";
import { askForDetails } from "../UpTab/componentTab.js";
import { addToParentContext } from "./functionsContextMenu.js";
import { produceBox, produceGrayLayer, produceMovingBar } from "./infoBoxes.js";

var closeContext = () => { };
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

function produceRadioButton(id, labelstr) {
    var radioButton = document.createElement('div');
    radioButton.style.float = "left";
    radioButton.style.width = "fit-content";
    radioButton.style.marginLeft = "2.5px";
    radioButton.addEventListener("change", () => {
        if (id != "undirected")
            document.getElementById("undirected").checked = false;
        if (id != "bidirected")

            document.getElementById("bidirected").checked = false;
        if (id != "directed")

            document.getElementById("directed").checked = false;
    });
    var input = document.createElement('input');
    input.type = "radio";
    input.id = id;
    input.value = "HTML";


    var label = document.createElement('label');
    label.for = "html";
    label.className = "unselectableText";
    label.innerText = labelstr;

    radioButton.appendChild(input);
    radioButton.appendChild(label);
    return radioButton;
}

var chooseDirectionCallback = (id) => {
    // const linkState = items.itemList[items.itemList.findIndex(el => el._id === id)].linkState;

    // var optionMap = new Map([
    //     ["", ""],
    //     ["point2", ""],
    //     ["point1", ""],
    //     ["bidirectional", ""]
    // ]);
    // optionMap[linkState] = "selected";
    // var selectStr = ""
    // selectStr = "<option value=\"noneChoice\" " + optionMap[""] + ">" + constantNames["infoTooltip"]["none"] + "</option>";
    // selectStr += "<option value=\"pointTo2Choice\" " + optionMap["point2"] + ">" + constantNames["infoTooltip"]["->"] + "</option>";
    // selectStr += "<option value=\"pointTo1Choice\" " + optionMap["point1"] + ">" + constantNames["infoTooltip"]["<-"] + "</option>";
    // selectStr += "<option value=\"bidirectionalChoice\" " + optionMap["bidirectional"] + ">" + constantNames["infoTooltip"]["<->"] + "</option>";


    // produceBox('selecting', ["Choose link direction", selectStr, "Link Direction"], function(selectedValue) {
    //     chooseLineType(id, selectedValue);
    // });
    var box = document.createElement('div');
    var closeBox = () => { box.remove(); }
    var cancelAction = () => {
        closeBox();
    }
    produceGrayLayer(box);
    box.className = "selectingBox";
    var bar = produceMovingBar(box);
    bar.innerText = constantNames["linkDirectionBox"]["title"];
    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.style.backgroundImage = 'url("../images/whiteCloseInfo.png")';
    closeButton.style.width = closeButton.style.height = "12px";
    closeButton.style.float = "right";
    closeButton.onclick = closeBox;
    bar.appendChild(closeButton);
    var grid = document.createElement('div');
    grid.className = "configGrid";
    var undirectedRadio = produceRadioButton("undirected", constantNames["linkDirectionBox"]["undirected"]); undirectedRadio.className += "item1";
    var bidirectedRadio = produceRadioButton("bidirected", constantNames["linkDirectionBox"]["bidirected"]); bidirectedRadio.className += "item4";
    var directedRadio = produceRadioButton("directed", constantNames["linkDirectionBox"]["directed"]); directedRadio.className += "item7";
    grid.appendChild(undirectedRadio);
    grid.appendChild(bidirectedRadio);
    grid.appendChild(directedRadio);
    grid.style.gap = grid.style.marginLeft = 0;
    box.appendChild(grid)
    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelConfigButton unselectableText";
    cancelButton.innerHTML = constantNames["cancel"];
    cancelButton.onclick = cancelAction;
    cancelButton.style.float = "right";
    confirmationButton.className = "okButton";
    confirmationButton.style.marginLeft = "13px";
    confirmationButton.style.marginRight = "18px";
    confirmationButton.innerHTML = constantNames["ok"];
    confirmationButton.onclick = function () {
        callBack(select.value);
        closeBox();
    }
    var buttons = document.createElement('div');
    buttons.className = "buttonTeam";
    buttons.style.display = "inline-block";
    buttons.style.width = "100%";
    buttons.appendChild(confirmationButton);
    buttons.appendChild(cancelButton);
    box.appendChild(buttons);
    document.getElementById("body").appendChild(box);
    addMotion(box);
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