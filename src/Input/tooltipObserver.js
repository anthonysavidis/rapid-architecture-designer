function closeTooltipIfClickedOutside(e) {
    const tooltipDiv = document.getElementsByClassName('tooltip')[0]; //only one.
    if (!tooltipDiv)
        return;
    const infoArrow = document.getElementsByClassName('infoArrow')[0];
    const finfoArrow = document.getElementsByClassName('finfoArrow')[0];
    const tooltipRec = tooltipDiv.getBoundingClientRect();
    if (!(e.clientX >= tooltipRec.x && e.clientY >= tooltipRec.y && e.clientX <= (tooltipRec.x + tooltipRec.width) && e.clientY <= (tooltipRec.y + tooltipRec.height))) {
        if (infoArrow)
            infoArrow.remove();
        if (finfoArrow)
            finfoArrow.remove();
        tooltipDiv.remove();
    }
    return;
}

export { closeTooltipIfClickedOutside }