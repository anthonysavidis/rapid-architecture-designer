const functionOnDropOnComponent = (event, obj) => {
  event.preventDefault();
  console.log("dropped function...");
  try {
    if (event.target.className === "selected") return;
    console.log(event.target.id);
    var functionId = event.dataTransfer.getData("text");
    if (!obj._functions.includes(functionId)) {
      var hasError = items.setFunctionToItem(obj._id, functionId);
      if (hasError === -1) return;
      if (hasError === 2) {
        moveCallBack(editId);
        return;
      }
      var settingFunction =
        items.itemList[items.itemList.findIndex((e) => e._id === functionId)];
      var funcComp = [settingFunction, obj];
      var str = itemFromListToObject(funcComp);
      actions.saveCommand(setSpecificFunction, resetSpecificFunction, str, "");
    } else {
      produceBox("updating", constantNames["messages"]["functionExists"]);
    }
  } catch {}
};

export { functionOnDropOnComponent };
