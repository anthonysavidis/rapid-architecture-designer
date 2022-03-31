import { items } from "../Classes/ItemArray.js";

class boundingRectHolder {
    constructor() {
        this.rectsJSON = {};
        this.tooltipRecs = {};
    }
    insertNewLayer(lid) {
        this.rectsJSON[lid] = {};
    }
    insertNewBoundingRec(lid, id, bRec) {
        this.rectsJSON[lid][id] = bRec;
    }
    insertTooltipRec(id, bRec) {
        this.tooltipRecs[id] = bRec;
    }
    deleteTooltipRec(id) {
        this.tooltipRecs[id] = {};
    }
    updateBoundingRec(lid, id, bRec) {
        this.rectsJSON[lid][id] = bRec;
    }
    deleteBoundingRec(lid, id) {
        this.rectsJSON[lid][id] = {};
    }
    isInsideBounding(lid, x, y) {
        var boundingId = "";
        for (var i in this.rectsJSON[lid]) {
            var curRec = this.rectsJSON[lid][i];
            if (curRec.x <= x && (curRec.x + curRec.width) >= x && curRec.y <= y && (curRec.y + curRec.height) >= y) {
                boundingId = i;
                break;
            }
        }
        return boundingId;
    }
    isInsideComponent(lid, x, y) {
        var boundingId = this.isInsideBounding(lid, x, y);
        if (!boundingId || boundingId.includes("tooltip"))
            return false;
        var itemIndex = items.itemList.findIndex(el => el._id === boundingId);
        if (itemIndex === -1 || items.itemList[itemIndex]._type !== "Component") return false;
        return true;
    }
    isInsideTooltip(lid, x, y) {
        var boundingId = this.isInsideBounding(lid, x, y);
        return boundingId.includes("tooltip");
    }
}

var bRecs = new boundingRectHolder();

export { bRecs }