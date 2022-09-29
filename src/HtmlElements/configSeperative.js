{/* <div class="formContainer" style="margin-top: 5px; margin-left: 11px;">
    <p style="float: left;margin-top: 3px;font-size: small;">Font Style:</p>
    <div class="seperativeLine" style="margin-top: 20px;"></div> */}

function generateConfigSeperativeLine(text) {
    var lineContainer = document.createElement('div');
    var paragraph = document.createElement("p");
    paragraph.style.float = "left";
    paragraph.className = "unselectableText";
    paragraph.style.marginTop = "2px";
    paragraph.style.fontSize = "small";
    paragraph.innerText = text;
    var lineDiv = document.createElement('div');
    lineDiv.className = "seperativeLine";
    lineDiv.style.marginTop = "20px";
    lineDiv.style.backgroundColor = "#b5b5b5";
    lineContainer.appendChild(paragraph);
    lineContainer.appendChild(lineDiv);
    lineContainer.style.marginTop = "5px";
    lineContainer.style.display = "inline-block";
    lineContainer.style.width = "95%";
    lineContainer.style.color = "gray";
    return lineContainer;
}

export { generateConfigSeperativeLine }