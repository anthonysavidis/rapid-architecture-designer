
import { layers } from "./LayerHolder.js";

import { configStyle } from "./Config.js";

import { addDiagramListener, getLinkContext, getNewWorkspace, initializeLinkTemplate, initializeNodeTemplate, keyDownWorkpaceHandler, setWorkspaceDropListeners } from "../HtmlElements/goWorkspace.js";
import { getAllCssVars } from "./ConfigActions.js";
import { items } from "./ItemArray.js";
import { produceLayersZoomSlider } from "../Workspace/zoomSlider.js";



class InstanceCreator {
  constructor() {
    this.diagramMap = {};
    this.zoomSliderMap = {};
  }
  createComponent(obj) {
    console.log(go.Spot.TopLeft);
    const spawiningPoint = this.diagramMap[layers.selectedLayer._id].transformDocToView(new go.Point(400, 100));
    var objJSON = { "text": obj._name, "key": obj._id, "loc": 500 + " " + 50 };
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
    this.zoomSliderMap[lid] = produceLayersZoomSlider(lid);

  }
  deleteNode(obj) {
    const node = obj;
    var delNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(node.key);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].startTransaction();
    InstanceGenerator.diagramMap[layers.selectedLayer._id].remove(delNode);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].commitTransaction("deleted node");
  }
  alterNodeDims(key, width, height) {
    this.diagramMap[layers.selectedLayer._id].findNodeForKey(key).width = width;
    this.diagramMap[layers.selectedLayer._id].findNodeForKey(key).height = height;
    return;
  }
  getNodeBoundingRect(key) {
    const node = this.diagramMap[layers.selectedLayer._id].findNodeForKey(key);
    const nodeData = node.data;
    // console.log({ width: node.width, height: node.height, top: node.location.y, left: node.location.x });
    return { width: node.width, height: node.height, top: parseInt(nodeData.loc.split(" ")[1]), left: parseInt(nodeData.loc.split(" ")[0]) };
  }
  getComponentsTextBlockDims(key) {

    var n = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(key);
    console.log(n.findObject("COMPONENT_TEXT_BLOCK").naturalBounds);
    const textWidth = n.findObject("COMPONENT_TEXT_BLOCK").naturalBounds.width;
    const textHeight = n.findObject("COMPONENT_TEXT_BLOCK").naturalBounds.height;
    return [textWidth, textHeight];
  }
  deleteLink(linkItem) {
    // InstanceGenerator.diagramMap[layers.selectedLayer._id].model.removeLinkData(this.diagramLink);
    const obj = linkItem.diagramLink;
    // InstanceGenerator.diagramMap[layers.selectedLayer._id].startTransaction();
    InstanceGenerator.diagramMap[layers.selectedLayer._id].model.removeLinkData(obj);
    // console.log("link deleted")
    // InstanceGenerator.diagramMap[layers.selectedLayer._id].commitTransaction("deleted link");
  }
  alterLinkDirection(linkItem, linkState, toId) {

    const link = InstanceGenerator.diagramMap[layers.selectedLayer._id].findLinkForData(linkItem.diagramLink);
    if (linkState === "bidirectional") {
      link.findObject("BACKWARD_ARROW").visible = true;
      link.findObject("TO_ARROW").visible = true;
    }
    else if (linkState === "") {
      link.findObject("BACKWARD_ARROW").visible = false;
      link.findObject("TO_ARROW").visible = false;
    }
    else {
      if (toId === linkItem.idComponent1) {
        items.itemList[items.itemList.findIndex(el => el._id === linkItem._id)].linkState = "point1";

        link.findObject("BACKWARD_ARROW").visible = true;
        link.findObject("TO_ARROW").visible = false;
      } else {
        items.itemList[items.itemList.findIndex(el => el._id === linkItem._id)].linkState = "point2";

        link.findObject("BACKWARD_ARROW").visible = false;
        link.findObject("TO_ARROW").visible = true;

      }
    }

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
  clickWorkspace() {
    var robot = new Robot(InstanceGenerator.diagramMap[layers.selectedLayer._id]);

    var loc = { x: 0, y: 0 };

    // click on Lambda
    robot.mouseDown(loc.x + 10, loc.y + 10, 0, {});
    robot.mouseUp(loc.x + 10, loc.y + 10, 100, {});

    // Clicking is just a sequence of input events.
    // There is no command in CommandHandler for such a basic gesture.
  }
  applyCurrentComponentSettings(lid, nodeData) {
    // const css = getAllCssVars();
    for (var i in configStyle.configJSON) {
      // var r = document.querySelector(':root');
      // var rs = getComputedStyle(r);
      // const val = rs.getPropertyValue("--"+configStyle.configJSON[i]);
      const val = configStyle.configJSON[i];
      const varName = "--" + i;
      if (varName.includes("component")) {
        if (varName === "--componentFontStyle" || varName === "--componentTextFamily" || varName === "--componentFontWeight")
          continue;
        if (varName === "--componentTextSize") {
          const font = configStyle.configJSON["componentFontStyle"] + " normal " + configStyle.configJSON["componentFontWeight"] + " " + configStyle.configJSON["componentTextSize"] + " " + configStyle.configJSON["componentTextFamily"];
          // this.diagramMap[layers.selectedLayer._id].findNodeForKey(nodeData.key).font = font;
          this.modifySingleNodeProperty(lid, nodeData, "componentFont", font);
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
            this.modifySingleNodeProperty(lid, nodeData, varName.slice(2), configStyle.configJSON[varName.slice(2)]);
          }
        }
      }
      if (varName.includes("subcomponent")) {
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
  modifyLinkProperty(modifiedProperty, value) {
    for (var l in layers.layerList) {
      const lid = layers.layerList[l]._id;
      const linkArray = this.diagramMap[lid].model.linkDataArray;
      for (var linkIndex in linkArray)
        this.diagramMap[lid].model.setDataProperty(linkArray[linkIndex], modifiedProperty, value);
    } //FOR CONFIG PART}

  }

  modifyDescriptionProperty(modifiedProperty, value) {
    for (var l in layers.layerList) {
      const lid = layers.layerList[l]._id;
      this.diagramMap[lid].nodes.each((n) => {
        if (n.findObject("DESCRIPTION_TEXT0")) {
          n.findObject("DESCRIPTION_TEXT0").stroke = value;
        }
      });
    }
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