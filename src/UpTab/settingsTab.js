import { configStyle } from "../Classes/Config.js";
import { produceAConfigBox } from "../HtmlElements/linkConfigBox.js";
import { createComponentConfigBox } from "../HtmlElements/componentConfig.js";


var fullscreenCntx, exitFullscreenCntx;

function addSettingsTabListeners() {
    document.getElementById('configureComponentButton').addEventListener('click', (e) => {
        createComponentConfigBox();

    });
    document.getElementById('configureOperationButton').addEventListener('click', (e) => {
        produceAConfigBox("Operation");
    });
    document.getElementById('configureLinkButton').addEventListener('click', (e) => {
        produceAConfigBox("Link");
    });
    document.getElementById("fullscreenButton").addEventListener('click', fullscreenCntx = (e) => {
        document.getElementById("fullscreenButton").style.display = "none";
        document.getElementById("exitFullscreenButton").style.display = "inline-block";
        document.documentElement.requestFullscreen();

    });
    document.getElementById("exitFullscreenButton").addEventListener('click', exitFullscreenCntx = (e) => {
        document.exitFullscreen();
        document.getElementById("exitFullscreenButton").style.display = "none";
        document.getElementById("fullscreenButton").style.display = "inline-block";
    });
    initialAppear();
    return;
}

function initialAppear() {
    document.getElementById("exitFullscreenButton").style.display = "none";


}

export { addSettingsTabListeners, fullscreenCntx, exitFullscreenCntx };