import { actions } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { copyComponent, pasteComponent } from "../Item/copy.js";

function detectMacros(params) {

    $(document).ready(function() {
        var ctrlDown = false,
            shiftDown = false,
            ctrlKey = 17,
            enterKey = 13,
            shiftKey = 16,
            deleteKey = 46,
            cmdKey = 91,
            vKey = 86,
            zKey = 90,
            cKey = 67;

        $(document).keydown(function(e) {
            if (e.keyCode == ctrlKey) ctrlDown = true;
            else if (e.keyCode == shiftKey) shiftDown = true;
            else if (e.keyCode == enterKey) {
                e.preventDefault();
            }
        }).keyup(function(e) {
            if (e.keyCode == ctrlKey) ctrlDown = false;
            else if (e.keyCode == shiftKey) shiftDown = false;
        });

        $(".no-copy-paste").keydown(function(e) {
            if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
        });

        // Document Ctrl + C/V 
        $(document).keydown(function(e) {
            if (ctrlDown && (e.keyCode == cKey)) { copyComponent(); } else if (ctrlDown && (e.keyCode == vKey)) { pasteComponent(); } else if (ctrlDown && shiftDown && (e.keyCode == zKey)) {
                if (actions.redoStack.length >= 1)
                    actions.redo();
            } else if (ctrlDown && (e.keyCode == zKey)) {
                if (actions.undoStack.length >= 1)
                    actions.undo();
            } else if (ctrlDown && (e.keyCode == 73)) {
                console.log(items);
            }
        });
    });

}

export { detectMacros };