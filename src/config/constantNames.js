const constantNames = {
    "fileTab": {
        "tabName": "File",
        "Save": "Save",
        "Load": "Load",
        "Test": "Test",
        "Items": "Items",
        "Camera": "Export Image"
    },
    "editTab": {
        "tabName": "Edit",
        "Grid": "Grid",
        "Test": "Test",
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
        "LayerDialog": "Please enter new layer's name:"
    },
    "functionsTab": {
        "tabName": "Functions",
        "New": "New",
        "Delete": "Delete",
        "Set": "Set",
        "Split": "Split",
        "Reset": "Reset",
        "setConfirmation": "The function has been setted successfully to: "
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
        "all": "All"
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
        "DeleteMsgEnd": " items?",
        "ResetStart": "Do you want reset this function from ",
        "ResetEnd": "?"
    },
    "inputBox": {
        "msg": "Insert name & description of ",
        "nameLabel": {
            "Component": "Component Name:",
            "Link": "Link Name:",
            "Function": "Function Name:"
        },
        "descriptionLabel": {
            "Component": "Component Description:",
            "Link": "Link Description:",
            "Function": "Function Description:"
        },
    },
    "splittedBox": {
        "msg": "Splitted Parts",
        "2nd": "2",
        "3rd": "4",
        "name": "SplittedComponent"
    },
    "emptyNames": {
        "component": "New Component",
        "function": "New Function",
        "link": "New Link",
        "line": "New Link",
        "description": "No description added.",
        "info": "No info has been added."
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
        "New": "Create a new Component.",
        "Delete": "Delete the selected Component.",
        "Link": "Link 2 selected Components.",
        "Unlink": "Unlink 2 selected Components.",
        "Split": "Split the selected Component.",
        "Join": "Join the selected Components.",
        "Subdivide": "Create a new sublayer of the selected Component.",
        "Unsubdivide": "Delete the sublayer of the selected Component.",
        "Copy": "Copy selected Component(s) in order to paste it in another editor.",
        "Paste": "Paste copied Component(s) from another editor.",
        "Transfer": "Transfer or copy operations from one component to another."
    },
    "File": {
        "Save": "Save the current architecture.",
        "Load": "Load an architecture.",
        "Test": "Print layers.",
        "Items": "Print items."
    },
    "Edit": {
        "Grid": "Turn on/off the dotted grid.",
        "Test": "Print undo/redo stack.",
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