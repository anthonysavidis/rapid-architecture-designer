import { getSelectedItems } from "../Item/selectComponent.js";
import { items } from "../Classes/ItemArray.js";


//293978
function getAllDeletedItemsStrs() {
    var selectedItems = getSelectedItems();
    var linkIds = [];
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].links) {
            selectedItems[i].links.forEach((values, keys) => {
                linkIds.push(values);
            });
        }
    }
    linkIds = linkIds.filter((el, index) => {
        return linkIds.indexOf(el) === index;
    });
    console.log(linkIds);
    var deletedItems = selectedItems;
    for (var i = 0; i < linkIds.length; i++) {
        deletedItems.push(items.itemList[items.itemList.findIndex((el) => linkIds[i] === el._id)]);
    }
    console.log(deletedItems);
    var itemsStr = "{";
    for (let i = 0; i < deletedItems.length; i++) {
        itemsStr += "\"" + i + "\":" + deletedItems[i].toString() + ",";

    }
    itemsStr = itemsStr.slice(0, -1);
    itemsStr += "}";
    return itemsStr;
}


function getSingleItemStrs(it) {
    var links = [];
    it.links.forEach((values, keys) => {
        links.push(values);
    });
    var linkIds = links.filter((el, index) => {
        return links.indexOf(el) === index;
    });
    var deletedItems = [];
    deletedItems.push(it);
    linkIds.forEach(el => deletedItems.push(items.itemList[items.itemList.findIndex(itemEl => itemEl._id === el)]));

    var itemsStr = "{";
    for (let i = 0; i < deletedItems.length; i++) {
        itemsStr += "\"" + i + "\":" + deletedItems[i].toString() + ",";

    }
    itemsStr = itemsStr.slice(0, -1);
    itemsStr += "}";
    return itemsStr;
}
// function fixingLinks(respawnedItem){
//     if(respawnedItem.links){

//     }
// }

export { getAllDeletedItemsStrs, getSingleItemStrs };