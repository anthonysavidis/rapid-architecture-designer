import { imageStorage } from "../Classes/ImageHolder.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { takeScreenshot } from "../Layers/preview.js";
import { produceTooltip } from "./infoTooltip.js";

function addInfoButton(id) {
    var componentRec = document.getElementById(id).getBoundingClientRect();
    var info = document.createElement("div");
    info.id = id + "infoIcon";
    info.style.backgroundImage = 'url(./images/info.png)';
    info.style.zIndex = 20;
    info.style.width = 24 + "px";
    info.style.height = 24 + "px";
    info.style.float = "right";
    info.style.marginTop = -45 + "px";
    info.style.y = document.getElementById(id).getBoundingClientRect().y;
    document.getElementById(id).appendChild(info);
    return;
}

function renderInfoButton(id) {
    if (document.getElementById(id + "infoIcon"))
        document.getElementById(id + "infoIcon").remove();
    addInfoButton(id);
    setUpListeners(id);
    return;
}

function setUpListeners(id) {
    document.getElementById(id + "infoIcon").addEventListener("click", function(ev) {
        if (document.getElementById(id + "tooltip"))
            return;
        takeScreenshot(layers.selectedLayer._id);
        var index = items.itemList.findIndex((el) => el._id === id);
        var lid = items.itemList[index].subLayers[0];
        var imgSrc = imageStorage.get(lid + "_LAYER_PREVIEW");
        if (!lid)
            imgSrc = "./images/noSub.png";
        if (lid && !imgSrc) {
            imgSrc = "./images/emptySub.png";;
        }
        var componentRect = document.getElementById(id).getBoundingClientRect();
        produceTooltip(componentRect.width, 0, imgSrc, id);
    });
}

export { addInfoButton, renderInfoButton };