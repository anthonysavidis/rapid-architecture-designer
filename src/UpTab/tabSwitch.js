function spawnTab(tabName) {
    if (!document.getElementById(tabName)) {
        return;
    }
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].onmouseenter = function() {
            this.classList.add('hoveredTab');
        }

        tablinks[i].onmouseleave = function() {
            this.classList.remove('hoveredTab');
        }
    }

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).className += " active";
}

export { spawnTab };