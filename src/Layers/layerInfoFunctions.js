import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { constantNames } from "../config/constantNames.js";
import { cancelSelection, selectAction } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";
import { forceActivateAll, forceActivateByComponent } from "../Workspace/functionAppearance.js";

function countOrphanOperations() {
    const orphanOperations = items.itemList.filter((el) => el._type === "Function" && !el.owners[0]);
    return orphanOperations.length;
}

function countEmptyComponents() {
    const emptyComponents = items.itemList.filter((el) => el._type === "Component" && !el._functions.length);
    return emptyComponents.length;
}

function getComponentWithTheMostOperations() {
    const components = items.itemList.filter((el) => el._type === "Component");
    var componentSort = components.sort((a, b) => { return b._functions.length - a._functions.length; });
    return (componentSort[0] && componentSort[0]._functions.length) ? componentSort[0] : "-";
}

function getComponentWithTheLeastOperations() {
    const components = items.itemList.filter((el) => el._type === "Component");
    var componentSort = components.sort((a, b) => { return a._functions.length - b._functions.length; });
    for (var x in componentSort) {
        if (componentSort[x] && componentSort[x]._functions.length)
            return componentSort[x];
    }
    return "-";
}

function checkAndActivateHint(id, callBack) {
    if (document.getElementById(id).className.includes("Pressed")) {
        document.getElementById(id).className = "layerInfoHint";
        callBack(id);
    }
}

function toggleEnablement(value, classNameStr, itemClass) {
    if (value !== 0 && value !== "-")
        document.getElementById(classNameStr).className = "layerInfoHint " + itemClass;
    else
        document.getElementById(classNameStr).className = "disabledInfoHint " + itemClass;
    return;
}

function handleZeroValues(orphanValue, componentValue, mostOperationsValue, leastOperationsValue) {
    toggleEnablement(orphanValue, "functionHint", "item3");
    toggleEnablement(componentValue, "roleHint", "item6");
    toggleEnablement(mostOperationsValue, "maxHint", "item9");
    toggleEnablement(leastOperationsValue, "minHint", "item12");
}

function updateLayerInfoBox() {
    if (!document.getElementById("orphanOperationValue"))
        return;
    var [orphanValue, componentValue, mostOperationsValue, leastOperationsValue] = [countOrphanOperations(), countEmptyComponents(), getComponentWithTheMostOperations(), getComponentWithTheLeastOperations()];
    var componentsCount = (items.itemList.filter((el) => el._type === "Component")).length;
    var functionsCount = (items.itemList.filter((el) => el._type === "Function")).length;
    document.getElementById("orphanOperationValue").innerText = orphanValue + "/" + functionsCount;
    document.getElementById("componentValue").innerText = componentValue + "/" + componentsCount;
    document.getElementById("componentMostOperationsValue").innerText = (mostOperationsValue === "-") ? "-" : mostOperationsValue._name;
    document.getElementById("componentLeastOperationsValue").innerText = (leastOperationsValue === "-") ? "-" : leastOperationsValue._name;
    setTimeout(() => {
        if (!document.getElementById('layerInfoTittle'))
            return;
        document.getElementById('layerInfoTittle').innerHTML = constantNames["layerInfo"]["tittle"];
        resetButtons();
        checkAndActivateHint('functionHint', (id) => { highlightOrphanOperations(document.getElementById(id)); });
        checkAndActivateHint('roleHint', (id) => { highlightEmptyComponents(document.getElementById(id)); });
        checkAndActivateHint('maxHint', (id) => { highlightMostOperationalComponent(document.getElementById('maxHint'), document.getElementById("minHint")); });
        checkAndActivateHint('minHint', (id) => { highlightLeastOperationalComponent(document.getElementById('minHint'), document.getElementById("maxHint")); });
        handleZeroValues(orphanValue, componentValue, mostOperationsValue, leastOperationsValue);
    }, 20);
}

function alterHintState(elmnt) {
    if (elmnt.className.includes("disabled"))
        return;
    const gridClass = elmnt.className.split(" ")[1];
    const prefix = (elmnt.className.includes("layerInfoHintPressed")) ? "layerInfoHint" : "layerInfoHintPressed";
    elmnt.className = prefix + " " + gridClass;
    return (elmnt.className.includes("layerInfoHintPressed"));
}



function highlightOrphanOperations(elmnt) {
    if (elmnt.className.includes("disabled"))
        return;
    if (document.getElementById("maxHint").className.includes("Pressed") || document.getElementById("minHint").className.includes("Pressed")) {
        resetComponentHints();
    }
    const orphanOperations = items.itemList.filter((el) => el._type === "Function" && !el.owners[0]);
    const active = alterHintState(elmnt);
    if (active) {
        cancelFunctionSelection();
        forceActivateAll();
        orphanOperations.forEach((el) => { document.getElementById(el._id).className = "selectedFunction"; })
    } else
        cancelFunctionSelection();
    return;
}

function highlightEmptyComponents(elmnt) {
    if (elmnt.className.includes("disabled"))
        return;
    if (document.getElementById("maxHint").className.includes("Pressed") || document.getElementById("minHint").className.includes("Pressed")) {
        resetComponentHints();
    }
    const emptyComponents = items.itemList.filter((el) => el._type === "Component");
    const active = alterHintState(elmnt);
    if (active) {
        cancelSelection();
        var collectionList = [];
        for(var x in items.itemList){
            if(items.itemList[x]._type==="Component" && items.itemList[x]._functions.length===0){
                var selNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(items.itemList[x]._id);
                collectionList.push(selNode);
            }
        }
        InstanceGenerator.diagramMap[layers.selectedLayer._id].selectCollection(collectionList);
    } else
        cancelSelection();
    return;
}

function focusOnSpecificComponent(component) {
    forceActivateByComponent();
    selectAction(component._id);
}

function unfocusOnSpecificComponent(component) {
    forceActivateAll();
}

function resetButtons() {
    document.getElementById("roleHint").className = (document.getElementById("roleHint").className.includes("disabled")) ? document.getElementById("roleHint").className : "layerInfoHint item6";
    document.getElementById("maxHint").className = (document.getElementById("maxHint").className.includes("disabled")) ? document.getElementById("maxHint").className : "layerInfoHint item9";
    document.getElementById("minHint").className = (document.getElementById("minHint").className.includes("disabled")) ? document.getElementById("minHint").className : "layerInfoHint item12";
    document.getElementById("functionHint").className = (document.getElementById("functionHint").className.includes("disabled")) ? document.getElementById("functionHint").className : "layerInfoHint item3";
    forceActivateAll();
    return;
}

function resetComponentHints() {
    document.getElementById("roleHint").className = (document.getElementById("roleHint").className.includes("disabled")) ? document.getElementById("roleHint").className : "layerInfoHint item6";
    document.getElementById("maxHint").className = (document.getElementById("maxHint").className.includes("disabled")) ? document.getElementById("maxHint").className : "layerInfoHint item9";
    document.getElementById("minHint").className = (document.getElementById("minHint").className.includes("disabled")) ? document.getElementById("minHint").className : "layerInfoHint item12";
    cancelSelection();
    forceActivateAll();
    return;
}

function resetHighlightedHints() {
    document.getElementById("functionHint").className = "layerInfoHint item3";
    resetComponentHints();
    cancelFunctionSelection();
    return;
}

function highlightMostOperationalComponent(elmnt, elmntMin) {
    if (elmnt.className.includes("disabled"))
        return;
    const oldClass = elmnt.className;
    resetButtons();
    cancelSelection();
    elmnt.className = oldClass;
    const active = alterHintState(elmnt);
    const component = getComponentWithTheMostOperations();
    const minComponent = getComponentWithTheLeastOperations();
    if (component === "-")
        return;
    if (active) {
        if (elmntMin.className.includes("layerInfoHintPressed") && minComponent !== "-") {
            alterHintState(elmntMin);
            unfocusOnSpecificComponent(minComponent);
        }
        focusOnSpecificComponent(component);
    } else {
        unfocusOnSpecificComponent(component);
    }
    return;
}

function highlightLeastOperationalComponent(elmnt, elmntMax) {
    if (elmnt.className.includes("disabled"))
        return;
    const oldClass = elmnt.className;
    resetButtons();
    cancelSelection();
    elmnt.className = oldClass;
    const active = alterHintState(elmnt);
    const component = getComponentWithTheLeastOperations();
    const maxComponent = getComponentWithTheMostOperations();
    if (component === "-")
        return;
    if (active) {
        if (elmntMax.className.includes("layerInfoHintPressed") && maxComponent !== "-") {
            alterHintState(elmntMax);
            unfocusOnSpecificComponent(maxComponent);
        }
        focusOnSpecificComponent(component);
    } else
        unfocusOnSpecificComponent(component);
    return;
}


export { countOrphanOperations, handleZeroValues, countEmptyComponents, resetButtons, resetHighlightedHints, highlightLeastOperationalComponent, highlightMostOperationalComponent, highlightEmptyComponents, highlightOrphanOperations, getComponentWithTheMostOperations, getComponentWithTheLeastOperations, updateLayerInfoBox }