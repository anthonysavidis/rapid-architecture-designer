import { getSelectedIds } from "./selectComponent.js";
import { items } from "../Classes/ItemArray.js";

function unlink() {
    var selectedIds = getSelectedIds();
    var index0 = items.itemList.findIndex((x => x._id == selectedIds[0]));
    var index1 = items.itemList.findIndex((x => x._id == selectedIds[1]));
    items.itemList[index0].deleteLink(selectedIds[1]);
    items.itemList[index1].deleteLink(selectedIds[0]);
    return;
}

export { unlink };