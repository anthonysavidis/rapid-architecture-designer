import { dragElement } from "./createComponent.js";
import { changeSelectState } from "./selectComponent.js";
import { items } from "../Classes/ItemArray.js";

function moveItem(id) {
    dragElement(document.getElementById(id));
    // changeSelectState(id + 'infoIcon');
    // changeSelectState(id + 'name');
}

function deleteComponent(selectedIds) {
    console.log(selectedIds);
    for (var i = 0; i < selectedIds.length; i++) {
        items.delete(selectedIds[i]);
    }
}

function deleteFunction() {
    var y = document.getElementsByClassName("selectedFunction");
    while (y.length !== 0) {
        items.delete(y[0].id);
    }
}

function link() {
    var id1 = document.getElementsByClassName("selected")[0];
    var id2 = document.getElementsByClassName("selected")[1];
}

export { moveItem, deleteComponent, deleteFunction };