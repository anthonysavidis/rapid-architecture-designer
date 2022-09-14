import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { layers } from "../Classes/LayerHolder.js";

function handleZoomButtons() {

}

function produceLayersZoomSlider(lid) {
    var zoomSlider = new ZoomSlider(InstanceGenerator.diagramMap[lid],
        {
            //alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomRight,
            size: 120, buttonSize: 20, orientation: 'horizontal'
        });
    zoomSlider._sliderDiv.id = lid + "zoomSlider";
    zoomSlider._sliderDiv.style.top = window.innerHeight - 30 + "px";
    zoomSlider._sliderDiv.style.left = 15 + "px";
    zoomSlider._sliderDiv.style.width = "auto";
    zoomSlider._sliderDiv.style.zIndex = "27";
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

    if (document.getElementById(lid + "zoomSlider"))
        document.getElementById(lid + "zoomSlider").remove();
    document.getElementById("main").appendChild(zoomSlider._sliderDiv);
    console.log(lid + " zoom added");
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


export { produceLayersZoomSlider, hideCurrentSlider, showNextSlider }