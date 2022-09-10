import { actions, redoAction, undoAction } from "../Classes/Actions.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { bRecs } from "../Input/boundingRectanglesObserver.js";
import { getLastClickedClassName } from "../Input/clickInputObserver.js";
import { copyComponent, pasteComponent } from "../Item/copy.js";
import { appearComponentButtons, appearEditButtons, appearFunctionButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { deleteFromKey } from "./deleteKey.js";



var macroURCallBack;
function detectMacros(params) {

    $(document).ready(function () {
        var ctrlDown = false,
            shiftDown = false,
            ctrlKey = 17,
            enterKey = 13,
            shiftKey = 16,
            deleteKey = 46,
            cmdKey = 91,
            vKey = 86,
            zKey = 90,
            yKey = 89,
            cKey = 67;

        $(document).keydown(function (e) {
            var isModalOpen = document.getElementsByClassName("confirmationBox").length ||
                document.getElementsByClassName("selectingBox").length ||
                document.getElementsByClassName("inputBox").length ||
                document.getElementsByClassName("configurationBox").length
            if (e.keyCode == ctrlKey) ctrlDown = true;
            else if (e.keyCode == shiftKey) shiftDown = true;
            else if (e.keyCode == enterKey) {
                e.preventDefault();
            }
            if (e.keyCode === deleteKey && !isModalOpen) {
                deleteFromKey();
            }
        }).keyup(function (e) {
            if (e.keyCode == ctrlKey) ctrlDown = false;
            else if (e.keyCode == shiftKey) shiftDown = false;
        });

        $(".no-copy-paste").keydown(function (e) {
            if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
        });

        // Document Ctrl + C/V 
        $(document).keydown(macroURCallBack = function (e) {
            // console.log('fire');
            const isBoxOpen = document.getElementsByClassName('confirmationBox').length || document.getElementsByClassName('selectingBox').length || document.getElementsByClassName('inputBox').length;
            const isFormActive = document.getElementsByClassName('no-outline').length || document.getElementsByClassName('focusName').length;
            if (ctrlDown && (e.keyCode == cKey)) {
                copyComponent();
            } else if (ctrlDown && (e.keyCode == vKey)) {
                pasteComponent();
            } else if (ctrlDown && (e.keyCode == yKey) && !isFormActive && !isBoxOpen) {
                // console.log('_REDO');
                redoAction();
            } else if (ctrlDown && (e.keyCode == zKey) && !isFormActive && !isBoxOpen) {
                // console.log('_UNDO');

                undoAction();
            } else if (ctrlDown && (e.keyCode == 73)) {
                console.log(items);
                console.log(bRecs);
            } else if (ctrlDown && (e.keyCode == 77)) { //m
                console.log(actions);
            } else if (ctrlDown && (e.keyCode == 66)) { //m
                console.log(layers);
            }
        });
    });

}

export { detectMacros, macroURCallBack };