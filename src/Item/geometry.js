import { layers } from "../Classes/LayerHolder.js";
import { renderCanvasLine, createArrow } from "../HtmlElements/canvasLine.js";
import { contextLineMenu } from "./createLine.js";

//y-y0=λ(x-x0)
//λ=tan(degree)

function computeDirectionChangeAngle(movingRec) {
    var oppositeLine = movingRec.height / 2;
    var nearLine = movingRec.width / 2;

    return Math.atan(oppositeLine / nearLine) * (180 / Math.PI);
}

function getX(x1, y1, x2, y2, y) {
    var lambda = (y2 - y1) / (x2 - x1);
    return (y - y1 + lambda * x1) / lambda;
    // return x1 + ((x2 - x1) * (y - y1)) / (y2 - y1);
}

function getY(x1, y1, x2, y2, x) {
    var lambda = (y2 - y1) / (x2 - x1);
    return lambda * (x - x1) + y1;
    // return y1 + ((y2 - y1) / (x2 - x1)) * (x - x1);
}

//8 cases up, up right, right, down right, down, down left, left, up left.
function indentifyPosition(constantRec, movingRec) {
    var direction = "";
    if ((constantRec.y + constantRec.height / 2) < (movingRec.y + movingRec.height / 2))
        direction += "down";
    else if ((constantRec.y + constantRec.height / 2) > (movingRec.y + movingRec.height / 2))
        direction += "up";
    if ((constantRec.x + constantRec.width / 2) < (movingRec.x + movingRec.width / 2))
        direction += " right";
    else if ((constantRec.x + constantRec.width / 2) > (movingRec.x + movingRec.width / 2))
        direction += " left";
    return direction;
}

function spawnHelper(id, left, top, width, height) {
    if (document.getElementById(id + 'helper'))
        document.getElementById(id + 'helper').remove();

    if (document.getElementsByClassName("helper")[0])
        document.getElementsByClassName("helper")[0].remove();
    var helper = document.createElement('div');
    helper.className = "helper";
    helper.id = id + 'helper';
    helper.style.left = left + "px";
    helper.style.top = top + "px";
    helper.style.width = width + "px";
    helper.style.height = height + "px";

    document.getElementById(layers.selectedLayer._id).appendChild(helper);
    document.getElementById(helper.id).addEventListener("contextmenu", function(ev) {
        console.log(ev);
        contextLineMenu(ev, id);
    });
    console.log(helper.getBoundingClientRect());

}

function spawnDot(id, x, y, color) {
    var dot = document.createElement('div');
    dot.id = id;
    if (document.getElementById(id))
        document.getElementById(id).remove();
    dot.style.width = 5 + "px";
    dot.style.height = 5 + "px";
    dot.style.zIndex = 99999999999999999999;
    dot.style.backgroundColor = color;
    dot.style.position = "absolute";
    document.getElementById('body').appendChild(dot);
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    return;
}

function spawnCanvasLine(x1, y1, x2, y2) {
    var c = document.createElement("canvas");
    c.style.position = "absolute";
    c.id = 'testCanvas';
    if (document.getElementById(c.id)) {
        document.getElementById(c.id).remove();
    }
    c.width = 1000;
    c.height = 1000;
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    document.getElementById('main').appendChild(c);
    return;
}

function handle90degs(constantRec, movingRec, dirAngle, direction) {
    var y, x;
    if (direction === "down") {
        y = movingRec.top;
        x = movingRec.left + movingRec.width / 2;
        return { x: x, y: y };
    }
    if (direction === "up") {
        y = movingRec.top + movingRec.height;
        x = movingRec.left + movingRec.width / 2;
        return { x: x, y: y };
    }
}

function handleMoving(constantRec, movingRec, dirAngle, degree, id, lineId, direction) {
    var y, x, rotation;
    if (degree === 90 || degree === -90)
        return handle90degs(constantRec, movingRec, dirAngle, direction);

    if (Math.abs(degree) > dirAngle) {
        y = (direction === "up") ? movingRec.y + movingRec.height : movingRec.y;
        x = getX(constantRec.x + constantRec.width / 2,
            constantRec.y + constantRec.height / 2,
            movingRec.x + movingRec.width / 2,
            movingRec.y + movingRec.height / 2,
            y);
    } else if (degree < 0) {
        x = (direction === "up") ? movingRec.x : movingRec.x + movingRec.width;
        y = getY(constantRec.x + constantRec.width / 2,
            constantRec.y + constantRec.height / 2,
            movingRec.x + movingRec.width / 2,
            movingRec.y + movingRec.height / 2,
            x);

        rotation = degree;
    } else {
        x = (direction === "up") ? movingRec.x + movingRec.width : movingRec.x;
        y = getY(constantRec.x + constantRec.width / 2,
            constantRec.y + constantRec.height / 2,
            movingRec.x + movingRec.width / 2,
            movingRec.y + movingRec.height / 2,
            x);

        rotation = degree;

    }
    // spawnDot(3, x, y, 'green');
    // spawnDot(3, x, y, 'orange');

    rotation = (direction === "up") ? (degree > 0 ? degree + 180 : degree) : (degree < 0 ? degree + 180 : degree);
    return { x: x, y: y };
}


function placeArrow(constantRec, movingRec, degree, id, lineId) {
    var direction = indentifyPosition(constantRec, movingRec);
    var dirAngle = computeDirectionChangeAngle(movingRec);
    var coordinates;
    if (direction.includes("up")) {
        coordinates = handleMoving(constantRec, movingRec, dirAngle, degree, id, lineId, "up");
        return coordinates;
    }
    if (direction.includes("down")) {
        coordinates = handleMoving(constantRec, movingRec, dirAngle, degree, id, lineId, "down");
        return coordinates;
    }
    //right kai left periptwseis...
    var x, y;
    if (direction === " right") {
        x = movingRec.x + movingRec.width;
        y = movingRec.y + movingRec.height / 2;
    }

    if (direction === " left") {
        x = movingRec.x;
        y = movingRec.y + movingRec.height / 2;
    }
    coordinates = { x: x, y: y };
    return coordinates;
}

export { placeArrow, spawnHelper, computeDirectionChangeAngle, spawnDot };