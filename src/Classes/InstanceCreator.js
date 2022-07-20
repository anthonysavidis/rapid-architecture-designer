import { moveItem } from "../Item/edit.js";
import { items, itemFromListToObject } from "../Classes/ItemArray.js";
import {
  getSelectedIds,
  cancelSelection,
  changeSelectState,
  getSelectedItems,
} from "../Item/selectComponent.js";
import {
  cancelFunctionSelection,
  changeFunctionSelectState,
  keepOnlyLastSelectedFunction,
} from "../Item/selectFunction.js";
import { linedraw, renderLine } from "../Item/createLine.js";
import { layers } from "./LayerHolder.js";
import { Layer } from "./Layer.js";
import { addResize } from "../Item/resize.js";
import { actions } from "./Actions.js";
import {
  setSpecificFunction,
  resetSpecificFunction,
} from "../Actions/inverseFunctionsActions.js";
import { cancelSelectedLinks } from "../Item/selectLink.js";
import {
  addInfoButton,
  renderInfoButton,
} from "../HtmlElements/componentInfo.js";
import {
  cropName,
  preventDraggingOfCname,
  produceDoubleClickEditingName,
} from "../HtmlElements/doubleClickEditing.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { closeTooltip, produceTooltip } from "../HtmlElements/infoTooltip.js";
import { initializeTab } from "../UpTab/tabAppearance/tabInitializer.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { produceContextMenu } from "../HtmlElements/functionsContextMenu.js";
import {
  showAll,
  showByComponent,
  showOwner,
} from "../Workspace/functionAppearance.js";
import { moveCallBack } from "../Input/functonsContextMenuCallbacks.js";
import { functionColors } from "../config/functionStyle.js";
import { closeTheTooltip } from "../Input/clickInputObserver.js";
import {
  appearComponentButtons,
  appearFunctionButtons,
} from "../UpTab/tabAppearance/buttonsVisibility.js";
import { canMove } from "../Item/createComponent.js";
import {
  moveAllNext,
  moveAllPrev,
  moveNext,
  movePrev,
} from "../Actions/inverseMovement.js";
import { deleteOperationWithTrashBin } from "../UpTab/functionTab.js";
import { setInitialSize } from "../Item/autoResize.js";
import { configStyle } from "./Config.js";
import { turnOnDescription } from "../HtmlElements/extendingComponent.js";
import { deleteMultWithTrashBin } from "../Workspace/trashBin.js";
import { updateLayerInfoBox } from "../Layers/layerInfoFunctions.js";
import { measureSelectedView } from "../Workspace/selectedOperationsHandler.js";
import { produceComponentContextMenu } from "../HtmlElements/componentContextMenu.js";
import { panningState } from "../UpTab/editTab.js";
import { disablePanning, enablePanning } from "../Workspace/zoom.js";
import { addDiagramListener, getLinkContext, getNewWorkspace, initializeLinkTemplate, initializeNodeTemplate, setWorkspaceDropListeners } from "../HtmlElements/goWorkspace.js";


class InstanceCreator {
  constructor() {
    this.diagramMap = {};
  }
  createComponent(obj) {
    const spawiningPoint = this.diagramMap[layers.selectedLayer._id].transformDocToView(new go.Point(400, 100));
    var objJSON = { "text": obj._name, "key": obj._id, "loc": 300 + " " + 50 };
    this.diagramMap[layers.selectedLayer._id].model.addNodeData(objJSON);
    // this.diagramMap[layers.selectedLayer._id].model.setDataProperty(this.diagramMap[layers.selectedLayer._id].model.nodeDataArray[0], "color", "red"); //FOR CONFIG PART
    return objJSON;
  }
  createLink(linkId, fromId, toId, name) {
    var objJSON = { "key": linkId, "from": fromId, "to": toId, "text": name };
    this.diagramMap[layers.selectedLayer._id].model.addLinkData(objJSON);
    return objJSON;
  }
  createLinkLabels() { }

  createWorkspace(lid) {
    console.log('created Workspace')
    this.diagramMap[lid] = getNewWorkspace(lid);

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
}
const InstanceGenerator = new InstanceCreator();

export { InstanceGenerator };
