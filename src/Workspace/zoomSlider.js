import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { layers } from "../Classes/LayerHolder.js";

function produceLayersZoomSlider(lid) {
    var zoomSlider = new ZoomSlider(InstanceGenerator.diagramMap[lid],
        {
            //alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomRight,
            size: 150, buttonSize: 20, orientation: 'horizontal'
        });
    zoomSlider._sliderDiv.id = lid + "zoomSlider";
    zoomSlider._sliderDiv.style.top = window.innerHeight - 40 + "px";
    zoomSlider._sliderDiv.style.left = 25 + "px";
    zoomSlider._sliderDiv.style.zIndex = "27";
    zoomSlider._sliderDiv.children[1].children[0].min = -30;
    zoomSlider._sliderDiv.children[1].children[0].max = 30;
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