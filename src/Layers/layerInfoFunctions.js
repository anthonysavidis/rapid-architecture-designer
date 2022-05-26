import { items } from "../Classes/ItemArray.js";

function countOrphanOperations() {
    var count = 0;
    for (let index = 0; index < items.itemList.length; index++) {
        if (items.itemList[index]._type === "Function" && !items.itemList[index].owners[0]) {
            count++;
        }
    }
    return count;
}

function countEmptyComponents() {
    var count = 0;
    for (let index = 0; index < items.itemList.length; index++) {
        if (items.itemList[index]._type === "Component" && !items.itemList[index]._functions.length) {
            count++;
        }
    }
    return count;
}

function getComponentWithTheMostOperations(params) {
    const components = items.itemList.filter((el) => el._type === "Component");
    var count = 0;
    // var 
    // for(var x in components){
    //     if(components[x]
    // }
}

function getComponentWithTheLeastOperations(params) {

}

export { countOrphanOperations, countEmptyComponents, getComponentWithTheMostOperations, getComponentWithTheLeastOperations }