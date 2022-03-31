import { imageStorage } from "../Classes/ImageHolder.js";

function takeScreenshotDiv(id) {
    let div = document.getElementById(id);
    domtoimage.toPng(div)
        .then(function(dataUrl) {
            console.log(dataUrl);
        })
        .catch(function(error) {
            // console.error('oops, something went wrong!', error);
        });
}

function takeScreenshot(id) {
    let div = document.getElementById(id);
    console.log(id);
    domtoimage.toPng(div, {
            width: window.screen.width,
            height: window.screen.height
        })
        .then((dataUrl) => {
            cropAndStore(id, dataUrl);
        })
        .catch(function(error) {
            // console.error('oops, something went wrong!', error);
        });
}

function cropAndStore(id, dataURL) {
    // var canvas = document.getElementById('canvas');
    // var dataURL = canvas.toDataURL('image/jpg');
    //get empty second canvas
    var myCanvas = document.createElement('canvas');
    myCanvas.width = 515;
    myCanvas.height = 228;
    var myContext = myCanvas.getContext('2d');
    var img = document.createElement('img');
    img.src = dataURL;
    img.onload = function() {
        myContext.drawImage(img, 0, 32, 1030, 556, 0, 0, 515, 228); //dia 2
        var croppedImage = myCanvas.toDataURL('image/jpg');
        imageStorage.save(id + "_LAYER_PREVIEW", croppedImage);
        console.log('stored');
    }
}


export { takeScreenshot, takeScreenshotDiv };