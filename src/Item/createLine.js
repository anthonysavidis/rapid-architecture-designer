import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { changeLinkSelectState, forceSelectLink, cancelSelectedLinks } from "./selectLink.js";
import { produceArrows, placeArrow, changeDisplayedArrow } from "./pointedArrow.js";
import { produceTooltip, closeTooltip } from "../HtmlElements/infoTooltip.js";
import { computeDirectionChangeAngle, spawnDot } from "./geometry.js";
import { detailChangeListener } from "../Actions/inversePropertiesTab.js";

function contextLineMenu(ev, lineId) {
    ev.preventDefault();
    produceTooltip(ev.clientX, ev.clientY, "", lineId);
    return;
}

function calculateStartingPoints(lineId, rec1, rec2) {
    var lineLength = 0;
    var m = ((rec2.y + rec2.height / 2) - (rec1.y + rec1.height / 2)) / ((rec2.x + rec2.width / 2) - (rec1.x + rec1.width / 2));
    var degree = Math.atan(m) * 180 / Math.PI;
    var coordinates0 = placeArrow(rec1, rec2, degree, "", lineId);
    var x1 = coordinates0.x;
    var y1 = coordinates0.y;
    var coordinates = placeArrow(rec2, rec1, degree, "", lineId);
    var x2 = coordinates.x;
    var y2 = coordinates.y;
    if (x2 < x1) {
        var tmp;
        tmp = x2;
        x2 = x1;
        x1 = tmp;
        tmp = y2;
        y2 = y1;
        y1 = tmp;
        m = (y2 - y1) / (x2 - x1);
        degree = Math.atan(m) * 180 / Math.PI;
    }
    //ean den orizetai
    if (Number.isNaN(x1) || Number.isNaN(x2)) {
        x1 = rec1.x + rec1.width / 2;
        x2 = rec2.x + rec2.width / 2;
        m = (y2 - y1) / (x2 - x1);
        degree = Math.atan(m) * 180 / Math.PI;
    }
    var arrowChange = 0;
    //ean einai 0
    if (degree === 0) {
        if (rec1.x < rec2.x) {
            lineLength = rec2.x - rec1.x - rec1.width;
            x1 = rec1.x + rec1.width;
            x2 = rec2.x;
        } else {
            lineLength = rec1.x - rec2.x - rec2.width;
            x1 = rec2.x + rec2.width;
            x2 = rec1.x;
        }
    }
    if (degree <= 90 && degree >= 87) {
        if (y1 < y2) {
            const temp = y2;
            y2 = y1;
            y1 = temp;
        }
        if (degree === 90) {
            y2 -= 4;
            y1 -= 4;
        }
        arrowChange = 0;
        degree += 180;
    } else if (degree === -90) {
        arrowChange = 0;
        degree += 180;
        y2 -= 6;
        y1 -= 4;
    }
    return [x1, x2, y1, y2, degree, lineLength, arrowChange];
}

function linedraw(lineId, linkState, name, rec1, rec2) {
    if (document.getElementById(lineId))
        document.getElementById(lineId).remove();
    var x1, x2, y1, y2, degree, lineLength = 0,
        arrowChange = 0;
    [x1, x2, y1, y2, degree, lineLength, arrowChange] = calculateStartingPoints(lineId, rec1, rec2);

    if (lineLength === 0) {
        lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    var lineHtml = "<div id=\"" + lineId + "\" class=\"connector\" style='transform-origin: top left;text-align: center; transform: rotate(" + degree + "deg); width: " + lineLength + "px; position: absolute; top: " + y1 + "px; left: " + x1 + "px;z-index:14;'></div>";
    var div = document.createElement("div");
    div.innerHTML = lineHtml;
    div.id = lineId + 'external';
    document.getElementById(layers.selectedLayer._id).appendChild(div);
    var lb = document.getElementById(lineId).getBoundingClientRect();

    produceArrows(rec1, rec2, degree, lineId, linkState);

    document.getElementById(lineId).addEventListener("contextmenu", function(ev) {
        ev.preventDefault();
        if (document.getElementById(lineId + "tooltipExternal"))
            document.getElementById(lineId + "tooltipExternal").remove();
        contextLineMenu(ev, lineId);
        return;
    });
    document.getElementById(lineId).addEventListener("mouseover", (e) => {
        const description = items.itemList[items.itemList.findIndex(el => el._id === lineId)]._description;
        div.title = description;
        // appearFunctionButtons();
    });
    var nameArea = document.createElement("div");
    nameArea.id = lineId + "name";
    nameArea.className = "blurName";
    nameArea.contentEditable = true;
    nameArea.style.paddingLeft = nameArea.style.paddingRight = "5px";
    nameArea.innerText = name;
    nameArea.style.position = "relative";
    nameArea.style.whiteSpace = "nowrap";
    nameArea.style.width = lineLength + "px";
    nameArea.style.outline = 0 + "px";

    nameArea.onfocus = () => {
        nameArea.className = "focusName";
    }
    nameArea.onblur = (function() {
        const lIndex = items.itemList.findIndex(el => el._id === lineId);
        const originalItemStr = items.itemList[lIndex].toString();
        items.itemList[lIndex]._name = nameArea.innerText;
        detailChangeListener(lineId, originalItemStr);
        nameArea.className = "blurName";
        linedraw(lineId, linkState, nameArea.innerText, rec1, rec2);
    });
    if (name === "") {
        nameArea.style.width = 0.50 * lineLength + "px";
        nameArea.style.backgroundColor = "transparent";
    } else {
        nameArea.style.width = "fit-content";
        nameArea.innerText = name;
    }
    var nameContainer = document.createElement('div');
    nameContainer.id = lineId + "nameContainer";
    nameContainer.style.width = "90%";
    nameContainer.style.marginLeft = "5%";
    nameContainer.style.height = "auto";
    nameContainer.style.alignItems = "center";
    nameContainer.style.justifyContent = "center";
    nameContainer.style.display = "flex";

    document.getElementById(lineId).appendChild(nameContainer);
    document.getElementById(lineId + "nameContainer").appendChild(nameArea);
    // document.getElementById(lineId + "name")
    return div;
}

function _renderLine(lineId, rec1, rec2) {
    document.getElementById(lineId + "external").remove();
    closeTooltip(lineId);
    const matchLineId = (element) => element._id === lineId;
    var lineIndex = items.itemList.findIndex(matchLineId);
    var name = items.itemList[lineIndex]._name;
    items.itemList[lineIndex].domElement = linedraw(lineId, items.itemList[lineIndex].linkState, name, rec1, rec2);
}

function renderLine(itemId) {
    const matchItemId = (element) => element._id === itemId;
    var movIndex = items.itemList.findIndex(matchItemId);
    if (movIndex === -1) return;
    var constantItems = items.itemList[movIndex].linkedItems;
    var movingRec = document.getElementById(itemId).getBoundingClientRect();
    //for loop gia constants...  
    for (var i = 0; i < constantItems.length; i++) {
        var tempLineId = items.itemList[movIndex].links.get(constantItems[i]);
        var tempRec = document.getElementById(constantItems[i]).getBoundingClientRect();
        _renderLine(tempLineId, movingRec, tempRec);
    }
    return;
}
//------------------------------------------------------------


export { renderLine, linedraw, contextLineMenu };