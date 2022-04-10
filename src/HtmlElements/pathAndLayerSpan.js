function updateFullPath(text) {
    document.getElementById('layerPath').innerHTML = text;
    return;
}

function createFullPath() {
    var path = document.createElement('div');
    path.id = 'layerPath';
    path.className = 'layerPath';
    var positionY = document.getElementById('tabButtons').getBoundingClientRect().height + document.getElementById('tabButtons').getBoundingClientRect().y;
    path.innerHTML = 'Initial';
    document.getElementById('body').appendChild(path);
    path.style.top = positionY + "px";
    return;
}

export { updateFullPath, createFullPath };