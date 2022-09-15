import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { layers } from "../Classes/LayerHolder.js";

function handleZoomButtons(zoomSlider) {
    zoomSlider._sliderDiv.children[1].children[0].min = -30;
    zoomSlider._sliderDiv.children[1].children[0].max = 30;
    zoomSlider._sliderDiv.children[2].style.marginLeft = 5 + "px";
    zoomSlider._sliderDiv.children[1].children[0].style.marginLeft = "2.5px";
    zoomSlider._sliderDiv.children[2].style.border = 0;
    zoomSlider._sliderDiv.children[2].style.backgroundColor = "transparent";
    zoomSlider._sliderDiv.children[2].innerHTML = '<img width="15" height="15" src="./images/plus.png">'

    zoomSlider._sliderDiv.children[0].style.border = 0;
    zoomSlider._sliderDiv.children[0].style.backgroundColor = "transparent";
    zoomSlider._sliderDiv.children[0].innerHTML = '<img width="15" height="15" src="./images/minus.png">'
    return;
}

function produceLayersZoomSlider(lid) {
    var zoomSlider = new ZoomSlider(InstanceGenerator.diagramMap[lid],
        {
            //alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomRight,
            size: 120, buttonSize: 20, orientation: 'horizontal'
        });
    zoomSlider._sliderDiv.id = lid + "zoomSlider";
    // zoomSlider._sliderDiv.style.top = window.innerHeight - 30 + "px";
    zoomSlider._sliderDiv.style.position = "initial";
    zoomSlider._sliderDiv.style.marginTop = "2.5px";
    // zoomSlider._sliderDiv.style.left = 15 + "px";
    zoomSlider._sliderDiv.style.width = "auto";
    zoomSlider._sliderDiv.style.zIndex = "2";
    handleZoomButtons(zoomSlider);

    if (document.getElementById(lid + "zoomSlider"))
        document.getElementById(lid + "zoomSlider").remove();
    document.getElementById("zoomMenuSliderDiv").appendChild(zoomSlider._sliderDiv);
    return zoomSlider;
}

function hideCurrentSlider() {
    if (layers && layers.selectedLayer && document.getElementById(layers.selectedLayer._id + "zoomSlider"))
        document.getElementById(layers.selectedLayer._id + "zoomSlider").style.display = "none";
    return;
}

function showNextSlider(id) {
    if (layers && layers.selectedLayer && document.getElementById(layers.selectedLayer._id + "zoomSlider"))
        document.getElementById(id + "zoomSlider").style.display = "block";
    if (!document.getElementById(id + "zoomSlider")) {
        if (InstanceGenerator.zoomSliderMap[id]) {
            document.getElementById("main").appendChild(InstanceGenerator.zoomSliderMap[id]._sliderDiv);
        }
    }
    return;
}


function createZoomToFitButton() {
    var zoomToFitButton = document.createElement('div');
    zoomToFitButton.className = "menubutton"
    zoomToFitButton.style.height = "24px";
    zoomToFitButton.style.width = "100px";
    zoomToFitButton.style.fontSize = "small";
    zoomToFitButton.style.float = "right";
    zoomToFitButton.style.marginRight = "108px";
    zoomToFitButton.innerHTML = '<img style="float:left;margin-left:-2px;" width="20" height="20" src="./images/zoomToFit.png"/><div style="float:right;margin-top:2px;">Zoom To Fit</div>';
    zoomToFitButton.onclick = (e) => { InstanceGenerator.diagramMap[layers.selectedLayer._id].zoomToFit(); }
    return zoomToFitButton;
}

//Diagram.scale...
function createZoomSelection() {
    var zoomSelectionDiv = document.createElement('div');
    zoomSelectionDiv.style.display = "inline-block";
    var innerStr = '<select onchange="this.nextElementSibling.value=this.value">\
                    <option value="25%">25%</option>\
                    <option value="50%">50%</option>\
                    <option value="75%">75%</option>\
                    <option value="100%">100%</option>\
                    <option value="125%">125%</option>\
                    <option value="150%">150%</option>\
                    <option value="175%">175%</option>\
                    <option value="200%">200%</option>\
                    </select>\
                    <input id="zoomPercentageSelection" type="text" name="format" value="" />';
    zoomSelectionDiv.innerHTML = innerStr;
    zoomSelectionDiv.firstChild.style.position = "";
    zoomSelectionDiv.children[1].value = "100%";
    zoomSelectionDiv.firstChild.style.fontSize = "small";
    zoomSelectionDiv.firstChild.style.height = "17px";
    zoomSelectionDiv.firstChild.style.backgroundSize = "contain";
    zoomSelectionDiv.children[1].style.padding = zoomSelectionDiv.firstChild.style.padding = 0;
    zoomSelectionDiv.children[1].style.margin = zoomSelectionDiv.firstChild.style.margin = 0;
    zoomSelectionDiv.children[1].style.border = 0;
    zoomSelectionDiv.children[1].style.display = "inline-block";
    zoomSelectionDiv.children[1].style.width = "60px";
    zoomSelectionDiv.children[1].style.paddingTop = zoomSelectionDiv.children[1].style.paddingLeft = "2px";
    zoomSelectionDiv.className = "select-editable";
    zoomSelectionDiv.style.width = "80px";
    return zoomSelectionDiv;
}

function addZoomMenu() {
    var zoomMenuDiv = document.createElement('div');
    zoomMenuDiv.id = "zoomMenuDiv";
    zoomMenuDiv.style.height = "48px";
    zoomMenuDiv.style.width = "210px";
    zoomMenuDiv.style.display = "inline-block";
    zoomMenuDiv.style.display = "-4px";

    var zoomMenuSliderDiv = document.createElement('div');
    zoomMenuSliderDiv.id = "zoomMenuSliderDiv";
    zoomMenuSliderDiv.style.float = "left";
    zoomMenuDiv.appendChild(createZoomToFitButton());
    zoomMenuDiv.appendChild(zoomMenuSliderDiv);

    var zoomButtonAndSelection = document.createElement('div');
    // zoomButtonAndSelection.appendChild(createZoomToFitButton());
    zoomButtonAndSelection.appendChild(createZoomSelection());
    zoomButtonAndSelection.style.float = "right";
    zoomButtonAndSelection.style.width = "80px";
    zoomButtonAndSelection.style.height = "50px";
    zoomMenuDiv.appendChild(zoomButtonAndSelection);
    document.getElementById("Edit").appendChild(zoomMenuDiv);
}


export { produceLayersZoomSlider, hideCurrentSlider, showNextSlider, addZoomMenu }