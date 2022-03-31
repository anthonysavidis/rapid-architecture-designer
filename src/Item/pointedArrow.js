import { items } from "../Classes/ItemArray.js";
import { placeArrow } from "./geometry.js";

function addpoint(x, y, col) {
    var p = document.createElement('div');
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.width = '10px';
    p.style.height = '10px';
    p.style.backgroundColor = col;
    document.body.appendChild(p);
}

function getPointRects(lineId) {
    var point1 = document.getElementById(lineId + 'point1');
    var point2 = document.getElementById(lineId + 'point2');
    point1.style.display = "block";
    point2.style.display = "block";
    const recP1 = point1.getBoundingClientRect();
    const recP2 = point2.getBoundingClientRect();
    point1.style.display = "none";
    point2.style.display = "none";
    return [recP1, recP2];
}

// d=√((x_2-x_1)²+(y_2-y_1)²) 
function getDistance(rec, point) {
    var recX = rec.x + rec.width / 2;
    var recY = rec.y + rec.height / 2;
    var pointX = point.x + point.width / 2;
    var pointY = point.y + point.height / 2;
    return Math.sqrt(Math.pow((recX - pointX), 2) + Math.pow((recY - pointY), 2));
}

function changeArrowElementsState(id, state, rec1, rec2) {
    var [recP1, recP2] = getPointRects(id);
    var linkIndex = items.itemList.findIndex(el => el._id === id);
    if (linkIndex !== -1) {
        rec1 = document.getElementById(items.itemList[linkIndex].idComponent1).getBoundingClientRect();
        rec2 = document.getElementById(items.itemList[linkIndex].idComponent2).getBoundingClientRect();
    }
    var p1 = document.getElementById(id + "point1");
    var p2 = document.getElementById(id + "point2");
    switch (state) {
        case "":
            {
                p1.style.display = "none";
                p2.style.display = "none";
                break;
            }
        case "point2":
            {
                if (getDistance(rec2, recP2) <= getDistance(rec2, recP1)) {
                    p1.style.display = "none";
                    p2.style.display = "block";
                } else {
                    p1.style.display = "block";
                    p2.style.display = "none";
                }
                break;
            }
        case "point1":
            {
                if (getDistance(rec1, recP2) >= getDistance(rec1, recP1)) {
                    p1.style.display = "block";
                    p2.style.display = "none";
                } else {
                    p1.style.display = "none";
                    p2.style.display = "block";
                }
                break;
            }
        case "bidirectional":
            {
                p2.style.display = "block";
                p1.style.display = "block";
                break;
            }
        default:
            break;
    }

    return;
}




//rec1 moving rec2 const

function getComponentsRec(lineId, no) {
    var lineIndex = items.itemList.findIndex((el) => el._id === lineId);
    if (lineIndex === -1)
        return null;
    var lineItem = items.itemList[lineIndex];
    var componentIndex;
    if (no === 1)
        componentIndex = items.itemList.findIndex((el) => el._id === lineItem.idComponent1);
    else
        componentIndex = items.itemList.findIndex((el) => el._id === lineItem.idComponent2);
    // var componentIndex = items.itemList.findIndex((el) => el._id === id);
    return document.getElementById(items.itemList[componentIndex]._id).getBoundingClientRect();
}
//<div id=\"" + lineId + "point2\" style=\"float:left;margin-top:-7px; transform: rotate(180deg);\" class=\"point\"></div>
//<div id=\"" + lineId + "point1\" style=\"float:right;margin-top:-7px;\" class=\"point\"></div> 
function produceArrows(rec1, rec2, degree, lineId, state) {
    var point1 = document.createElement("div");
    point1.id = lineId + "point1";
    point1.className = "point";
    point1.style.float = "right";
    point1.style.marginTop = -7 + "px";
    point1.style.display = "none";

    var point2 = document.createElement("div");
    point2.id = lineId + "point2";
    point2.className = "point";
    point2.style.transform = "rotate(180deg)";
    point2.style.float = "left";
    point2.style.marginTop = -7 + "px";
    point2.style.display = "none";

    document.getElementById(lineId).appendChild(point1);
    document.getElementById(lineId).appendChild(point2);


    var r1 = getComponentsRec(lineId, 1);
    var r2 = getComponentsRec(lineId, 2);
    !r1 ? r1 = rec1 : r1 = r1;
    !r2 ? r2 = rec2 : r2 = r2;

    changeArrowElementsState(lineId, state, rec1, rec2);
}

function changeDisplayedArrow(id) {
    if (document.getElementById(id + 'point1').style.display === "block") {
        document.getElementById(id + 'point1').style.display = "none";
        document.getElementById(id + 'point2').style.display = "block";
    } else {
        document.getElementById(id + 'point1').style.display = "block";
        document.getElementById(id + 'point2').style.display = "none";
    }
}

export { changeArrowElementsState, produceArrows, placeArrow, changeDisplayedArrow };