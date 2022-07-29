import { actions } from "../Classes/Actions.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { constantNames } from "../config/constantNames.js";
import { addMotion } from "../Input/movingModal.js";
import { produceGrayLayer, produceMovingBar } from "./infoBoxes.js";


const alterChoiceCallBack = (link) => {
    if (document.getElementById("undirected").checked) {
        InstanceGenerator.alterLinkDirection(link, "");
        items.itemList[items.itemList.findIndex(el => el._id === link._id)].linkState = "";
    }
    else if (document.getElementById("bidirected").checked) {
        InstanceGenerator.alterLinkDirection(link, "bidirectional");
        items.itemList[items.itemList.findIndex(el => el._id === link._id)].linkState = "bidirectional";

    }
    else {
        InstanceGenerator.alterLinkDirection(link, "directed", document.getElementById("toField").value);

    }
    return;
}
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

        if (id === "directed")
            document.getElementById("toChoice").style.display = "block";
        else
            document.getElementById("toChoice").style.display = "none";

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

function produceLinkDirectionBox(linkId) {
    const linkItem = items.itemList[items.itemList.findIndex(el => el._id === linkId)];
    const toValues = [linkItem.idComponent1, linkItem.idComponent2];
    const toNames = [items.itemList[items.itemList.findIndex(el => el._id === toValues[0])]._name, items.itemList[items.itemList.findIndex(el => el._id === toValues[1])]._name];

    var box = document.createElement('div');
    var closeBox = () => {
        document.getElementById("grayLayer").remove();
        box.remove();
    }
    var cancelAction = () => {
        closeBox();
    }
    produceGrayLayer(box, "", closeBox, "");
    box.className = "selectingBox";
    box.style.height = "fit-content";
    box.style.paddingBottom = "6px";
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
    const selectDiv = document.createElement('div');
    const labelDiv = document.createElement('div');
    labelDiv.innerText = "To:";
    labelDiv.style.float = "left";
    labelDiv.style.fontSize = "15px";
    labelDiv.style.marginTop = "5px";
    const select = document.createElement('select');
    selectDiv.id = "toChoice";
    selectDiv.style.padding = "5px 5px 0px 0";
    selectDiv.appendChild(labelDiv);
    selectDiv.appendChild(select);
    // selectDiv.style.display = "none";
    select.style.float = "left";
    select.id = "toField";
    select.className = "inputTextClass";
    selectDiv.className = "item10";
    selectDiv.style.display = "none";
    selectDiv.style.marginLeft = "10px";
    select.innerHTML = '<option value="' + toValues[0] + '">' + toNames[0] + '</option>  \
    <option value="'+ toValues[1] + '">' + toNames[1] + '</option>';
    select.style.margin = 0 + "px";
    select.style.padding = 0;
    select.style.color = "#525252";
    select.style.fontSize = "15px";
    select.style.width = "186px";
    select.style.marginLeft = "7px";
    select.style.paddingLeft = "8px";
    select.style.height = "30px";
    grid.appendChild(selectDiv);
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
    const oldLinkState = linkItem.linkState;
    confirmationButton.onclick = function () {
        alterChoiceCallBack(linkItem);
        const newLinkState = items.itemList[items.itemList.findIndex(el => el._id === linkId)].linkState;
        if (newLinkState !== oldLinkState) {
            actions.saveCommand((actionItems) => {
                items.itemList[items.itemList.findIndex(el => el._id === linkId)].linkState = actionItems.updatedItem;
                console.log("LINK STATE:" + items.itemList[items.itemList.findIndex(el => el._id === linkId)].linkState)
                items.itemList[items.itemList.findIndex(el => el._id === linkId)].configureDirection();
            }, (actionItems) => {
                items.itemList[items.itemList.findIndex(el => el._id === linkId)].linkState = actionItems.initialItem;
                console.log("LINK STATE:" + items.itemList[items.itemList.findIndex(el => el._id === linkId)].linkState)
                items.itemList[items.itemList.findIndex(el => el._id === linkId)].configureDirection();
            }, oldLinkState, newLinkState);
        }
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
}

export { produceLinkDirectionBox }