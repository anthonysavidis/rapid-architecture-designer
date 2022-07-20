import { ItemHolder } from "./ItemArray.js";
import { layers } from "./LayerHolder.js";
import { addToArchitectureList } from "../Layers/Tree.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { InstanceGenerator } from "./InstanceCreator.js";

class Layer {
  constructor(name, parentLayerId, componentId, obj, savedFlag) {
    if (!obj) {
      this._id = this.generateLayerId();
      this.parentId = parentLayerId;
      this.componentId = componentId; //may used for breadcrumps
      // this.ancestors = [];
      this._name = name;
      this.setOfItems = new ItemHolder(); //1 layer has 1 setOfItems.
      this.domElement = this.spawnLayer();
      // this.domElement.style.backgroundImage = "linear-gradient(to bottom,#ffffff, rgb(210, 212, 236),40%)";
      this.domFunctions = this.spawnFunctionContainer();
      this.treeObj = addToArchitectureList(
        this._id,
        name,
        parentLayerId,
        this.componentId
      );
      layers.add(this);
    } else {
      this._id = obj._id;
      this.parentId = obj.parentId;
      this.componentId = obj.componentId; //may used for breadcrumps
      // this.ancestors = [];
      this._name = obj._name;
      this.setOfItems = obj.setOfItems; //1 layer has 1 setOfItems.
      this.domElement = this.spawnLayer();
      this.domElement.innerHTML = "";
      this.domFunctions = this.spawnFunctionContainer();
      this.treeObj = addToArchitectureList(this._id, this._name, this.parentId, this.componentId);
      if (!savedFlag) {
        layers.add(this);
        layers.changeLayer(this._id);
        var savedItems = new ItemHolder(JSON.stringify(obj.setOfItems));
        layers.itemMap.delete(this._id);

        // layers.itemMap.set(this._id, savedItems);
      }
    }
    bRecs.insertNewLayer(this._id);
  }
  generateLayerId() {
    var id =
      "L" + Math.floor(Math.random() * (1000000 - 10000) + 10000).toString();
    while (layers.idList.indexOf(id) !== -1) {
      id =
        "L" + Math.floor(Math.random() * (1000000 - 10000) + 10000).toString();
    }
    return id;
  }
  spawnLayer() {
    var newWorkspace = document.createElement("div");
    newWorkspace.id = this._id;
    newWorkspace.className = "workspace";
    newWorkspace.style.display = "none";
    return newWorkspace;
  }
  spawnFunctionContainer() {
    var newFunctionsContainer = document.createElement("div");
    newFunctionsContainer.id = this._id + "functions";
    newFunctionsContainer.style.display = "none";
    return newFunctionsContainer;
  }
  updateLayerName(name) {
    var oldObject = JSON.parse(this.treeObj);
    oldObject.text = name;
    this.treeObj = JSON.stringify(oldObject);
    this._name = name;
    return;
  }

  toString() {
    var str = "{";
    for (var x in this) {
      if (x === "domElement" || x === "domFunctions") {
        continue;
      } else if (x === "setOfItems") {
        // var mapStr = JSON.stringify(Array.from(this.links.entries()));
        str += '"' + x.toString() + '":' + layers.getItems(this._id).toString() + " ,";
      } else if (x === "treeObj") {
        str += '"' + x.toString() + '":' + this.treeObj + " ,";
      } else {
        str += '"' + x.toString() + '":"' + this[x].toString() + '" ,';
      }
    }
    str = str.slice(0, -1);
    str += "}";
    // console.log(str);
    return str;
  }
  toObject(str) {
    /*
        domElement
        domFunction
        setOfItems
        YPOLOIPA STRS
         */
    var layerObject = JSON.parse(str);

    this._id = layerObject["_id"];
    this._name = layerObject["_name"];
    this.componentId = layerObject["componentId"];
    this.parentId = layerObject["parentId"];
    this.domElement = this.spawnLayer();
    this.domFunctions = this.spawnFunctionContainer();
    var layerItemsStr = JSON.stringify(layerObject.setOfItems);
    this.setOfItems = null;
    this.setOfItems = new ItemHolder();
    this.setOfItems.toObject(layerItemsStr);
    console.log("====================================================");
    console.log(this);
    return;
  }
}

function readLayerFile() {
  var file = "http://127.0.0.1:5500/tests/layer.txt";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var l = new Layer("", -1, -10);
        l.toObject(rawFile.responseText);
      }
    }
  };
  rawFile.send(null);
}
export { Layer, readLayerFile };
