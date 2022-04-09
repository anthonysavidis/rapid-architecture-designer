import { deleteComponent } from "../Item/edit.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { unlink } from "../Item/Link.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { splitComponent, joinComponents } from "../Item/split.js";
import { copyComponent, pasteComponent } from "../Item/copy.js";
import { showInputDialog } from "../Input/inputDialog.js";
import { Layer } from "../Classes/Layer.js";
import { layers } from "../Classes/LayerHolder.js";
import { deleteLatestItem, deleteSpecificItems, respawnDeletedItems, spawnSpecificItem, linkItems, unlinkItems, splitAction, joinAction, deleteSpecificLayer, createSpecificLayer, pasteAction, deletePastedItems } from "../Actions/inverseActions.js";
import { getAllDeletedItemsStrs, getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { updateTree } from "../Layers/Tree.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { constantNames } from "../config/constantNames.js";
import { createSpecificFunction, deleteSpecificFunction } from "../Actions/inverseFunctionsActions.js";
import { autoResize } from "../Item/resize.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { splitCallBack } from "../Input/contextMenuCallbacks.js";
import { turnOffExtension, turnOnExtension } from "../HtmlElements/extendingComponent.js";
import { collapseSubcomponentsAction, extendSubcomponentsAction } from "../Actions/inversePropertiesTab.js";
import { showAllRefresh } from "../Workspace/functionAppearance.js";
import { imageStorage } from "../Classes/ImageHolder.js";
import { deleteTrashBinItem, restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { createSendingItem, createSendingLayer } from "../Layers/moveItem.js";

function newComponentAction() {
    var newItem = new Item("Component");
    return newItem;
}

function deleteComponentAction(selectedIds) {
    deleteComponent(selectedIds);
}

function linkComponentsAction() {
    var linkItem = new Item("Link");
    return linkItem;
}

function unlinkComponentsAction() {
    unlink();
}

function editItemAction() {
    var editingItem = getSelectedItems()[0];
}

function splitComponentAction() {
    splitCallBack();
}

function joinComponentAction() {
    var joinedItem = joinComponents(getSelectedItems());
    return joinedItem;
}

function copyComponentAction() {
    copyComponent();
}

function pasteComponentAction() {
    pasteComponent();
}

function produceNewLayer(sid, name) {
    var layer = new Layer(name, layers.selectedLayer._id, sid);
    // var layerIndex
    var index = items.itemList.findIndex(el => el._id === sid);
    items.itemList[index].subLayers.push(layer._id);
    return layer;
}

function subdivideAction() {
    const sid = getSelectedIds()[0];
    var callBack = (name, cancelled) => {
        if (cancelled)
            return;
        return produceNewLayer(sid, name);
    }
    showInputDialog(constantNames["componentsTab"]["LayerDialog"], callBack);
}

// function unsubdivideAction() {
//     var itemId = getSelectedIds()[0];
//     var it = items.itemList[items.itemList.findIndex(el => el._id === itemId)];

//     layers.deleteLayer(it.subLayers[0]);
//     updateTree();
//     return;
// }

function askForDetails(it, extraInfo) {
    produceBox("input", it._type, (name, description) => {
        if (name === "" || !name.replace(/\s/g, '').length) name = constantNames["emptyNames"]["component"];
        if (description === "" || !description.replace(/\s/g, '').length) description = constantNames["emptyNames"]["description"];
        items.updateNameAndDescription(it._id, name, description);
        if (it._type === "Component") {
            actions.saveCommand(spawnSpecificItem, deleteLatestItem, "", it.toString());
            // autoResize(it._id, it._name);
        } else if (it._type === "Link") {
            var finalLinkedItems = JSON.parse(extraInfo);
            finalLinkedItems[2] = JSON.parse(it.toString());
            console.log(finalLinkedItems);
            actions.saveCommand(linkItems, unlinkItems, JSON.stringify(finalLinkedItems), it.toString());
        } else if (it._type === "Function")
            actions.saveCommand(createSpecificFunction, deleteSpecificFunction, "", it.toString());
    });
}

function collapseButton(extentableItems) {
    for (var x in extentableItems) {
        turnOffExtension(extentableItems[x]._id);
    }
    actions.saveCommand(collapseSubcomponentsAction, extendSubcomponentsAction, JSON.stringify(extentableItems), "");
    return;
}

function extendButton(extentableItems) {
    for (var x in extentableItems) {
        turnOnExtension(extentableItems[x]._id);
    }
    actions.saveCommand(extendSubcomponentsAction, collapseSubcomponentsAction, JSON.stringify(extentableItems), "");
    return;
}

function addComponentTabListeners() {
    document.getElementById("newButton").addEventListener("click", function() {
        var it = newComponentAction();
        askForDetails(it, ""); //fix
    });
    document.getElementById("deleteButton").addEventListener("click", function() {
        // deletedItemsStack.push(getAllDeletedItemsStrs());
        var msg = constantNames["confirmationBox"]["DeleteMsgStart"] + getSelectedIds().length + constantNames["confirmationBox"]["DeleteMsgEnd"];
        var originalItemsStrs = getAllDeletedItemsStrs();
        const selectedIds = getSelectedIds();
        produceBox("confirmation", msg + "@1", () => {
            const itemObjects = getSelectedItems();
            const links = getLinkItems(itemObjects);
            const str = createSendingItem(itemObjects);
            deleteComponentAction(selectedIds);
            var linkArg;
            if (links.length === 0)
                linkArg = "";
            else
                linkArg = itemFromListToObject(links);
            actions.saveCommand(deleteSpecificItems, restoreFromTrashBin, [str, linkArg], "");
            if (document.getElementById('all').checked)
                showAllRefresh();
        });
    });
    document.getElementById("linkButton").addEventListener("click", function() {
        var linkItem = linkComponentsAction();
        var linkedItems = getSelectedItems();
        var itemsStr = "{ \"0\":" + linkedItems[0].toString() + ", \"1\":" + linkedItems[1].toString() + ",\"2\":" + linkItem.toString() + "}"
        askForDetails(linkItem, itemsStr); //fix
    });
    document.getElementById("unlinkButton").addEventListener("click", function() {
        var unlinkedItems = getSelectedItems();
        var linkId = unlinkedItems[0].links.get(unlinkedItems[1]._id);
        const linkItemStr = items.itemList[items.itemList.findIndex((el) => el._id === linkId)].toString();
        var itemsStr = "{ \"0\":" + unlinkedItems[0].toString() + ", \"1\":" + unlinkedItems[1].toString() + ",\"2\":" + linkItemStr + "}"
        unlinkComponentsAction();
        actions.saveCommand(unlinkItems, linkItems, itemsStr, linkItemStr);
    });
    document.getElementById("splitButton").addEventListener("click", function() {
        splitComponentAction();
        // actions.saveCommand(splitAction, joinAction, itemToBeSplited, itemParts);
    });
    document.getElementById("joinButton").addEventListener("click", function() {
        const toBeJoined = getSelectedItems();
        const itemLinks = getLinkItems(toBeJoined);
        var itemToBeJoined;
        console.log(itemLinks);
        if (itemLinks[0]) {
            const binded = toBeJoined.concat(itemLinks)
            itemToBeJoined = JSON.parse(itemFromListToObject(binded));
        } else
            itemToBeJoined = JSON.parse(itemFromListToObject(toBeJoined));
        var joinedItem = joinComponentAction();
        if (document.getElementById('all').checked)
            showAllRefresh();
        actions.saveCommand(joinAction, splitAction, joinedItem, itemToBeJoined);
    });
    document.getElementById("copyButton").addEventListener("click", function() {
        copyComponentAction();
    });
    document.getElementById("pasteButton").addEventListener("click", function() {
        pasteComponentAction();
    });
    document.getElementById("subdivideButton").addEventListener("click", function() {
        const sid = getSelectedIds()[0];
        var callBack = (name, cancelled) => {
            // console.log(sid);
            if (cancelled)
                return;
            var layerCreated = produceNewLayer(sid, name);
            actions.saveCommand(createSpecificLayer, deleteSpecificLayer, "", layerCreated.toString());
        }
        showInputDialog("layer", callBack);

    });
    document.getElementById("unsubdivideButton").addEventListener("click", function() {
        var itemToBeUnsubdivided = getSelectedItems()[0];
        var layerBeingDeleted = layers.layerList[layers.layerList.findIndex((el) => itemToBeUnsubdivided.subLayers[0] === el._id)];
        const layerImage = imageStorage.get(layerBeingDeleted._id + "_LAYER_PREVIEW");
        console.log(layerImage);
        // var layerStr = layerBeingDeleted.toString();
        var str = createSendingLayer(itemToBeUnsubdivided);
        layers.deleteLayer(layerBeingDeleted._id);
        updateTree();
        actions.saveCommand(deleteSpecificLayer, createSpecificLayer, layerBeingDeleted._id, str);

    });
    document.getElementById("extendButton").addEventListener("click", function() {
        const extentableItems = getSelectedItems();
        extendButton(extentableItems);
    });
    document.getElementById("collapseButton").addEventListener("click", function() {
        const extentableItems = getSelectedItems();
        collapseButton(extentableItems);
    });
    initialAppear();
    return;
}



function initialAppear() {
    document.getElementById("linkButton").style.display = "none";
    document.getElementById("unlinkButton").style.display = "none";
    document.getElementById("deleteButton").style.display = "none";
    document.getElementById("splitButton").style.display = "none";
    document.getElementById("joinButton").style.display = "none";
    document.getElementById("subdivideButton").style.display = "none";
    document.getElementById("unsubdivideButton").style.display = "none";
    document.getElementById("collapseButton").style.display = "none";
    document.getElementById("extendButton").style.display = "none";

}

export { addComponentTabListeners, subdivideAction, askForDetails, produceNewLayer, pasteComponentAction };