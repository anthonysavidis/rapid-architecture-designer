import { layers } from "../Classes/LayerHolder.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { cancelSelection } from "../Item/selectComponent.js";
import { createDraggableSpace, fixTrashBinPosition } from "../Workspace/trashBin.js";

//it moves trashbin and rightab
function produceRightTabRod() {
    var rightTabRod = document.createElement('div');
    rightTabRod.id = "rightTabRod";
    rightTabRod.className = 'rod';
    document.getElementById('body').appendChild(rightTabRod);
    document.getElementById('rightTabRod').style.top = document.getElementById("right_tab").getBoundingClientRect().top + "px";
    document.getElementById('rightTabRod').style.height = document.getElementById("right_tab").getBoundingClientRect().height + "px";
    document.getElementById('rightTabRod').style.left = document.getElementById("right_tab").getBoundingClientRect().left + "px";
    addRightTabRodListener();
}

function produceLayerTabRod() {
    var layerTabRod = document.createElement('div');
    layerTabRod.id = "layerTabRod";
    layerTabRod.className = 'rod';
    document.getElementById('body').appendChild(layerTabRod);
    document.getElementById('layerTabRod').style.top = 125 + "px";
    document.getElementById('layerTabRod').style.height = document.getElementById("fSidebar").getBoundingClientRect().height + "px";
    document.getElementById('layerTabRod').style.left = document.getElementById("fSidebar").getBoundingClientRect().right + "px";
    addLayerRodListener();
}

function removeLayerTabRod() {
    if (document.getElementById("layerTabRod"))
        document.getElementById("layerTabRod").remove();
}

function fixFunctionsWidth() {
    const buttonsRec = document.getElementById('tabButtons').getBoundingClientRect();
    const rightRec = document.getElementById('right_tab').getBoundingClientRect();
    var diff = buttonsRec.right - rightRec.right;
    document.getElementById('right_tab').style.width = rightRec.width + diff + "px";
    // document.getElementById('right_tab').style.left = rightRec.left + "px";
    return;
}

function addRightTabRodListener() {
    var initialPosition = {};
    var rodInitialPos = {};
    var trashBinInitialPos = {};
    const buttonsRec = document.getElementById('tabButtons').getBoundingClientRect();
    document.getElementById('rightTabRod').addEventListener('mouseup', (e) => {
        document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
    });
    $('#rightTabRod').draggable({
        axis: 'x',
        start: (e) => {
            initialPosition = document.getElementById('right_tab').getBoundingClientRect();
            rodInitialPos = document.getElementById('rightTabRod').getBoundingClientRect();
            trashBinInitialPos = document.getElementById('trashBin').getBoundingClientRect();
            // helpButtonInitialPos = document.getElementById('helpButton').getBoundingClientRect();
            document.getElementById('body').style.overflow = "hidden";
        },
        drag: (e) => { //prepei na ginei handle & to trash bin & AN VRISKEI COMP STOP.
            var rightRec = document.getElementById('right_tab').getBoundingClientRect();
            var tP = document.getElementById('right_tab').getBoundingClientRect().left;
            var rodRec = document.getElementById('rightTabRod').getBoundingClientRect();
            // var isInsideComponent = false;
            // for (var j = rodRec.top; j < (rodRec.top + rodRec.height); j++) {
            //     isInsideComponent = bRecs.isInsideComponent(layers.selectedLayer._id, rodRec.left - 15, j);
            //     if (isInsideComponent)
            //         break;
            // }
            if (rodRec.x > (buttonsRec.right - 30))
                return;
            var dP = tP - initialPosition.left;
            if (rodRec.x > 0.7 * buttonsRec.width && rodRec.x < 0.85 * buttonsRec.width) {
                (dP > 0) ? dP += 15 : dP -= 10;

                document.getElementById('right_tab').style.left = document.getElementById('rightTabRod').getBoundingClientRect().left + "px";
                fixFunctionsWidth();
                document.getElementById('trashBin').style.left = trashBinInitialPos.left + dP + "px";
                // document.getElementById('helpButton').style.left = helpButtonInitialPos.left + dP + "px";

            } else {
                document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";

                document.getElementById('right_tab').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
                document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
            }
            document.getElementById('body').style.overflow = "hidden";

        },
        stop: (e) => { //actionsSave item... apoi to move item
            document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + 2 + "px";
            fixFunctionsWidth();
            createDraggableSpace();
            fixTrashBinPosition();
            // $('body').removeClass("overflowDis");
            // var rightRec = document.getElementById('right_tab').getBoundingClientRect();
            // var res = buttonsRec.x + buttonsRec.width - rightRec.right;
        },
        mouseup: (e) => {
            console.log('mouseUp');
        },
        click: (e) => { }
    });
}

function fixHierarchyWidth() {
    const buttonsRec = document.getElementById('tabButtons').getBoundingClientRect();
    const rightRec = document.getElementById('fSidebar').getBoundingClientRect();
    var diff = buttonsRec.left - rightRec.left;
    document.getElementById('fSidebar').style.width = rightRec.width + diff + "px";
    document.getElementById('fSidebar').style.left = buttonsRec.left + "px";
    return;
}

function addLayerRodListener() {
    var initialPosition = {};
    var rodInitialPos = {};
    const buttonsRec = document.getElementById('tabButtons').getBoundingClientRect();
    document.getElementById('layerTabRod').addEventListener('mouseup', (e) => {
        document.getElementById('layerTabRod').style.left = document.getElementById('fSidebar').getBoundingClientRect().right + "px";
    });
    $('#layerTabRod').draggable({
        axis: 'x',
        start: (e) => {
            initialPosition = document.getElementById('fSidebar').getBoundingClientRect();
            rodInitialPos = document.getElementById('layerTabRod').getBoundingClientRect();
            document.getElementById('body').style.overflow = "hidden";
        },
        drag: (e) => {
            var leftRec = document.getElementById('fSidebar').getBoundingClientRect();
            var rodRec = document.getElementById('layerTabRod').getBoundingClientRect();
            var diff = rodRec.right - leftRec.right;
            if ((rodRec.x + rodRec.width) > 0.1 * buttonsRec.width && (rodRec.x + rodRec.width) < 0.30 * buttonsRec.width)
                document.getElementById('fSidebar').style.width = leftRec.width + diff + "px";
        },
        stop: (e) => {
            document.getElementById('layerTabRod').style.left = document.getElementById('fSidebar').getBoundingClientRect().right + "px";
            fixHierarchyWidth();
        }
    });
}

export { produceRightTabRod, produceLayerTabRod, addRightTabRodListener, addLayerRodListener, removeLayerTabRod, fixFunctionsWidth }