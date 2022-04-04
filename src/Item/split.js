import { items } from "../Classes/ItemArray.js";
import { Item } from "../Classes/Item.js";
import { cancelSelection, keepOnlyLastSelectedItem, selectAction } from "./selectComponent.js";
import { showByComponent, updateSelectedList } from "../Workspace/functionAppearance.js";

//round robin
function splitByN(splitingItem, itemParts, oldName, componentsNo) {
    var limit = 0;
    for (var i = 0; i < componentsNo; i++) {
        var newComponent = new Item("Component");
        items.updateNameAndDescription(newComponent._id, oldName + i.toString(), "Splited from " + oldName + ".");
        for (let j = limit; j < (splitingItem._functions.length / componentsNo + limit); j++) {
            if (splitingItem._functions[j])
                newComponent.setFunction(splitingItem._functions[j]);
        }
        itemParts.push(newComponent);
        limit += Math.ceil(splitingItem._functions.length / componentsNo);
        console.log(limit);
    }
    return;
}

function splitComponent(splitingItem, componentsNo) {
    var funcsLength = splitingItem._functions.length;
    if (funcsLength <= 1) {
        alert("CANNOT SPLIT COMPONENT HAS 0 OR 1 FUNCTIONS");
        return;
    }
    var oldName = splitingItem._name;
    var itemParts = [];
    //edw itane
    splitByN(splitingItem, itemParts, oldName, componentsNo);
    items.delete(splitingItem._id);
    return itemParts;
}

function joinComponents(joiningItems) {
    var namesString = "";
    var totalComponent = new Item("Component");
    for (var i = 0; i < joiningItems.length; i++) {
        namesString += joiningItems[i]._name + ", ";
        var tempFunctions = joiningItems[i]._functions;
        for (var j = 0; j < tempFunctions.length; j++) {
            var totalComponentIndex = items.itemList.findIndex((element) => element._id === totalComponent._id);
            items.itemList[totalComponentIndex].setFunction(tempFunctions[j]);
        }
        items.delete(joiningItems[i]._id);
    }
    namesString = namesString.slice(0, -1);
    namesString = namesString.slice(0, -1);
    items.updateNameAndDescription(totalComponent._id, "Joined Item", "Joined Items: " + namesString + ".");
    cancelSelection();
    selectAction(totalComponent._id);
    if (document.getElementById("byComponent").checked) {
        showByComponent();
        updateSelectedList();
    }
    return totalComponent;
}
export { splitComponent, joinComponents };