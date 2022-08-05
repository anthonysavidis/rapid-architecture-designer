import { resetSpecificFunction, setSpecificFunction } from "../Actions/inverseFunctionsActions.js";
import { actions } from "../Classes/Actions.js";
import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { itemFromListToObject, items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { moveCallBack } from "../Input/functonsContextMenuCallbacks.js";
import { appearFunctionButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { forceActivateAll } from "../Workspace/functionAppearance.js";

const functionOnDropOnComponent = (event, componentID) => {
  if (!event || !event.preventDefault)
    return;
  event.preventDefault();
  const obj = items.itemList[items.itemList.findIndex(el => el._id === componentID)];
  console.log("dropped function...");
  try {
    if (event.target.className === "selected") return;
    var functionId = event.dataTransfer.getData("text");
    if (!obj._functions.includes(functionId)) {
      var hasError = items.setFunctionToItem(obj._id, functionId);
      if (hasError === -1) return;
      if (hasError === 2) {
        moveCallBack(componentID);
        return;
      }
      var settingFunction = items.itemList[items.itemList.findIndex((e) => e._id === functionId)];
      var funcComp = [settingFunction, obj];
      var str = itemFromListToObject(funcComp);
      actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");

    } else {
      produceBox("updating", constantNames["messages"]["functionExists"], true);
    }
  } catch (e) {
    console.log(e);
  }
};

const moveActionHandler = (oldRecMap, newRecMap) => {
  actions.saveCommand((actionItems) => {
    const newRecMap = JSON.parse(actionItems.updatedItem);
    for (var x in newRecMap) {

      items.itemList[items.itemList.findIndex(el => el._id === x)].boundingRec = newRecMap[x];
      InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(x).move(new go.Point(newRecMap[x].left, newRecMap[x].top));
      // InstanceGenerator.alterNodeDims(x, newRecMap[x].width, newRecMap[x].height);
    }
  }, (actionItems) => {
    const oldRecMap = JSON.parse(actionItems.initialItem);

    for (var x in oldRecMap) {
      items.itemList[items.itemList.findIndex(el => el._id === x)].boundingRec = oldRecMap[x];
      InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(x).move(new go.Point(oldRecMap[x].left, oldRecMap[x].top));
      // InstanceGenerator.alterNodeDims(x, oldRecMap[x].width, oldRecMap[x].height);
    }

  }, oldRecMap, newRecMap);
}



export { functionOnDropOnComponent, moveActionHandler };
