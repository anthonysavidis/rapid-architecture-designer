import { cancelSelection } from "../Item/selectComponent.js";
import { createDraggableSpace, fixTrashBinPosition } from "../Workspace/trashBin.js";

//it moves trashbin and rightab
function produceRightTabRod() {
    var rightTabRod = document.createElement('div');
    rightTabRod.id = "rightTabRod";
    rightTabRod.className = 'rod';
    document.getElementById('body').appendChild(rightTabRod);
    document.getElementById('rightTabRod').style.top = 110 + "px";
    document.getElementById('rightTabRod').style.height = 500 + "px";
    document.getElementById('rightTabRod').style.left = document.getElementById("right_tab").getBoundingClientRect().left + "px";
    addRightTabRodListener();
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
            document.getElementById('body').style.overflow = "hidden";
        },
        drag: (e) => { //prepei na ginei handle & to trash bin & AN VRISKEI COMP STOP.
            var rightRec = document.getElementById('right_tab').getBoundingClientRect();
            var tP = document.getElementById('right_tab').getBoundingClientRect().left;
            var rodRec = document.getElementById('rightTabRod').getBoundingClientRect();
            if (rodRec.x > (buttonsRec.right - 30))
                return;
            var dP = tP - initialPosition.left;
            if (rodRec.x > 0.7 * buttonsRec.width && rodRec.x < 0.85 * buttonsRec.width) {
                (dP > 0) ? dP += 15: dP -= 10;

                document.getElementById('right_tab').style.left = document.getElementById('rightTabRod').getBoundingClientRect().left + "px";
                fixFunctionsWidth();
                document.getElementById('trashBin').style.left = trashBinInitialPos.left + dP + "px";

            } else {
                document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";

                document.getElementById('right_tab').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
                document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
            }
            document.getElementById('body').style.overflow = "hidden";

        },
        stop: (e) => { //actionsSave item... apoi to move item
            document.getElementById('rightTabRod').style.left = document.getElementById('right_tab').getBoundingClientRect().left + "px";
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
        click: (e) => {}
    });
}


export { produceRightTabRod }