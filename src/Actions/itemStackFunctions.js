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

function getLinkItems(joinedItemList) {
    var defaultLinkList = [];
    for (var x in joinedItemList) {
        if (joinedItemList[x].links) {
            // Array.from(joinedItemList[x].links.entries()).forEach(function(e) {
            //     defaultLinkList.push(e[1]); // get the value
            // });
            for (let [key, value] of joinedItemList[x].links.entries()) {
                // console.log(key + " = " + value);
                defaultLinkList.push(value);
            }
        }
    }
    // console.log(defaultLinkList);
    // var linkIdList = defaultLinkList.filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i);
    var linkIdList = [];
    var linkItems = [];
    $.each(defaultLinkList, function(i, el) {
        if ($.inArray(el, linkIdList) === -1) linkIdList.push(el);
    });
    for (var x in linkIdList) {
        linkItems.push(items.itemList[items.itemList.findIndex((el) => el._id === linkIdList[x])]);
    }
    return linkItems;
}


export { getAllDeletedItemsStrs, getSingleItemStrs, getLinkItems };