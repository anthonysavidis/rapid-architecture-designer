import { changeNextLinkState, changePrevLinkState } from "../Actions/inverseLinkActions.js";
import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { renderLine } from "../Item/createLine.js";
import { changeArrowElementsState } from "../Item/pointedArrow.js";
import { cancelSelectedLinks, forceSelectLink } from "../Item/selectLink.js";

function setLineState(id, state) {
    var lineIndex = items.itemList.findIndex((el) => el._id === id);

    var oldState = items.itemList[lineIndex].linkState + "@" + id;
    actions.saveCommand(changeNextLinkState, changePrevLinkState, oldState, state);

    items.itemList[lineIndex].linkState = state;
    changeArrowElementsState(id, state);
}

function chooseLineType(id, lineType) {
    switch (lineType) {
        case "noneChoice":
            setLineState(id, "");
            break;
        case "pointTo2Choice":
            setLineState(id, "point2");
            break;
        case "pointTo1Choice":
            setLineState(id, "point1");
            break;
        case "bidirectionalChoice":
            setLineState(id, "bidirectional");
            break;
        default:
            break;
    }
    return;
}

export { chooseLineType };