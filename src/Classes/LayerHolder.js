import { renderLine } from "../Item/createLine.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { updateLayerInfoBox } from "../Layers/layerInfoFunctions.js";
import {
  restorePreviewImages,
  savePreviewImages,
} from "../Layers/Storage/localStorageRetrieval.js";
import { actionsOfNextLayer } from "../Layers/switchActions.js";
import {
  clearTree,
  addToArchitectureList,
  updateTree,
} from "../Layers/Tree.js";
import { gridState, gridTurnOn, snappingOn, snappingState } from "../UpTab/editTab.js";
import {
  setUpFunctionDisplayListeners,
  showAll,
} from "../Workspace/functionAppearance.js";
import { macroURCallBack } from "../Workspace/macroDetection.js";
import { hideCurrentSlider, showNextSlider } from "../Workspace/zoomSlider.js";
import { imageStorage } from "./ImageHolder.js";
import { InstanceGenerator } from "./InstanceCreator.js";
import { Item } from "./Item.js";
import { itemFromListToObject, ItemHolder } from "./ItemArray.js";
import { items, setItems } from "./ItemArray.js";
import { Layer } from "./Layer.js";

class LayerHolder {
  constructor(str) {
    this.layerList = [];
    this.idList = [];
    this.itemMap = new Map();
    this.selectedLayer = null;
    if (str) {
      this.toObject(str);
      setLayers(this);
      updateLayerInfoBox();
      if (gridState === "on")
        gridTurnOn();
      if (snappingState === "on")
        snappingOn();
    }
  }
  add(layer) {
    this.layerList.push(layer);
    this.idList.push(layer._id);
    this.itemMap.set(layer._id, new ItemHolder());
    document.getElementById("main").appendChild(layer.domElement);
    document.getElementById("functionArea").appendChild(layer.domFunctions);
    InstanceGenerator.createWorkspace(layer._id);
    document.getElementById(layer._id).style.width = document.getElementById("main").getBoundingClientRect().width + 250 + "px";
  }
  doesExist(id) {
    return this.idList.findIndex((el) => el === id) === -1 ? false : true;
  }
  addObject(obj) {
    var l = new Layer(obj.name, obj.parentId, obj.componentId);
  }
  selectLayer(id) {
    if (this.selectedLayer) {
      this.selectedLayer.domElement.style.display = "none";
      this.selectedLayer.domFunctions.style.display = "none";
    }
    var index = this.layerList.findIndex((element) => element._id === id);
    this.selectedLayer = this.layerList[index];
    this.selectedLayer.domElement.style.display = "block";
    this.selectedLayer.domFunctions.style.display = "block";
    // if(document.getElementById(id))
  }
  deleteLayer(id) {
    var index = this.layerList.findIndex((el) => el._id === id);
    var itemId = this.layerList[index].componentId;
    var itemIndex = this.itemMap.get(this.layerList[index].parentId).itemList.findIndex((el) => el._id === itemId);
    var layerItems = this.itemMap.get(this.layerList[index].parentId);
    layerItems.itemList[itemIndex].subLayers.splice(layerItems.itemList[itemIndex].subLayers.indexOf(id), 1);
    const currentlySelectedId = this.selectedLayer._id;
    this.changeLayer(id);
    this.itemMap.get(id).clear();
    this.itemMap.delete(id);

    this.changeLayer(currentlySelectedId);
    if (this.selectedLayer._id === id) {
      this.changeLayer(this.layerList[0]._id);
    }

    this.layerList.splice(index, 1);
    this.idList.splice(index, 1); //will be the same index here

    imageStorage.remove(id + "_LAYER_PREVIEW");
    document.getElementById(id).remove();
    document.getElementById(id + "functions").remove();
    updateTree();
    return;
  }

  saveItems() {
    if (this.selectedLayer) this.itemMap.set(this.selectedLayer._id, items);
  }

  getItems(id) {
    return this.itemMap.get(id);
  }

  changeLayer(id) {
    //palia items save ...
    hideCurrentSlider();
    cancelSelection();
    this.saveItems();
    this.selectLayer(id);
    this.bindItemsToLayer(id);
    actionsOfNextLayer(id);
    InstanceGenerator.clickWorkspace();
    showNextSlider(id);
  }
  bindItemsToLayer(id) {
    setItems(this.itemMap.get(id));
  }
  //For load and save....
  //TODO....
  getItemMapString() {
    var itemMapStr = "{";
    this.itemMap.forEach(function (value, key) {
      itemMapStr += '"' + key + '" : ' + value.toString() + ",";
    });
    itemMapStr = itemMapStr.slice(0, -1);
    itemMapStr += "}";
    return itemMapStr;
  }

  toString() {
    // this.layerList = [];
    // this.idList = [];
    // this.itemMap = new Map();
    // this.selectedLayer = null;
    var totalStr = "{";
    for (var x in this) {
      if (x === "itemMap") {
        // var mapStr = JSON.stringify(Array.from(this.itemMap.entries()));
        totalStr += '"' + x.toString() + '":' + this.getItemMapString() + " ,";
      } else if (x === "selectedLayer") {
        totalStr += '"' + x + '":' + this[x].toString() + " ,";
      } else if (x === "layerList") {
        totalStr += '"' + x + '":' + itemFromListToObject(this[x]) + " ,";
      } else {
        totalStr += '"' + x + '":' + JSON.stringify(this[x]) + " ,";
      }
    }
    totalStr += '"localStorageInstance":' + savePreviewImages(); // totalStr.slice(0, -1);
    totalStr += "}";
    return totalStr;
  }

  produceTree() {
    clearTree();
    for (var i = 0; i < layers.layerList.length; i++) {
      addToArchitectureList(
        layers.layerList[i]._id,
        layers.layerList[i]._name,
        layers.layerList[i].parentId,
        layers.layerList[i].componentId
      );
    }
  }

  toObject(str) {
    clearTree();
    var layerObject = JSON.parse(str);
    setLayers(this);
    for (var i in layerObject["layerList"]) {
      layerObject.layerList[i].setOfItems = layerObject.itemMap[layerObject.layerList[i]._id];
      var l = new Layer("", -1, -1, layerObject.layerList[i]);
      InstanceGenerator.turnOffGrid(l._id);
      InstanceGenerator.diagramMap[l._id].scroll("pixel", "right");
      // console.log('loop1');
    }

    var arr = layers.idList.filter((c, index) => {
      return layers.idList.indexOf(c) === index;
    });
    layers.idList = arr;
    // var layersArr = [];
    // layers.layerList.forEach((c) => {
    //   if (layersArr.findIndex((el) => el._id === c._id) === -1) {
    //     layersArr.push(c);
    //   }
    // });
    // layers.layerList = layersArr;

    document.getElementById("main").innerHTML = "";
    for (var i = 0; i < layers.layerList.length; i++) {
      document.getElementById("main").appendChild(layers.layerList[i].domElement);
      var layerId = layers.layerList[i]._id;
      var children = [].slice.call(document.getElementById(layerId).getElementsByTagName("*"), 0);
      const seenIDs = {};
      for (var x in children) {
        var childsId = children[x].getAttribute("id");
        if (seenIDs[childsId]) {
          children[x].remove();
        } else {
          seenIDs[childsId] = true;
        }
      }
    }
    layers.produceTree();
    layers.changeLayer(layers.layerList[0]._id);
    setItems(layers.itemMap.get(layers.layerList[0]._id));
    restorePreviewImages(layerObject["localStorageInstance"]);
    const initialLayerId = this.selectedLayer._id;
    for (var x in this.layerList) {
      // takeScreenshot(this.layerList[x]._id);
      document.getElementById("main").appendChild(InstanceGenerator.zoomSliderMap[this.layerList[x]._id]._sliderDiv);
      InstanceGenerator.zoomSliderMap[this.layerList[x]._id]._sliderDiv.style.display = "none";
      // this.changeLayer(this.layerList[x]._id);
    }
    this.changeLayer(initialLayerId);
  }
}

var layers = new LayerHolder();

function setLayers(lh) {
  layers = null;
  layers = lh;
}

function createFirstLayer() {
  var initial = new Layer("Initial", "#", -1);
  layers.changeLayer(initial._id);
  setUpFunctionDisplayListeners();
}

function applyToEachComponent(callBack) {
  const currentLayerId = layers.selectedLayer._id;
  for (var x in layers.layerList) {
    layers.changeLayer(layers.layerList[x]._id);
    const layerItems = layers.itemMap
      .get(layers.layerList[x]._id)
      .itemList.filter((el) => el._type === "Component");
    layerItems.forEach((el) => {
      callBack(el);
    });
    // for (var y in layerItems.itemList) {
    //     if (layerItems.itemList[y]._type === "Component") {
    //         callBack(layerItems.itemList[y]);
    //     }
    // }
  }
  layers.changeLayer(currentLayerId);
  return;
}

function applyToEachOperation(callBack) {
  const currentLayerId = layers.selectedLayer._id;
  for (var x in layers.layerList) {
    layers.changeLayer(layers.layerList[x]._id);
    const layerItems = layers.itemMap
      .get(layers.layerList[x]._id)
      .itemList.filter((el) => el._type === "Function");
    layerItems.forEach((el) => {
      callBack(el);
    });
  }
  layers.changeLayer(currentLayerId);
  return;
}

function refreshAllLinks() {
  const currentLayerId = layers.selectedLayer._id;
  for (var x in layers.layerList) {
    layers.changeLayer(layers.layerList[x]._id);
    const layerItems = layers.itemMap.get(layers.layerList[x]._id);
    for (var y in layerItems.itemList) {
      if (layerItems.itemList[y]._type === "Component") {
        layerItems.itemList[y].updateBoundingRec();
        if (layerItems.itemList[y].links) {
          renderLine(layerItems.itemList[y]._id);
        }
      }
    }
  }
  layers.changeLayer(currentLayerId);
  return;
}

function getAllBoundingRectMap() {
  var brectsJSON = {};
  const callBack = (component) => {
    brectsJSON[component._id] = InstanceGenerator.getNodeBoundingRect(component._id); //document.getElementById(component._id).getBoundingClientRect();
  };
  applyToEachComponent(callBack);
  return brectsJSON;
}

function setBoundingRectMap(brectsJSON) {
  const callBack = (component) => {
    InstanceGenerator.alterNodeDims(component._id, brectsJSON[component._id].width, brectsJSON[component._id].height);
    // document.getElementById(component._id).style.width =
    //   brectsJSON[component._id].width + "px";
    // document.getElementById(component._id).style.height =
    //   brectsJSON[component._id].height + "px";
    // document.getElementById(component._id).style.top =
    //   brectsJSON[component._id].top + "px";
    // document.getElementById(component._id).style.left =
    //   brectsJSON[component._id].left + "px";
  };
  applyToEachComponent(callBack);
}

export {
  layers,
  LayerHolder,
  applyToEachOperation,
  createFirstLayer,
  refreshAllLinks,
  applyToEachComponent,
  setBoundingRectMap,
  getAllBoundingRectMap,
};
