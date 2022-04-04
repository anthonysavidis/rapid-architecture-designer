const constantNames = {
    "fileTab": {
        "tabName": "File",
        "Save": "Save",
        "Load": "Load"
    },
    "editTab": {
        "tabName": "Edit",
        "Grid": "Grid",
        "Undo": "Undo",
        "Copy": "Copy",
        "Paste": "Paste",
        "Redo": "Redo"
    },
    "componentsTab": {
        "tabName": "Components",
        "New": "New",
        "Delete": "Delete",
        "Edit": "Edit",
        "Join": "Join",
        "Link": "Link",
        "Unlink": "Unlink",
        "Copy": "Copy",
        "Paste": "Paste",
        "Transfer": "Transfer",
        "Subdivide": "Subdivide",
        "Unsubdivide": "Unsubdivide",
        "Extend": "Extend",
        "Collapse": "Collapse",
        "LayerDialog": "Please enter new layer's name:"
    },
    "functionsTab": {
        "tabName": "Functions",
        "New": "New",
        "Delete": "Delete",
        "Set": "Set",
        "Split": "Split",
        "Reset": "Reset",
        "setConfirmation": "Attached to: "
    },
    "layersTab": {
        "tabName": "Hierarchy",
        "MoveTo": "Move To",
        "Delete": "Delete",
        "InitialLayerName": "Initial",
        "moveBox": "Move item to:"
    },
    "operationsArea": {
        "title": "Operations",
        "filterMsg": "Filter by:",
        "byComponent": "Current",
        "all": "All",
        "currentComponents": "Selected Components:"
    },
    "infoTooltip": {
        "imageTitle": "Preview",
        "descTitle": "Description",
        "emptyDescription": "No description has been added yet.",
        "moreInfo": "More Information",
        "al": "Arrow Type",
        "none": " - ",
        "->": " -> ",
        "<-": " <- ",
        "<->": " <-> ",
        "collapse": "Collapsed View",
        "extended": "Extended View"
    },
    "confirmationBox": {
        "DeleteMsgStart": "Do you want to delete ",
        "DeleteMsgEnd": " Components?",
        "DeleteMsgFunctionEnd": " Functions?",
        "ResetStart": "Do you want reset this function from ",
        "ResetEnd": "?"
    },
    "inputBox": {
        "msg": "Insert name & description of ",
        "nameLabel": {
            "Component": "Name:",
            "Link": "Name:",
            "Function": "Name:",
            "Layer": "Name:",
            "Save": "Name of the exported architecture:"
        },
        "descriptionLabel": {
            "Component": "Description:",
            "Link": "Description:",
            "Function": "Description:"
        },
    },
    "splittedBox": {
        "msg": "Parts split",
        "2nd": "2",
        "3rd": "4",
        "name": "Component split"
    },
    "emptyNames": {
        "component": "New Component",
        "function": "New Function",
        "layer": "New Layer",
        "link": "New Link",
        "line": "New Link",
        "description": "No description added.",
        "info": "No info has been added.",
        "save": "myArchitecture.txt"
    },
    "functionsContext": {
        "move": "Move to",
        "delete": "Delete",
        "unparent": "Unparent",
        "split": "Split"
    },
    "messages": {
        "pngMsg": "Insert name of the current layer.",

    },
    "dot": ".",
    "ok": "OK",
    "cancel": "Cancel"
}

const buttonTooltips = {
    "Components": {
        "New": "Create a new component.",
        "Delete": "Delete the selected component.",
        "Link": "Link two selected components.",
        "Unlink": "Unlink two selected components.",
        "Split": "Split the selected component.",
        "Join": "Join the selected components.",
        "Subdivide": "Create a new sublayer of the selected component.",
        "Unsubdivide": "Delete the sublayer of the selected component.",
        "Copy": "Copy selected component(s) to paste it in another editor.",
        "Paste": "Paste copied component(s) from another editor.",
        "Transfer": "Transfer or copy operations from one component to another."
    },
    "File": {
        "Save": "Save the current architecture.",
        "Load": "Load an architecture."
    },
    "Edit": {
        "Grid": "Turn on/off the dotted grid.",
        "Undo": "Undo the latest action.",
        "Redo": "Redo the latest action."
    },
    "Functions": {
        "New": "Create a new Function.",
        "Delete": "Delete selected Function.",
        "Set": "Set selected Function to selected Component.",
        "Reset": "Reset selected Function from selected Component."
    },
    "Hierarchy": {
        "Move To": "Move component to another layer."
    },
}

export { constantNames, buttonTooltips };