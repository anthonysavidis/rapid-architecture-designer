import { moveItem } from "../Item/edit.js";
import { items, itemFromListToObject } from "../Classes/ItemArray.js";
import { getSelectedIds, cancelSelection } from "../Item/selectComponent.js";
import { cancelFunctionSelection, changeFunctionSelectState } from "../Item/selectFunction.js";
import { linedraw } from "../Item/createLine.js"
import { layers } from "./LayerHolder.js";
import { Layer } from "./Layer.js";
import { addToArchitectureList } from "../Layers/Tree.js";
import { addResize, autoResize } from "../Item/resize.js";
import { actions } from "./Actions.js";
import { setSpecificFunction, resetSpecificFunction } from "../Actions/inverseFunctionsActions.js";
import { cancelSelectedLinks } from "../Item/selectLink.js";
import { addInfoButton, renderInfoButton } from "../HtmlElements/componentInfo.js";
import { cropName, produceDoubleClickEditingName } from "../HtmlElements/doubleClickEditing.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { closeTooltip, produceTooltip } from "../HtmlElements/infoTooltip.js";
import { initializeTab } from "../UpTab/tabAppearance/tabInitializer.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { produceContextMenu } from "../HtmlElements/functionsContextMenu.js";

class Item {

    constructComponent() {
        this.links = new Map();
        this.moreInfo = "More info not added.";
        this.subLayers = [];
        this.linkedItems = [];
        this.spawnComponent();
        this._functions = [];
        var myId = this._id;
        $("#" + this._id).droppable({
            drop: function(event, ui) {
                var functionId = ui.draggable[0].id;
                items.setFunctionToItem(myId, functionId);

            }
        });

    }
    constructFunction() {
        this.x;
        this.y;
        this.owners = [];
        this.spawnFunction();
        var myId = this._id;
        var tx = this.x;
        var ty = this.y;
        document.getElementById(myId).style.left = tx + "px";
        document.getElementById(myId).style.top = ty + items.functionCounter * 40 + "px";
        items.functionCounter++;
    }
    constructLink() {
        var linkedIds = getSelectedIds();
        this.idComponent1 = linkedIds[0];
        this.idComponent2 = linkedIds[1];
        this.spawnLink();
    }

    generateItemId() {
        var id = Math.floor(Math.random() * (1000000 - 10000) + 10000);
        while (items.idList.indexOf(id) !== -1) {
            id = Math.floor(Math.random() * (1000000 - 10000) + 10000);
        }
        return id;
    }
    spawnComponent() {
        var str = "<div droppable=\"true\" class=\"component\" id=\"" + this._id + "\"><p style=\"text-align:center;\" id=\"" + this._id + "name\">" + this._name + "</p></div>";
        var div = document.createElement("div");
        div.innerHTML = str;
        div.id = this._id + "external";

        // div.style.transition = "width 1s, height 1s, transform 1s";
        document.getElementById(layers.selectedLayer._id).appendChild(div);
        renderInfoButton(this._id);
        addResize(this._id);
        moveItem(this._id);
        this.domElement = div;
        var editId = this._id;
        document.getElementById(this._id + "name").addEventListener("dblclick", function() {
            produceDoubleClickEditingName(editId);
            closeTooltip(editId);
        });
        this.domElement.ondragover = (event) => {
            event.preventDefault();
        }

        this.domElement.ondrop = (event) => {
            var functionId = event.dataTransfer.getData("text");
            if (!this._functions.includes(functionId)) {
                var hasError = items.setFunctionToItem(this._id, functionId);
                if (hasError === -1)
                    return;
                var settingFunction = items.itemList[items.itemList.findIndex((e) => e._id === functionId)];

                // console.log("setted");
                // var updatingMessage = settingFunction._name + " was setted in " + this._name + ".";
                // produceBox("updating", updatingMessage, null);
                // var itemList = [settingFunction, this];
                var funcComp = [settingFunction, this];
                var str = itemFromListToObject(funcComp);
                actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");
                // var str = '{"0":"{' + settingFunction.toString() + '}","1":"{' + this.toString() + '}"}'
                // actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");
            } else {
                alert("THIS FUNCTION ALREADY EXISTS IN COMPONENT!");
            }

            event.preventDefault();
        }
        this.domElement.ondragstart = (ev) => {
            console.log("dragStart");
            ev.dataTransfer.setData("text/plain", ev.target.id);
        }

    }
    spawnLink() {
        var rec1 = document.getElementById(this.idComponent1).getBoundingClientRect(); //--
        var rec2 = document.getElementById(this.idComponent2).getBoundingClientRect(); //--
        this.domElement = linedraw(this._id, this.linkState, this._name, rec1, rec2);
        items.addLink(this._id, this.idComponent1, this.idComponent2);
    }
    spawnLoadedLink() {
        var rec1 = document.getElementById(this.idComponent1).getBoundingClientRect(); //--
        var rec2 = document.getElementById(this.idComponent2).getBoundingClientRect(); //--
        this.domElement = linedraw(this._id, this.linkState, this._name, rec1, rec2);
    }
    spawnFunction() {
        var str = "<div draggable=\"true\" class=\"function\" id=\"" + this._id + "\"><div id=\"" + this._id + "ficon\" class=\"ficon\"></div><div class=\"fName\" id=\"" + this._id + "name\">" + this._name + "</div></div>";
        var div = document.createElement("div");
        div.innerHTML = str;
        div.id = this._id + 'external';
        document.getElementById(layers.selectedLayer._id + "functions").appendChild(div);
        this.x = document.getElementById(this._id).getBoundingClientRect().left;
        this.y = document.getElementById(this._id).getBoundingClientRect().top;
        // console.log("x: "+this.x+" y:"+this.y);
        // console.log(document.getElementById(this._id).style);
        this.domElement = div;
        const editId = this._id;
        document.getElementById(this._id + "name").style.outline = 0 + "px";
        document.getElementById(this._id + "name").onblur = (function() {
            items.itemList[items.itemList.findIndex(el => el._id === editId)]._name = this.innerText;
        });
        changeFunctionSelectState(this._id);
        // document.getElementById(this._id).addEventListener("dblclick", function() {
        //     var index = items.itemList.findIndex(((element) => element._id === editId));
        // });
        document.getElementById(this._id + "ficon").addEventListener("click", function(ev) {
            ev.preventDefault();
            cancelFunctionSelection();
            produceTooltip(ev.clientX, ev.clientY, "", editId);
            document.getElementById(editId).className = "selectedFunction";
        });
        document.getElementById(this._id + "name").addEventListener("dblclick", function() {
            produceDoubleClickEditingName(editId);
            closeTooltip(editId);
        });
        document.getElementById(this._id).addEventListener("contextmenu", function(ev) {
            ev.preventDefault();
            if (document.getElementsByClassName("context-menu")[0])
                document.getElementsByClassName("context-menu")[0].remove();

            produceContextMenu(editId, ev.clientX, ev.clientY);
        })
        this.domElement.ondragstart = (ev) => {
            cancelSelection();
            cancelSelectedLinks(ev, 1);
            initializeTab(constantNames["functionsTab"]["tabName"], "functionTab");
            // console.log("dragStart");
            ev.dataTransfer.setData("text/plain", ev.target.id);
        }
    }
    deleteLink(deletedItemId) {
        var deletedLineId = this.links.get(deletedItemId);
        var deleteFun = (element) => element == deletedItemId;
        var deleteLinkIndex = this.linkedItems.findIndex(deleteFun);
        this.linkedItems.splice(deleteLinkIndex, 1);
        this.links.delete(deletedItemId);
        if (document.getElementById(deletedLineId)) {
            document.getElementById(deletedLineId).remove();
            // document.getElementById(deletedLineId + 'point1').remove();
            // document.getElementById(deletedLineId + 'point2').remove();
            items.deleteFromLists(deletedLineId);
        }
    }

    isLinked(itemId) {
            var getItemFun = (element) => element === itemId;
            var res = this.linkedItems.findIndex(getItemFun);
            if (res != -1)
                return true;
            return false;
        }
        // domElement;
    updateDomName(newName) {
        document.getElementById(this._id + "name").innerText = (this._type === "Function") ? this._name : newName;
    }
    constructor(type, flag) {
        this._type = type;
        this.domElement = null;
        this._description = constantNames["emptyNames"]["description"];
        this.moreInfo = constantNames["emptyNames"]['info'];
        if (type === "Component") {
            this._id = this.generateItemId().toString();
            this._name = constantNames["emptyNames"]["component"];
            this.constructComponent();
            this.updateBoundingRec();
        } else if (type === "Link") {
            this._id = this.generateItemId().toString();
            this._name = constantNames["emptyNames"]["line"];
            this.linkState = "";
            this.constructLink();
        } else if (type === "Function") {
            this._id = this.generateItemId().toString();
            this._name = constantNames["emptyNames"]["function"];
            this.constructFunction();
        } else {
            this._toObject(type); //type is the object in string form
            if (!flag) {
                items.add(this);
                items.updateNameAndDescription(this._id, this._name, this._description);
            }
            this._type === "Component" ? renderInfoButton(this._id) : 1;
            return;
        }
        items.add(this);
    }

    setFunction(fid) {
        if (this._functions.includes(fid))
            return;
        this._functions.push(fid);
        var fIndex = items.itemList.findIndex(((element) => element._id === fid));
        items.itemList[fIndex].owners.push(this._id);
        var updatingMessage = items.itemList[fIndex]._name + " was setted in " + this._name + ".";
        produceBox("updating", updatingMessage, null);
        return;
    }

    deleteFunction(fid) {
        const itemListIndex = this._functions.findIndex((element) => element === fid);
        if (itemListIndex > -1) {
            this._functions.splice(itemListIndex, 1);
        }
        return;
    }
    deleteOwner(id) {
        const itemListIndex = this.owners.findIndex((element) => element === id);
        if (itemListIndex > -1) {
            this.owners.splice(itemListIndex, 1);
        }
        return;
    }

    updateBoundingRec() {
        this.boundingRec = document.getElementById(this._id).getBoundingClientRect();
        bRecs.updateBoundingRec(layers.selectedLayer._id, this._id, this.boundingRec);
        return;
    }

    toString() {
        var str = '{';
        var fcounter = 0,
            lcounter = 0;
        var itemJSON = {};
        for (var x in this) {
            if (x === "domElement") {
                itemJSON["class"] = this._type.toLowerCase();
            } else if (x === "boundingRec") {
                itemJSON["boundingRec"] = this.boundingRec;
            } else if (x === "links") {
                var mapStr = JSON.stringify(Array.from(this.links.entries()));
                itemJSON[x.toString()] = mapStr;
            } else if (x === "_functions" && this._functions) {
                itemJSON["_functions"] = {}
                if (!this._functions[0]) {
                    itemJSON["_functions"] = "";
                    continue;
                }
                for (var x in this._functions) {
                    itemJSON["_functions"][fcounter.toString()] = this._functions[x];
                    fcounter += 1;
                }
            } else if (x === "subLayers" && this.subLayers) {
                itemJSON["subLayers"] = {}
                if (!this.subLayers[0]) {
                    itemJSON["subLayers"] = "";
                    continue;
                }
                for (var x in this.subLayers) {
                    itemJSON["subLayers"][lcounter.toString()] = this.subLayers[x];
                    lcounter += 1;
                }
            } else if (x === "linkedItems") {
                itemJSON["linkedItems"] = JSON.stringify(this.linkedItems);
            } else {
                itemJSON[x.toString()] = this[x].toString();
            }
        }
        var result = "" + JSON.stringify(itemJSON) + "";
        return result;
    }

    fixPositionAndDetails(itemObject, needsUpdate) {
        this._name = itemObject._name;
        this._description = itemObject._description;
        // fixing position and size.
        this.boundingRec = itemObject.boundingRec;
        if (needsUpdate)
            items.updateNameAndDescription(this._id, this._name, this._description);
        document.getElementById(this._id).style.top = itemObject.boundingRec.top + "px";
        document.getElementById(this._id).style.left = itemObject.boundingRec.left + "px";
        document.getElementById(this._id).style.width = itemObject.boundingRec.width + "px";
        document.getElementById(this._id).style.height = itemObject.boundingRec.height + "px";
    }

    toObject(str) {
        var itemObject = JSON.parse(str);
        return itemObject;
    }
    _toObject(str) {
        var itemObject = JSON.parse(str);
        const type = itemObject.class;
        this._id = itemObject._id;
        this._name = itemObject._name;
        this._description = itemObject._description;

        if (type === "component" || itemObject._type === "Component") {
            this.constructComponent();
            this._type = "Component";
            this.linkedItems = JSON.parse(itemObject.linkedItems);
            this.fixPositionAndDetails(itemObject, 0);
            //console.log(this.boundingRec);
            // for(var i=0;i<itemObject._functions.length)
            if (itemObject._functions) {
                var functionList = [];
                for (var x in itemObject._functions) {
                    // if (typeof itemObject._functions[x] !== "string")
                    //     functionList.push(itemObject._functions[x]._id);
                    // else
                    functionList.push(itemObject._functions[x]);
                }
                this._functions = functionList;
            }
            if (itemObject.linkedItems) {
                this.links = new Map(JSON.parse(itemObject.links));
                var itr = this.links.keys();
                var linkIds = [];
                for (var i = 0; i < this.links.size; i++) {
                    linkIds.push(itr.next().value);
                }
            }
            if (itemObject.subLayers) {
                this.subLayers.push(itemObject.subLayers[0]);
            }
            this.linkedItems = [...new Set(linkIds)];
        } else if (type === "link" || itemObject._type === "Link") {
            this._type = "Link";
            this.idComponent1 = itemObject.idComponent1;
            this.idComponent2 = itemObject.idComponent2;
            this.linkState = !(itemObject.linkState) ? "" : itemObject.linkState; //compatible with older versions..
            // items.addLink(this._id,this.idComponent1,this.idComponent2);
            // this.spawnLoadedLink();
            this.spawnLink();
        } else if (type === "function" || itemObject._type === "Function") {
            this.constructFunction();
            this._type = "Function";
            this.owners = itemObject.owners.split(",");
            if (this.owners[0] === "")
                this.owners = [];
        }
    }

    addSubLayer(layerId) {
        this.subLayers.push(layerId);
    }
    isSubLayer(layerId) {
        return this.subLayers.find((e) => e === layerId);
    }
    removeSubLayer(id) {
        const index = this.subLayers.indexOf(id);
        if (index > -1) {
            this.subLayers.splice(index, 1);
        }
        return;
    }

}

function getAllObjectsString(counter, objectList) {
    var totalStr = "";
    for (let i = 0; i < objectList.length; i++) {
        const index = items.itemList.findIndex((e) => e._id === objectList[i]);
        totalStr += "\"" + counter + "\":" + items.itemList[index].toString() + ",";
        counter++;
    }
    totalStr = totalStr.slice(0, -1);
    return totalStr;
}

function getAllLayersString(counter, objectList) {
    var totalStr = "";
    for (let i = 0; i < objectList.length; i++) {
        const index = layers.layerList.findIndex((e) => e._id === objectList[i]);
        totalStr += "\"" + counter + "\":" + layers.layerList[index].toString() + ",";
        counter++;
    }
    totalStr = totalStr.slice(0, -1);
    return totalStr;
}
export { Item };