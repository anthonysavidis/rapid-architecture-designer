import { items } from "../Classes/ItemArray.js";
import { createDialog, showInputDialog } from "../Input/inputDialog.js";
import { layers, refreshAllLinks } from "../Classes/LayerHolder.js";
import { LayerHolder } from "../Classes/LayerHolder.js";
import { takeScreenshot } from "../Layers/preview.js";
import { constantNames } from "../config/constantNames.js";
import { produceBox } from "../HtmlElements/infoBoxes.js";
import { copyComponent } from "../Item/copy.js";
import { toggleSelectedComponents } from "../HtmlElements/upTabCreation.js";
import { showAll } from "../Workspace/functionAppearance.js";
import { actions } from "../Classes/Actions.js";
import { loadNext, loadPrev } from "../Actions/inverseFileActions.js";
import { autoResizeAllComponents, checkAndResize } from "../Item/autoResize.js";
import { updateFullPath } from "../HtmlElements/pathAndLayerSpan.js";
import { turnOnDescription } from "../HtmlElements/extendingComponent.js";
import { configStyle } from "../Classes/Config.js";
import { enableLayerDescriptionExtension, refreshDescriptionExtension } from "../Layers/switchActions.js";
import { measureAllLayersOperations } from "../Workspace/selectedOperationsHandler.js";
import { exitFullscreenCntx } from "./settingsTab.js";

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                for (var x in layers.layerList) {
                    document.getElementById(layers.layerList[x]._id).remove();
                    document.getElementById(layers.layerList[x]._id + "functions").remove();
                }
                var lh = new LayerHolder(allText);
                autoResizeAllComponents();
            }
        }
    }
    rawFile.send(null);
}

function download(filename, text, suffix) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + suffix);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function loadAction() {
    $('#file-input').trigger('click');
    var input = document.getElementById("file-input");
    if (!input) return;
    input.onchange = e => {
        // if (e.target.files[0].name)
        // readTextFile("http://127.0.0.1:5500/tests/" + e.target.files[0].name);
        // location.reload();

        var reader = new FileReader();

        reader.onload = function (evt) {
            if (evt.target.readyState != 2) return;
            if (evt.target.error) {
                alert('Error while reading file');
                return;
            }
            const previousLayerHolderStr = layers.toString();
            var filecontent = evt.target.result;
            var allText = filecontent;
            for (var x in layers.layerList) {
                document.getElementById(layers.layerList[x]._id).remove();
                document.getElementById(layers.layerList[x]._id + "functions").remove();
            }
            var lh = new LayerHolder(allText);
            actions.saveCommand(loadNext, loadPrev, previousLayerHolderStr, lh.toString());
            if (configStyle.autoFit)
                autoResizeAllComponents();
            else
                checkAndResize();
            updateFullPath(layers.layerList[0]._name);
            (configStyle.descriptionEnabled) ? refreshAllLinks() : 1;
            measureAllLayersOperations();
        };
        reader.readAsText(e.target.files[0]);
    }
}

function loadSpecific(name) {
    readTextFile("http://127.0.0.1:5500/tests/" + name);
    return;
}

function flushInputEvent() {
    $("#file-input").click(function (e) {
        $('#file-input').val('');
    });
}

function saveAction() {
    var callBack = (name, cancelled) => {
        if (cancelled)
            return;
        // name = "myArchitecture.txt";
        download(name, layers.toString(), ".prj");
    }
    showInputDialog("Save", callBack);
}

function addFileTabListeners() {
    // loadSpecific("extendTest.txt");
    document.getElementById("loadButton").addEventListener("click", function () {
        var isFullScreen = (window.fullScreen) ||
            (window.innerWidth == screen.width && window.innerHeight == screen.height);
        if (isFullScreen)
            exitFullscreenCntx();
        flushInputEvent();
        loadAction();
    });
    document.getElementById("saveButton").addEventListener("click", function () {
        saveAction();
    });
    document.getElementById("newProjectButton").addEventListener("click", function () {
        console.log('clicked');
        var callBack = (name, cancelled) => {
            if (cancelled) {
                location.reload();
                return;
            }
            // name = "myArchitecture.txt";
            download(name, layers.toString(), ".prj");
            setTimeout(
                () => {
                    location.reload();
                }, 20);

        }
        createDialog("newProj", callBack);
        // showInputDialog("Save", callBack);
    });
}


export { addFileTabListeners, download };