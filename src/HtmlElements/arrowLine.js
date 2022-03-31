// var arrowLineHtml = '<div class="arrowLine"><div class="arrowBody"></div><div class="point"></div></div>';

function produceArrowElement(id) {
    var arrowLineHtml = '<div id="' + id + '" class="arrowLine"><div class="arrowBody"></div><div class="point"></div></div>';
    return arrowLineHtml;
}

export { produceArrowElement };