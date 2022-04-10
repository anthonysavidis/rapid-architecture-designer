var currentText = 'Initial';

function updateFullPath(text) {
    document.getElementById('layerPath').innerHTML = text;
    currentText = text;
    return;
}

function createFullPath() {
    var path = document.createElement('div');
    if (document.getElementById('layerPath'))
        document.getElementById('layerPath').remove();
    path.id = 'layerPath';
    path.className = 'layerPath';
    var positionY = document.getElementById('tabButtons').getBoundingClientRect().height + document.getElementById('tabButtons').getBoundingClientRect().y;
    path.innerHTML = currentText;
    document.getElementById('space').appendChild(path);

    path.style.top = positionY + "px";
    return;
}

export { updateFullPath, createFullPath };