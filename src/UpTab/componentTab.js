import { deleteComponent } from "../Item/edit.js";
import { Item } from "../Classes/Item.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { unlink } from "../Item/Link.js";
import { cancelSelection, getSelectedIds, getSelectedItems } from "../Item/selectComponent.js";
import { splitComponent, joinComponents } from "../Item/split.js";
import { copyComponent, pasteComponent } from "../Item/copy.js";
import { showInputDialog } from "../Input/inputDialog.js";
import { Layer } from "../Classes/Layer.js";
import { layers } from "../Classes/LayerHolder.js";
import { deleteLatestItem, deleteSpecificItems, respawnDeletedItems, spawnSpecificItem, linkItems, unlinkItems, splitAction, joinAction, deleteSpecificLayer, createSpecificLayer, pasteAction, deletePastedItems, createNewLayer } from "../Actions/inverseActions.js";
import { getAllDeletedItemsStrs, getLinkItems } from "../Actions/itemStackFunctions.js";
import { actions } from "../Classes/Actions.js";
import { updateTree } from "../Layers/Tree.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { constantNames } from "../config/constantNames.js";
import { createSpecificFunction, deleteSpecificFunction } from "../Actions/inverseFunctionsActions.js";
import { getSelectedFunctions } from "../Item/selectFunction.js";
import { splitCallBack } from "../Input/functonsContextMenuCallbacks.js";
import { turnOffExtension, turnOnExtension } from "../HtmlElements/extendingComponent.js";
import { collapseSubcomponentsAction, extendSubcomponentsAction } from "../Actions/inversePropertiesTab.js";
import { isAllChecked, isByComponentChecked, showAllRefresh, showByComponent } from "../Workspace/functionAppearance.js";
import { imageStorage } from "../Classes/ImageHolder.js";
import { deleteTrashBinItem, restoreFromTrashBin } from "../Actions/inverseMovement.js";
import { createSendingItem, createSendingLayer } from "../Layers/moveItem.js";
import { newFunctionAction } from "./functionTab.js";
import { appearComponentButtons, pasteAppearListener } from "./tabAppearance/buttonsVisibility.js";
import { measureSelectedView } from "../Workspace/selectedOperationsHandler.js";
import { hideSubarchitectureExpansion, showSubarchitectureExpansion } from "../HtmlElements/goExtendedComponents.js";

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

function askForDetails(type, extraInfo) {
    produceBox("input", extraInfo, (name, description) => {
        var it;

        if (name === "" || !name.replace(/\s/g, '').length) name = constantNames["emptyNames"][type.toLowerCase()];
        if (description === "" || !description.replace(/\s/g, '').length) description = constantNames["emptyNames"]["description"];
        if (type === "Component") {
            it = newComponentAction();
            items.updateNameAndDescription(it._id, name, description);

            actions.saveCommand(spawnSpecificItem, deleteLatestItem, "", it.toString());
        } else if (type === "Link") {
            it = linkComponentsAction();
            items.updateNameAndDescription(it._id, name, description);
            var linkedItems = getSelectedItems();
            var itemsStr = "{ \"0\":" + linkedItems[0].toString() + ", \"1\":" + linkedItems[1].toString() + ",\"2\":" + it.toString() + "}"

            var finalLinkedItems = JSON.parse(itemsStr);
            finalLinkedItems[2] = JSON.parse(it.toString());

            actions.saveCommand(linkItems, unlinkItems, JSON.stringify(finalLinkedItems), it.toString());
            appearComponentButtons();
        } else if (type === "Function") {
            var it = newFunctionAction()
            items.updateNameAndDescription(it._id, name, description);
            measureSelectedView(it._id, 1);

            actions.saveCommand(createSpecificFunction, deleteSpecificFunction, "", it.toString());
        }
        if (it._type === "Function" && isByComponentChecked())
            showByComponent();
    }, () => {
        // if (it._type === "Component" || it._type === "Function") {
        //     items.delete(it._id);
        // } else if (it._type === "Link") {
        //     unlink();
        // }
    });
}

function collapseButton(extentableItems) {
    // for (var x in extentableItems) {
    //     turnOffExtension(extentableItems[x]._id);
    // }
    // actions.saveCommand(collapseSubcomponentsAction, extendSubcomponentsAction, JSON.stringify(extentableItems), "");
    hideSubarchitectureExpansion(extentableItems);
    return;
}

function extendButton(extentableItems) {
    // var oldBRecs = {};
    showSubarchitectureExpansion(extentableItems)
    // for (var x in extentableItems) {
    //     oldBRecs[extentableItems[x]._id] = JSON.stringify(extentableItems[x].boundingRec);
    //     turnOnExtension(extentableItems[x]._id);
    // }
    // actions.saveCommand(extendSubcomponentsAction, collapseSubcomponentsAction, JSON.stringify(extentableItems), oldBRecs);
    return;
}
var componentContextDispatch = {};

function addComponentTabListeners() {
    document.getElementById("newButton").addEventListener("click", componentContextDispatch["New"] = function () {

        askForDetails("Component", "New Component"); //fix
    });
    document.getElementById("deleteButton").addEventListener("click", componentContextDispatch["Delete"] = function () {
        // deletedItemsStack.push(getAllDeletedItemsStrs());
        var msg = constantNames["confirmationBox"]["DeleteMsgStart"] + getSelectedIds().length + constantNames["confirmationBox"]["DeleteMsgEnd"];
        var originalItemsStrs = getAllDeletedItemsStrs();
        const selectedIds = getSelectedIds();
        produceBox("confirmation", msg + "@1@Component(s) Deletion", () => {
            const itemObjects = getSelectedItems();
            const links = getLinkItems(itemObjects);
            const deletedComponentLinks = getLinkItems(itemObjects);
            const str = createSendingItem(itemObjects);
            deleteComponentAction(selectedIds);
            var linkArg;
            if (links.length === 0)
                linkArg = "";
            else
                linkArg = itemFromListToObject(links);
            actions.saveCommand(deleteSpecificItems, restoreFromTrashBin, [str, linkArg], "");
            cancelSelection();
            if (isAllChecked())
                showAllRefresh();

        });
    });
    document.getElementById("linkButton").addEventListener("click", componentContextDispatch["Link"] = function () {
        // var linkItem = linkComponentsAction();
        // var linkedItems = getSelectedItems();
        // var itemsStr = "{ \"0\":" + linkedItems[0].toString() + ", \"1\":" + linkedItems[1].toString() + ",\"2\":" + linkItem.toString() + "}"
        askForDetails("Link", "New Link"); //fix

    });
    document.getElementById("unlinkButton").addEventListener("click", componentContextDispatch["Unlink"] = function () {
        var unlinkedItems = getSelectedItems();
        var linkId = unlinkedItems[0].links.get(unlinkedItems[1]._id);
        const linkItemStr = items.itemList[items.itemList.findIndex((el) => el._id === linkId)].toString();
        var itemsStr = "{ \"0\":" + unlinkedItems[0].toString() + ", \"1\":" + unlinkedItems[1].toString() + ",\"2\":" + linkItemStr + "}"
        unlinkComponentsAction();
        items.delete(linkId);
        actions.saveCommand(unlinkItems, linkItems, itemsStr, linkItemStr);
        appearComponentButtons();
    });
    document.getElementById("splitButton").addEventListener("click", componentContextDispatch["Split"] = function () {
        splitComponentAction();
        if (isAllChecked()) {
            showAllRefresh();
        }
        // actions.saveCommand(splitAction, joinAction, itemToBeSplited, itemParts);
    });
    document.getElementById("joinButton").addEventListener("click", componentContextDispatch["Join"] = function () {
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
        if (isAllChecked())
            showAllRefresh();
        actions.saveCommand(joinAction, splitAction, joinedItem, itemToBeJoined);
    });
    document.getElementById("copyButton").addEventListener("click", componentContextDispatch["Copy"] = function () {
        copyComponentAction();
    });
    document.getElementById("pasteButton").addEventListener("click", componentContextDispatch["Paste"] = function () {
        pasteComponentAction();
    });
    document.getElementById("subdivideButton").addEventListener("click", componentContextDispatch["Subdivide"] = function () {
        const sid = getSelectedIds()[0];
        const component = getSelectedItems()[0];
        var callBack = (name, cancelled) => {
            // console.log(sid);
            if (cancelled)
                return;
            var layerCreated = produceNewLayer(sid, name);
            actions.saveCommand(createNewLayer, deleteSpecificLayer, layerCreated._id, layerCreated.toString());
        }
        callBack(component._name, 0);
        appearComponentButtons();

    });
    document.getElementById("unsubdivideButton").addEventListener("click", componentContextDispatch["Unsubdivide"] = function () {
        const unsubdivideCallBack = () => {
            var itemToBeUnsubdivided = getSelectedItems()[0];
            var layerBeingDeleted = layers.layerList[layers.layerList.findIndex((el) => itemToBeUnsubdivided.subLayers[0] === el._id)];
            var str = createSendingLayer(itemToBeUnsubdivided);
            layers.deleteLayer(layerBeingDeleted._id);
            updateTree();
            actions.saveCommand(deleteSpecificLayer, createSpecificLayer, layerBeingDeleted._id, str);
            appearComponentButtons();
        }
        var msg = constantNames['messages']['unsubdivideMsg'];
        produceBox("confirmation", msg + "@1@Component Unsubdivision", unsubdivideCallBack);
    });
    document.getElementById("extendButton").addEventListener("click", componentContextDispatch["Extend"] = function () {
        const extentableItems = getSelectedItems();
        extendButton(extentableItems);
        appearComponentButtons();
        actions.saveCommand((actionItems) => {
            extendButton(actionItems.initialItem);
            appearComponentButtons();
        }, (actionItems) => {
            collapseButton(actionItems.initialItem);
            appearComponentButtons();
        }, extentableItems, "");
    });
    document.getElementById("collapseButton").addEventListener("click", componentContextDispatch["Collapse"] = function () {
        const extentableItems = getSelectedItems();
        collapseButton(extentableItems);
        appearComponentButtons();
        actions.saveCommand((actionItems) => {
            collapseButton(actionItems.initialItem);
            appearComponentButtons();
        }, (actionItems) => {
            extendButton(actionItems.initialItem);
            appearComponentButtons();
        }, extentableItems, "");
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
    document.getElementById("pasteButton").style.display = "inline-block";
    document.getElementById("copyButton").style.display = "none";
    // navigator.clipboard.addEventListener("clipboardchange", (e) => {
    //     pasteAppearListener() ?
    //         document.getElementById("pasteButton").style.display = "inline-block" :
    //         document.getElementById("pasteButton").style.display = "none";
    //     console.log("Clipboard event fired!");
    // })

}

export { addComponentTabListeners, deleteComponentAction, componentContextDispatch, subdivideAction, askForDetails, produceNewLayer, pasteComponentAction };