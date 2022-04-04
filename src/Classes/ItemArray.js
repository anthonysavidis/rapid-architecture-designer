import { Layer } from "./Layer.js";
import { Item } from "./Item.js";
import { renderLine } from "../Item/createLine.js";
import { layers } from "./LayerHolder.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { actions } from "./Actions.js";
import { resetOwner, showAll, showByComponent } from "../Workspace/functionAppearance.js";
import { massiveMove, massiveSet } from "../Actions/inverseFunctionsActions.js";
class ItemHolder {

    constructor(str) {
        this.itemList = [];
        this.idList = [];
        this.functionCounter = 0;
        if (str) {
            this.toObject(str);
        }
    }
    add(it) {
        this.itemList.push(it);
        this.idList.push(it._id);
    }
    delete(deletingItemId) {
        const deleteById = (element) => element._id == deletingItemId;
        const itemListIndex = this.itemList.findIndex(deleteById);
        if (this.itemList[itemListIndex]._type === "Component") {
            var toBeDeletedLinks = this.itemList[itemListIndex].linkedItems;
            var beingDeletedFromFunctions = this.itemList[itemListIndex]._functions;
            var toBeDeletedLayers = this.itemList[itemListIndex].subLayers;
            for (var i = 0; i < toBeDeletedLinks.length; i++) {
                var deleteLinkFun = (element) => element._id == toBeDeletedLinks[i];
                var deleteLinkIndex = this.itemList.findIndex(deleteLinkFun);
                this.itemList[deleteLinkIndex].deleteLink(deletingItemId);
            }
            for (var i = 0; i < beingDeletedFromFunctions.length; i++) {
                var deleteOwnerIndex = this.itemList.findIndex((element) => element._id === beingDeletedFromFunctions[i]);
                this.itemList[deleteOwnerIndex].deleteOwner(deletingItemId);
            }
            for (var i = 0; i < toBeDeletedLayers.length; i++) {
                console.log('deleted ' + toBeDeletedLayers[i]);
                layers.deleteLayer(toBeDeletedLayers[i]);
            }
            bRecs.deleteBoundingRec(layers.selectedLayer._id, deletingItemId);
            //delete sublayers...
        }
        if (this.itemList[itemListIndex]._type === "Function") {
            var ownersDelete = this.itemList[itemListIndex].owners;
            this.functionCounter--;
            for (var i = 0; i < ownersDelete.length; i++) {
                var ownerDeleteIndex = this.itemList.findIndex(((element) => element._id === ownersDelete[i]));
                console.log(ownersDelete + " " + deletingItemId);
                this.itemList[ownerDeleteIndex].deleteFunction(deletingItemId);
            }
            this.itemList[itemListIndex].owners = [];
        }
        this.deleteFromLists(deletingItemId);
        document.getElementById(deletingItemId + 'external').remove();

    }
    updateNameAndDescription(id, newName, newDescription) {
        // console.log('Updating '+id+' with '+newName+' '+newDescription);
        var oldIndex = this.itemList.findIndex(((element) => element._id == id));
        this.itemList[oldIndex]._name = newName;
        this.itemList[oldIndex]._description = newDescription;
        this.itemList[oldIndex].updateDomName(newName);
    }
    addLink(lineId, id1, id2) {
        const matchId1 = (element) => element._id == id1;
        const matchId2 = (element) => element._id == id2;
        var index1 = this.itemList.findIndex(matchId1);
        var index2 = this.itemList.findIndex(matchId2);
        if (!this.itemList[index1].linkedItems.includes(id2)) {
            this.itemList[index1].links.set(id2, lineId);
            this.itemList[index1].linkedItems.push(id2);
        }
        if (!this.itemList[index2].linkedItems.includes(id1)) {
            this.itemList[index2].links.set(id1, lineId);
            this.itemList[index2].linkedItems.push(id1);
        }
    }
    deleteFromLists(deletingItemId) {
        const deleteById = (element) => element._id == deletingItemId;
        const itemListIndex = this.itemList.findIndex(deleteById);
        if (itemListIndex > -1) {
            this.itemList.splice(itemListIndex, 1);
        }
        const deleteIdListIndex = this.idList.indexOf(deletingItemId);
        if (deleteIdListIndex > -1) {
            this.idList.splice(deleteIdListIndex, 1);
        }
    }
    setFunctionToItem(itemId, functionId) {
        const itemListIndex = this.itemList.findIndex(((element) => element._id === itemId));
        var exists = this.itemList[itemListIndex]._functions.includes(functionId); //  findIndex((element) => element.id === this.itemList[functionIndex]._id);
        const settedFunction = this.itemList[this.itemList.findIndex(el => el._id === functionId)];
        var overwrite = 0;
        if (settedFunction.owners[0]) {
            // alert("Operation already attached to component!");
            return 2;
            // const selectedFuncs = getSelectedFunctions();
            // const initialFuncsStr = itemFromListToObject([settedFunction]);
            // for (var x in selectedFuncs) {
            // const funcId = selectedFuncs[x]._id;
            // this.unlinkOwnerFunction(settedFunction.owners[0], settedFunction._id);
            // }
            // this.itemList[itemListIndex].setFunction(functionId);
            // actions.saveCommand(massiveSet, massiveMove1, initialFuncsStr, JSON.stringify(itemId));
        }
        if (!exists) {
            this.itemList[itemListIndex].setFunction(functionId);
        } else {
            alert("FUNCTION EXIST!");
        }
        return;
    }

    unparentFunction(functionId) {
        const itemListIndex = this.itemList.findIndex(((element) => element._id === functionId));
        const c = this.itemList[itemListIndex].owners[0];
        console.log(this.itemList[itemListIndex]);

        if (!c)
            return;
        console.log('unparent ' + functionId);
        this.unlinkOwnerFunction(c, functionId);
        return;
    }

    hasFunction(id, fid) {
        const itemListIndex = this.itemList.findIndex(((element) => element._id === id));
        var exists = this.itemList[itemListIndex]._functions.includes(fid);
        if (exists) {
            return true;
        }
        return false;
    }
    deleteFunctionFromOwner(id, fid) {
        var ownerDeleteIndex = this.itemList.findIndex(((element) => element._id === id));
        this.itemList[ownerDeleteIndex].deleteFunction(fid);
        return;
    }
    deleteOwnerFromFunction(id, fid) {
        var functionDeleteIndex = this.itemList.findIndex(((element) => element._id === fid));
        this.itemList[functionDeleteIndex].deleteOwner(id);
        return;
    }
    unlinkOwnerFunction(id, fid) {
        resetOwner(items.itemList[items.itemList.findIndex((el) => el._id === fid)]);
        this.deleteFunctionFromOwner(id, fid);
        this.deleteOwnerFromFunction(id, fid);
        if (document.getElementById("byComponent").checked)
            showByComponent();
        return;
    }
    compareObjects(originalStr, alteredStr) {
        var original = JSON.parse(originalStr);
        var altered = JSON.parse(alteredStr);
        var isEqualList = false;
        var index = items.itemList.findIndex((el) => el._id === altered._id);
        if (altered._type === "Component" && original._functions) {
            var objectLength = 0;
            for (var x in original._functions) {
                if (original._functions[x])
                    objectLength++;
            }
            isEqualList = (items.itemList[index]._functions.length === objectLength);
        } else if (altered._type === "Function" && original._owners) {
            var objectLength = 0;
            for (var x in original.owners) {
                if (original.owners[x])
                    objectLength++;
            }
            isEqualList = (items.itemList[index].owners.length === objectLength);
        }
        var isEqualName = original._name === items.itemList[index]._name;
        var isEqualDescription = original._description === items.itemList[index]._description;
        return !(isEqualList && isEqualName && isEqualDescription);
    }

    alterObjectsLists(original, altered) {
        var isEqualList = false;
        var index = items.itemList.findIndex((el) => el._id === altered._id);
        if (altered._type === "Component" && original._functions) {
            isEqualList = JSON.stringify(items.itemList[index]._functions) === JSON.stringify(original._functions);
            if (!isEqualList) {
                items.itemList[index]._functions = altered._functions;
            }
        } else if (altered._type === "Function" && original._owners) {
            isEqualList = JSON.stringify(items.itemList[index].owners) === JSON.stringify(original.owners);
            if (!isEqualList) {
                items.itemList[index].owners = altered.owners;
            }
        }
        return index;
    }

    clear() {
        var initLength = this.idList.length
        for (var i = 0; i < initLength; i++) {
            this.delete(this.idList[0]);
        }
    }

    toString() {
        /*
        this.itemList = [];
            this.idList = [];
            this.functionCounter = 0;
        */
        var totalStr = "{";
        totalStr += '\"idList\":\" ' + this.idList + "\",";
        totalStr += '\"functionCounter\":\"' + this.functionCounter + "\",";
        var counter = 0;
        this.itemList.forEach(function(item) {
            totalStr += '\"' + counter + '\":' + item.toString() + ",";
            counter++;
        });

        totalStr = totalStr.slice(0, -1);
        totalStr += "}";
        return totalStr;
    }
    toObject(itemsInStr) {
        this.functionCounter = 0;
        this.idList = [];
        var itemsInJSON = JSON.parse(itemsInStr);
        var allLinks = [];
        var iterator = 0;
        for (var x in itemsInJSON) {
            // console.log(iterator)1
            if (!isNaN(x)) {
                if (itemsInJSON[x]._type === "Link") {
                    allLinks.push(itemsInJSON[x]);
                    continue;
                }
                if (itemsInJSON[x]._type === "Function")
                    this.functionCounter++;
                var tempItem = new Item(JSON.stringify(itemsInJSON[x]), 0);
                // console.log(tempItem);
                this.itemList.push(tempItem);
                this.idList.push(tempItem._id);
            }
            // this.add(te)
            // var index = this.itemList.findIndex((el) => (el._id === tempItem._id));
            // items.itemList[index]._id=itemJson._id;
        }
        for (var i = 0; i < (allLinks.length); i++) {
            var tempItem = new Item(JSON.stringify(allLinks[i]));
            this.add(tempItem);

        }
        // renderLinks();
        //calculate function counter
    }

    getNameFromId(id) {
        return items.itemList[items.itemList.findIndex(el => el._id === id)]._name;
    }
}

function itemFromListToObject(list) {
    var itemListStr = "{";
    for (var i = 0; i < list.length; i++) {
        itemListStr += "\"" + i + "\":" + list[i].toString() + ",";
    }
    itemListStr = itemListStr.slice(0, -1) + "}"
    return itemListStr;
}

function setItems(it) {
    items = it;
    return;
}

var items = new ItemHolder();

export { items, ItemHolder, setItems, itemFromListToObject };