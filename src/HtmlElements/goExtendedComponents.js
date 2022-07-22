import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { getSelectedItems, handleByComponent } from "../Item/selectComponent.js";
import { appearComponentButtons, appearFunctionButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { calculateSubcomponents } from "./extendingComponent.js";

function checkIfCollapsed(itemlist) {
    for (var x in itemlist) {
        if (itemlist[x].isSubarchExtended)
            return false;
    }
    return true;
}

function checkIfExtended(itemlist) {
    for (var x in itemlist) {
        if (!itemlist[x].isSubarchExtended)
            return false;
    }
    return true;
}
const $ = go.GraphObject.make;


function produceExpandedNode(id, nameList, initialNode) {
    var component = items.itemList[items.itemList.findIndex(el => el._id === id)];
    const offset = nameList.length * 30 + 30;
    console.log(component)
    const MaxWidth = 165;
    var expandedNode = $(go.Panel, "Vertical");
    // expandedNode.add($(go.Panel, "Auto", $(go.Shape, "RoundedRectangle", { height: 30, strokeWidth: 0, width: MaxWidth, margin: new go.Margin(0, 0, 0, 0), fill: "transparent" }), $(go.TextBlock, { text: component._name, background: "transparent" })));
    expandedNode.add(

        $(go.Panel, "Auto", $(go.Shape, "Rectangle", { height: 2, strokeWidth: 0.5, width: MaxWidth, margin: new go.Margin(30, 0, 0, 0), fill: "white" }), $(go.TextBlock, "", { background: "transparent" }))
    );
    for (let index = 0; index < nameList.length; index++) {
        // if (index !== (nameList.length - 1))
        expandedNode.add($(go.Panel, "Auto",
            $(go.Shape, "Rectangle",
                { name: "SUB_COMPONENT" + index, height: 30, strokeWidth: 0.5, width: MaxWidth, margin: new go.Margin(-0.5, 0, 0, 0), fill: "white" },
                new go.Binding("fill", "subcomponentBackgroundColor")),
            $(go.TextBlock, { name: "SUB_COMPONENT_TEXT" + index, text: nameList[index], background: "transparent", stroke: "black" },
                new go.Binding("stroke", "subcomponentTextColor")
            )
        )
        );
        // else
        // expandedNode.add($(go.Panel, "Auto", $(go.Shape, "Rectangle", { height: 30, name: "SUB_COMPONENT" + index, strokeWidth: 0, width: MaxWidth, margin: new go.Margin(-0.5, 0, 0, 1), fill: "white" }, new go.Binding("fill", "subcomponentBackgroundColor")), $(go.TextBlock, { name: "SUB_COMPONENT_TEXT" + index, text: nameList[index], background: "transparent" }, new go.Binding("stroke", "subcomponentTextColor"))))
    }

    console.log(expandedNode.data);
    // InstanceGenerator.diagramMap[layers.selectedLayer._id].add(expandedNode);
    console.log(initialNode.data)
    InstanceGenerator.diagramMap[layers.selectedLayer._id].model.setDataProperty(initialNode.data, "textblockPosition", go.Spot.Top);
    InstanceGenerator.diagramMap[layers.selectedLayer._id].model.setDataProperty(initialNode.data, "textblockMargin", new go.Margin(8, 0, 0, 0));
    // initialNode.
    initialNode.add(expandedNode);
    initialNode.height = offset;

    return initialNode;
}



function showSubarchitectureExpansion(selectedItems) {
    for (var x in selectedItems) {
        items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].isSubarchExtended = true;;

        var delNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(selectedItems[x]._id);
        // const prevLocation = delNode.data.loc;
        // InstanceGenerator.diagramMap[layers.selectedLayer._id].remove(delNode);
        InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(selectedItems[x]._id).findObject("COMPONENT").resizable = false;
        const subComponentsName = calculateSubcomponents(selectedItems[x]._id);
        items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].diagramNode = produceExpandedNode(selectedItems[x]._id, subComponentsName, delNode);
    }

}

function hideSubarchitectureExpansion(selectedItems) {
    for (var x in selectedItems) {
        items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].isSubarchExtended = false;

        // const prevLocation = delNode.location;
        console.log(items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].diagramNode);

        InstanceGenerator.diagramMap[layers.selectedLayer._id].remove(items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].diagramNode);
        items.itemList[items.itemList.findIndex(el => el._id === selectedItems[x]._id)].spawnComponent();
        // const subComponentsName = calculateSubcomponents(selectedItems[x]._id);
        // produceExpandedNode(selectedItems[x]._id, subComponentsName, location);
    }
    return;
}

export { showSubarchitectureExpansion, hideSubarchitectureExpansion, checkIfCollapsed, checkIfExtended };