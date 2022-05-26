import { addMotion } from "../Input/movingModal.js";
import { produceMovingBar } from "./infoBoxes.js";

function createLayerInfoModal() {
    var box = document.createElement('div');
    box.className = "layerInfoBox";
    produceMovingBar(box, 0);
    var cancelAction = () => {
        closeBox();
    }

    var closeBox = function() {
        box.remove();
        if (document.getElementById('grayLayer'))
            document.getElementById('grayLayer').remove();
    }

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = cancelAction;

    box.appendChild(closeButton);
    document.getElementById("body").appendChild(box);
    addMotion(box);
    return;
}

export { createLayerInfoModal }