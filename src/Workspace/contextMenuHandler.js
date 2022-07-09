import { hasClickedOnWorkspace } from "../Input/clickInputObserver.js";
import { produceWorkspaceContextMenu } from "./workspaceContextMenu.js";

function workspaceContextMenuObserver(event) {
    if (hasClickedOnWorkspace(event.target.id, event) && event.button === 2) {
        produceWorkspaceContextMenu("", "", event.clientX, event.clientY);
    }
}

export { workspaceContextMenuObserver }