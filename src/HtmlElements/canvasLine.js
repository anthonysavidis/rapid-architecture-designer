function renderCanvasLine(rec1, rec2) {
    // init();
    linedrawCanvas('lindeId', 'link', rec1, rec2)
}

function createArrow(ctx, x, y, angle, size) {
    // angle=Math.PI;
    var path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6));
    path.lineTo(x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6));
    path.lineTo(x, y);
    ctx.fill(path);
}

function canvas_arrow(ctx, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    //triangle
    createArrow(ctx, tox, toy, angle, headlen);
}

function linedrawCanvas(lineId, name, rec1, rec2) {
    if (document.getElementById(lineId))
        document.getElementById(lineId).remove();
    var x1 = rec1.x + rec1.width / 2;
    var x2 = rec2.x + rec2.width / 2;
    var y1 = rec1.y + rec1.height / 2;
    var y2 = rec2.y + rec2.height / 2;
    if (document.getElementById(lineId + 'canvas'))
        document.getElementById(lineId + 'canvas').remove();
    var c = document.createElement('canvas');
    c.style.position = "absolute";
    c.id = lineId + 'canvas';
    c.width = window.screen.width;
    c.height = window.screen.height;
    var ctx = c.getContext("2d");
    ctx.beginPath();
    canvas_arrow(ctx, x1, y1, x2, y2);
    ctx.stroke();
    ctx.closePath();
    document.getElementById('main').appendChild(c);
    return;
}


export { renderCanvasLine,createArrow };