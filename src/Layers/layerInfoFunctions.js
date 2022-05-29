import { items } from "../Classes/ItemArray.js";

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
    return (componentSort[0] && componentSort[0]._functions.length) ? componentSort[0] : "-";
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
}

export { countOrphanOperations, countEmptyComponents, getComponentWithTheMostOperations, getComponentWithTheLeastOperations, updateLayerInfoBox }