var currentText = 'Initial';

function updateFullPath(text) {
    currentText = text;
    // document.getElementById('layerPath').innerHTML = text;
    createFullPath();
    return;
}

function getPathTextDimensions(str) {

    var text = document.createElement("span");
    document.body.appendChild(text);

    var fontSize = "large";
    var fontFamily = "Arial, Helvetica, sans-serif";

    text.style.fontFamily = fontFamily;
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return { width: width, height: height };
}


function replaceOnFullPath(oldName, newName) {
    var oldPath = document.getElementById('layerPath').innerHTML;
    document.getElementById('layerPath').innerHTML = oldPath.replace(oldName, newName);
}

function createFullPath() {
    var path = document.createElement('div');
    if (document.getElementById('layerPath'))
        document.getElementById('layerPath').remove();
    path.id = 'layerPath';
    path.className = 'layerPath';
    var tabRec = document.getElementById('tabButtons').getBoundingClientRect();
    var spaceRec = document.getElementById('space').getBoundingClientRect();
    var positionY = tabRec.height + tabRec.y;
    path.innerHTML = currentText;
    document.getElementById('space').appendChild(path);
    var textDims = getPathTextDimensions(currentText);
    path.style.top = spaceRec.top + "px";
    path.style.left = spaceRec.width / 2 - textDims.width / 2 + "px";
    return;
}

export { updateFullPath, createFullPath, replaceOnFullPath };