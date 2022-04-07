import { Item } from "../Classes/Item.js";
import { getSelectedIds, getSelectedItems } from "../Item/selectComponent.js"
import { items, ItemHolder } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { Layer } from "../Classes/Layer.js";
import { actions } from "../Classes/Actions.js";
import { deletePastedItems, pasteAction } from "../Actions/inverseActions.js";
import { imageStorage } from "../Classes/ImageHolder.js";
import { showAllRefresh, showByComponent } from "../Workspace/functionAppearance.js";

///einai lista me items! kai oxi nested!!!
///{"0":{},"1":{}} : this way

function addLayer(itemsToBeCopiedJSON, layerlist) {
    for (var x in layerlist) {
        itemsToBeCopiedJSON['Layers'][layerlist[x]] = {};
        const currentLayer = layers.layerList[layers.layerList.findIndex(el => el._id === layerlist[x])];
        itemsToBeCopiedJSON['Layers'][layerlist[x]] = currentLayer.toString();
        itemsToBeCopiedJSON['localStorage'][currentLayer._id] = imageStorage.get(currentLayer._id + "_LAYER_PREVIEW");
    }
    return;
}

function removeLinksFromJSON(itemsToBeCopiedJSON, deleteLinkIds) {
    var counter = 0;
    while (itemsToBeCopiedJSON['ItemMap']['current'][counter]) {
        var itemObject = JSON.parse(itemsToBeCopiedJSON['ItemMap']['current'][counter]);
        if (itemObject._type === "Component") {
            var itemLinks = JSON.parse(itemObject.links);
            var linkedItems = JSON.parse(itemObject.linkedItems);
            if (!itemLinks)
                continue;
            for (var x in deleteLinkIds) {
                var linkIndex = itemLinks.findIndex(el => el[0] === deleteLinkIds[x] || el[1] === deleteLinkIds[x]);
                if (linkIndex !== -1) {
                    console.log(itemLinks[linkIndex][0]);
                    linkedItems = linkedItems.filter(function(e) {
                        return e !== itemLinks[linkIndex][0];
                    })
                    itemLinks.splice(linkIndex, 1);

                }
            }
            itemObject.links = JSON.stringify(itemLinks);
            itemObject.linkedItems = JSON.stringify(linkedItems);
            itemsToBeCopiedJSON['ItemMap']['current'][counter] = JSON.stringify(itemObject);
            console.log(itemObject);
            console.log(deleteLinkIds);

        }
        counter++;
    }
    return;
}

function copyClickedItems(itemsSelected, itemsToBeCopiedJSON, idsToBeCopied) {
    var currentItemCounter = 0;

    var currentLinkIds = [];
    for (var i = 0; i < idsToBeCopied.length; i++) {
        const currentItem = items.itemList[items.itemList.findIndex(el => el._id == idsToBeCopied[i])];
        //edw o elegxos gia ta links.
        itemsToBeCopiedJSON['ItemMap']['current'][currentItemCounter.toString()] = currentItem.toString();
        if (currentItem.subLayers) {
            addLayer(itemsToBeCopiedJSON, currentItem.subLayers);
        }
        if (currentItem._functions) {
            for (var x in currentItem._functions) {
                const currentFunction = items.itemList[items.itemList.findIndex(el => el._id == currentItem._functions[x])]
                itemsToBeCopiedJSON['ItemMap']['current'][(++currentItemCounter).toString()] = currentFunction.toString();
            }
        }
        if (currentItem.links) {
            Array.from(currentItem.links.entries()).forEach(function(e) {
                currentLinkIds.push(e[1]); // get the value
            });
        }
        currentItemCounter++;
    }
    var filteredLinkIds = currentLinkIds.filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i);
    var deleteLinkIds = currentLinkIds.filter(function(e) {
        return !filteredLinkIds.includes(e);
    });
    removeLinksFromJSON(itemsToBeCopiedJSON, deleteLinkIds);
    for (var x in filteredLinkIds) {
        const currentLink = items.itemList[items.itemList.findIndex(el => el._id == filteredLinkIds[x])]
        itemsToBeCopiedJSON['ItemMap']['current'][(currentItemCounter).toString()] = currentLink.toString();
        currentItemCounter++;
    }
    return;
}

function copyRest(itemsToBeCopiedJSON) {
    for (var currentLayerId in itemsToBeCopiedJSON['Layers']) {
        itemsToBeCopiedJSON['ItemMap'][currentLayerId] = {};
        var layerItemCounter = 0;
        const currentItemList = layers.itemMap.get(currentLayerId).itemList;
        for (var currentItemIndex in currentItemList) {
            itemsToBeCopiedJSON['ItemMap'][currentLayerId][(layerItemCounter).toString()] = currentItemList[currentItemIndex].toString();
            layerItemCounter++;
            if (currentItemList[currentItemIndex].subLayers) {
                addLayer(itemsToBeCopiedJSON, currentItemList[currentItemIndex].subLayers);
            }
        }
    }
}

function copyComponent(notClipboard, itemArgs) {
    var idsToBeCopied, itemsSelected;
    if (!notClipboard) {
        idsToBeCopied = getSelectedIds();
        itemsSelected = getSelectedItems();
    } else {
        idsToBeCopied = itemArgs[0];
        itemsSelected = itemArgs[1];
    }

    var itemsToBeCopiedJSON = {};
    itemsToBeCopiedJSON['Layers'] = {};
    itemsToBeCopiedJSON['ItemMap'] = {};
    itemsToBeCopiedJSON['ItemMap']['current'] = {};
    itemsToBeCopiedJSON['localStorage'] = {};
    //epipedo relative0
    copyClickedItems(itemsSelected, itemsToBeCopiedJSON, idsToBeCopied);
    //ta ypoloipa ypo-epipeda
    copyRest(itemsToBeCopiedJSON);
    var totalStr = JSON.stringify(itemsToBeCopiedJSON);
    if (!notClipboard)
        navigator.clipboard.writeText(totalStr);
    return totalStr;
}

function pasteLayerItems(layerIndex, itemsJSON) {
    console.log(layerIndex);
    for (var x in itemsJSON['ItemMap'][layerIndex]) {
        const item = new Item(itemsJSON['ItemMap'][layerIndex][x]);
    }
    return;
}

function pasteFromStr(result) {
    const currentLayerId = layers.selectedLayer._id;
    var pastingItemsJSON = JSON.parse(result);
    console.log(pastingItemsJSON);
    pasteLayerItems('current', pastingItemsJSON); //0 epipedo
    var firstFlag = true;
    for (var x in pastingItemsJSON['Layers']) {
        var objectLayer = JSON.parse(pastingItemsJSON['Layers'][x]);
        if (firstFlag) {
            firstFlag = false;
            objectLayer.parentId = currentLayerId;
        }
        var l = new Layer("", "", "", objectLayer, 1);
        layers.add(l);
        layers.changeLayer(l._id);
        pasteLayerItems(l._id, pastingItemsJSON);
        layers.changeLayer(currentLayerId);
        console.log('-------------------------------------');
    }
    //load pasted localStorage 
    for (var x in pastingItemsJSON['localStorage']) {
        console.log("x" + ' ' + x);
        imageStorage.save(x + "_LAYER_PREVIEW", pastingItemsJSON['localStorage'][x]);
    }
}

async function pasteComponent() {
    //TODO: χρειάζεται πολλή προσοχή το πρώτο από τα υπο-λεϊερς
    const result = await navigator.clipboard.readText();
    try {
        var pastingItemsJSON = JSON.parse(result);
        actions.saveCommand(pasteAction, deletePastedItems, result, "");
        pasteFromStr(result);
        if (document.getElementById('all').checked) {
            showAllRefresh();
        } else {
            showByComponent();
        }
    } catch (error) {
        console.log('Not a valid item.');
    }
    return;
}


export { copyComponent, pasteComponent, pasteFromStr };