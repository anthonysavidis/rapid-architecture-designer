import { constantNames } from "../config/constantNames.js";

function produceBox(type, extraInfo, callBack) {
    var box = document.createElement('div');
    box.className = type + "Box";
    var closeBox = function() {
        box.remove();
    }

    var closeButton = document.createElement('div');
    closeButton.className = "closeBoxButton";
    closeButton.onclick = () => { closeBox(); }
    box.appendChild(closeButton);

    var cancelButton = document.createElement('div'),
        confirmationButton = document.createElement('div');
    cancelButton.className = "cancelButton";
    cancelButton.onclick = closeBox;
    cancelButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["cancel"] + "</p>";

    var title = document.createElement('h3');
    title.className = "boxTitle";
    if (type === "confirmation") {
        var params = extraInfo.split('@');
        title.innerText = params[0];
        box.appendChild(title);
        confirmationButton.className = "deleteButton";
        (params[1] === '1') ? confirmationButton.innerHTML = "<p style=\"margin-top:9px\">OK</p>": confirmationButton.innerHTML = "<p style=\"margin-top:9px\">Delete</p>";
        confirmationButton.onclick = function() {
            callBack();
            closeBox();
        }
    } else if (type === "updating") {
        title.innerText = extraInfo;
        box.appendChild(title);
        document.getElementById("body").appendChild(box);
        setTimeout(() => {
            box.remove();
        }, 1500);
        return;
    } else if (type === "selecting") {
        closeButton.style.left = closeButton.getBoundingClientRect().x + 220 + "px";
        title.innerText = extraInfo[0];
        box.appendChild(title);

        var selectExternal = document.createElement('div');
        selectExternal.style.alignContent = "center";
        selectExternal.style.margin = 0;
        var select = document.createElement('select');
        select.innerHTML = extraInfo[1];
        // select.innerHTML = "<option value=\"2\">" + constantNames["splittedBox"]["2nd"] + "</option>";
        // select.innerHTML += "<option value=\"4\" selected>" + constantNames["splittedBox"]["3rd"] + "</option>";
        // select.innerHTML += "<option value=\"" + extraInfo + "\">" + extraInfo + "</option>";
        selectExternal.appendChild(select);
        select.style.marginLeft = 47 + "px";
        select.style.marginBottom = 24 + "px";
        box.appendChild(selectExternal);

        confirmationButton.className = "okButton";
        confirmationButton.innerHTML = "<p style=\"margin-top:9px\">" + constantNames["ok"] + "</p>";
        confirmationButton.onclick = function() {
            callBack(select.value);
            closeBox();
        }
    } else if (type === "input") {
        // title.innerText = constantNames["inputBox"]["msg"] + extraInfo + constantNames["dot"];
        // box.appendChild(title);
        var form = document.createElement('form');

        var nameFormExternal = document.createElement('div');
        var nameLabelDiv = document.createElement('div');
        nameLabelDiv.className = "labelDiv";
        nameLabelDiv.innerHTML = constantNames["inputBox"]["nameLabel"][extraInfo];
        var nameFormDiv = document.createElement('div');
        nameFormDiv.style.marginTop = 2.5 + "px";
        nameFormDiv.innerHTML = '<input type="text" style="width: 75%;" name="firstname">';
        nameFormExternal.appendChild(nameLabelDiv);
        nameFormExternal.appendChild(nameFormDiv);

        form.appendChild(nameFormExternal);

        var descriptionFormExternal = document.createElement('div');
        var descriptionLabelDiv = document.createElement('div');
        descriptionLabelDiv.className = "labelDiv";
        descriptionLabelDiv.innerHTML = constantNames["inputBox"]["descriptionLabel"][extraInfo];
        var descriptionFormDiv = document.createElement('div');
        descriptionFormDiv.style.marginTop = 2.5 + "px";
        descriptionFormDiv.innerHTML = '<textarea id="itemDescription" name="subject" style="width: 75%;height:100px"></textarea>';
        descriptionFormExternal.appendChild(descriptionLabelDiv);
        descriptionFormExternal.appendChild(descriptionFormDiv);
        form.appendChild(descriptionFormExternal);

        box.appendChild(form);
        confirmationButton.className = "okButton";
        confirmationButton.innerHTML = "<p style=\"margin-top:9px\" class=\"unselectable\">" + constantNames["ok"] + "</p>";
        cancelButton.onclick = function() {
            callBack(constantNames["emptyNames"][extraInfo.toLowerCase()], constantNames["emptyNames"]["description"]);
            closeBox();
        }
        confirmationButton.onclick = function() {
            callBack(nameFormDiv.firstChild.value, descriptionFormDiv.firstChild.value);
            closeBox();
        }
    }
    var buttons = document.createElement('div');
    buttons.className = "buttonTeam";
    buttons.appendChild(cancelButton);
    buttons.appendChild(confirmationButton);
    box.appendChild(buttons);
    document.getElementById("body").appendChild(box);

    return;
}

export { produceBox };