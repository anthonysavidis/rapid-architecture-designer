
import { layers } from "./LayerHolder.js";

import { configStyle } from "./Config.js";

import { addDiagramListener, getLinkContext, getNewWorkspace, initializeLinkTemplate, initializeNodeTemplate, keyDownWorkpaceHandler, setWorkspaceDropListeners } from "../HtmlElements/goWorkspace.js";
import { getAllCssVars } from "./ConfigActions.js";



class InstanceCreator {
  constructor() {
    this.diagramMap = {};
  }
  createComponent(obj) {
    const spawiningPoint = this.diagramMap[layers.selectedLayer._id].transformDocToView(new go.Point(400, 100));
    var objJSON = { "text": obj._name, "key": obj._id, "loc": 300 + " " + 50 };
    this.diagramMap[layers.selectedLayer._id].model.addNodeData(objJSON);
    const nodeData = this.diagramMap[layers.selectedLayer._id].findNodeForKey(obj._id).data;
    this.applyCurrentComponentSettings(layers.selectedLayer._id, nodeData);
    return objJSON;
  }
  createLink(linkId, fromId, toId, name) {
    var objJSON = { "key": linkId, "from": fromId, "to": toId, "text": name };
    this.diagramMap[layers.selectedLayer._id].model.addLinkData(objJSON);
    return objJSON;
  }
  createLinkLabels() { }

  createWorkspace(lid) {
    this.diagramMap[lid] = getNewWorkspace(lid);
    this.diagramMap[lid].commandHandler.doKeyDown = () => { keyDownWorkpaceHandler(this.diagramMap[lid]) };
    this.diagramMap[lid].nodeTemplate = initializeNodeTemplate();
    this.diagramMap[lid].linkTemplate = initializeLinkTemplate();
    this.diagramMap[lid].linkTemplate.contextMenu = getLinkContext();
    setWorkspaceDropListeners(lid);
    addDiagramListener(this.diagramMap[lid]);
  }
  deleteNode(obj) {
    const node = obj;
    var delNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(node.key);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].startTransaction();
    InstanceGenerator.diagramMap[layers.selectedLayer._id].remove(delNode);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].commitTransaction("deleted node");
  }

  deleteLink(linkItem) {
    // InstanceGenerator.diagramMap[layers.selectedLayer._id].model.removeLinkData(this.diagramLink);
    const obj = linkItem.diagramLink;
    InstanceGenerator.diagramMap[layers.selectedLayer._id].startTransaction();
    InstanceGenerator.diagramMap[layers.selectedLayer._id].model.removeLinkData(obj);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].commitTransaction("deleted link");
  }

  turnOffGrid(lid) {
    InstanceGenerator.diagramMap[lid].grid.visible = false;

  }
  clickLambda(key) {
    var robot = new Robot(InstanceGenerator.diagramMap[layers.selectedLayer._id]);
    var lambda = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(key);
    if (lambda === null) return;
    var loc = lambda.location;

    // click on Lambda
    robot.mouseDown(loc.x + 10, loc.y + 10, 0, {});
    robot.mouseUp(loc.x + 10, loc.y + 10, 100, {});

    // Clicking is just a sequence of input events.
    // There is no command in CommandHandler for such a basic gesture.
  }

  applyCurrentComponentSettings(lid, nodeData) {
    const css = getAllCssVars();
    for (var i in css) {
      var r = document.querySelector(':root');
      var rs = getComputedStyle(r);
      const val = rs.getPropertyValue(css[i]);
      const varName = css[i];
      if (css[i].includes("component")) {
        if (varName === "--componentTextSize" || varName === "--componentFontStyle" || varName === "--componentTextFamily" || varName === "--componentFontWeight") {
          const font = configStyle.configJSON["componentFontStyle"] + " normal " + configStyle.configJSON["componentFontWeight"] + " " + configStyle.configJSON["componentTextSize"] + " " + configStyle.configJSON["componentTextFamily"];
          this.modifySingleNodeProperty(lid, nodeData, "font", font);
        } else {
          if (varName.includes("componentBorderWidth")) {
            this.modifySingleNodeProperty(lid, nodeData, "componentBorderWidth", parseInt(val.slice(0, -2), 10)); //<-string
          }
          else if (varName.includes("componentTextDecoration")) {
            const finalValue = !(val.includes("none"));
            this.modifySingleNodeProperty(lid, nodeData, "componentTextUnderlined", finalValue);
          }
          else if (varName.includes("SelectedBorderColor")) {
            this.modifySingleNodeProperty(lid, nodeData, "componentSelectedBorderColor", val);
          }
          else {
            const finalValue = val.charAt(0) === " " ? val.slice(1) : val;
            this.modifySingleNodeProperty(lid, nodeData, css[i].slice(2), configStyle.configJSON[varName.slice(2)]);
          }
        }
      }
      if (css[i].includes("subcomponent")) {
        this.modifyExtensionProperty(varName.slice(2), configStyle.configJSON[varName.slice(2)])
      }
    }
  }

  modifySingleNodeProperty(lid, nodeData, modifiedProperty, value) {
    this.diagramMap[lid].model.setDataProperty(nodeData, modifiedProperty, value);
    return;
  }

  modifyNodeProperty(modifiedProperty, value) {
    for (var l in layers.layerList) {
      const lid = layers.layerList[l]._id;
      const nodeArray = this.diagramMap[lid].model.nodeDataArray;
      for (var nodeIndex in nodeArray)
        this.diagramMap[lid].model.setDataProperty(nodeArray[nodeIndex], modifiedProperty, value);
    } //FOR CONFIG PART}

  }

  modifyExtensionProperty(modifiedProperty, value) {
    if (modifiedProperty.includes("subcomponentBackground"))
      for (var l in layers.layerList) {
        const lid = layers.layerList[l]._id;
        this.diagramMap[lid].nodes.each((n) => {
          var subCounter = 0;
          if (n.findObject("SUB_COMPONENT0")) {
            while (n.findObject("SUB_COMPONENT" + subCounter)) {
              n.findObject("SUB_COMPONENT" + subCounter).fill = value;
              subCounter++;
            }
          }
        })
      }
    else
      for (var l in layers.layerList) {
        const lid = layers.layerList[l]._id;
        this.diagramMap[lid].nodes.each((n) => {
          var subCounter = 0;
          if (n.findObject("SUB_COMPONENT_TEXT0")) {
            while (n.findObject("SUB_COMPONENT_TEXT" + subCounter)) {
              n.findObject("SUB_COMPONENT_TEXT" + subCounter).stroke = value;
              subCounter++;
            }
          }
        })
      }
  }
}
const InstanceGenerator = new InstanceCreator();

export { InstanceGenerator };