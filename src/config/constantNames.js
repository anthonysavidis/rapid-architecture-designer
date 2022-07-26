const constantNames = {
    "fileTab": {
        "tabName": "Project",
        "Save": "Save",
        "Load": "Load",
        "New": "New",
        "savemsg": "Architecture's file name:"
    },
    "settingsTab": {
        "tabName": "Settings",
        "Configure": "Configure",
        "Configure Component": "Component",
        "Configure Link": "Link",
        "Fullscreen": "Fullscreen",
        "Configure Operation": "Operation",
        "Exit Fullscreen": "Exit Fullscreen",
    },
    "helpTab": {
        "tabName": "Help",
        "Help": "Help"
    },
    "editTab": {
        "tabName": "Edit",
        "Grid": "Grid",
        "Undo": "Undo",
        "Copy": "Copy",
        "Paste": "Paste",
        "Redo": "Redo",
        "Panning": "Panning"
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
        "tabName": "Operations",
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
        "ToggleHierarchy": "Toggle Tree",
        "Delete": "Delete",
        "InitialLayerName": "Initial",
        "moveBox": "Move item(s) to:",
        "Info": "Info"
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
        "descTitle": "Edit Description",
        "emptyDescription": "No description has been added yet.",
        "moreInfo": "More Information",
        "al": "Arrow Type",
        "none": " - ",
        "->": " → ",
        "<-": " ← ",
        "<->": " ←→ ",
        "collapse": "Collapsed View",
        "extended": "Extended View"
    },
    "confirmationBox": {
        "DeleteMsgStart": "Do you want to delete ",
        "DeleteMsgEnd": " component(s)?",
        "DeleteMsgFunctionEnd": " operations?",
        "ResetStart": "Do you want reset this operation from ",
        "ResetMult": "Do you want reset the selected (",
        "ResetEnd": ") operation(s)?"
    },
    "linkDirectionBox": {
        "title": "Link Direction",
        "directed": "Directed",
        "bidirected": "Bidirectional",
        "undirected": "Undirected"
    }
    ,
    "configBox": {
        "xSmall": "x-Small",
        "Small": "Small",
        "Medium": "Medium",
        "Large": "Large",
        "xLarge": "x-Large",
        "autoFitLabel": "Custom margins:",
        "descriptionLabel": "Description:",
        "componentColor": "Background:",
        "subcomponentColor": "Subcomponent:",
        "subcomponentTextColor": "Subcomponent text:",
        "borderColor": "Border:",
        "textColor": "Text:",
        "backgroundColor": "Text background:",
        "selectedBorder": "Focused border:",
        "borderWidth": "Border width:",
        "component": "Component Settings",
        "link": "Link Settings",
        "descriptionColor": "Description text:",
        "lineNo": "Description lines:",
        "operation": "Operation Settings",
        "subcomponentSettings": "Subcomponent Settings"
    },
    "operationConfig": {
        "operationColor": "Background:",
        "operationBorder": "Border:",
        "operationSelectedBorder": "Focus border:",
        "attachedColor": "Attached:",
        "draggingColor": "Dragging:",
        "operationBorderWidth": "Border width:",
    },
    "linkConfig": {
        "linkColor": "Link line segment:",
        "arrowColor": "Link arrow:"
    },
    "layerInfo": {
        "orphanOperations": "Orphan Operations:",
        "component": "Component with no operations:",
        "componentMostOperations": "Component with most operations:",
        "componentLeastOperations": "Component with least operations:",
        "tittle": "Brief Info"
    },
    "inputBox": {
        "msg": "Insert name and description of ",
        "nameLabel": "Name:",
        "descriptionLabel": "Description:"
    },
    "splittedBox": {
        "msg": "Parts split",
        "2nd": "2",
        "3rd": "4",
        "name": "Component split"
    },
    "emptyNames": {
        "component": "Component(New)",
        "function": "Operation(New)",
        "layer": "Layer(New)",
        "link": " Link(New)",
        "line": "Line(New)",
        "description": "No description added.",
        "info": "No info added.",
        "save": "myArchitecture.prj",
    },
    "functionsContext": {
        "move": "Move to",
        "delete": "Delete",
        "unparent": "Unparent",
        "split": "Split"
    },
    "messages": {
        "pngMsg": "Insert name of the current layer.",
        "functionExists": "Already attached to component!",
        "moveToMsg": "Cannot move items to another layer.",
        "unsubdivideMsg": "Do you want to delete the subarchitecture of the selected Component?",
        "newProjectMsg": "Are you sure you want to create a new project and remove this from editor?"
    },
    "singleFormMessages": {
        "layer": "Sub layer name:",
        "Save": "Name:",
        "newProj": "Name:",
        "SettingsSave": "Name:"
    },
    "inputDialogTitles": {
        "Save": "Save Project",
        "New": "New Project",
        "SettingsSave": 'Save current settings'
    },
    "dot": ".",
    "ok": "OK",
    "apply": "Apply",
    "cancel": "Cancel",
    "close": "Close",
    "restore": "Reset"
}

const buttonTooltips = {
    "Components": {
        "New": "Create a new component.",
        "Delete": "Delete the selected component.",
        "Link": "Link two selected components.",
        "Unlink": "Unlink two selected components.",
        "Join": "Join the selected components.",
        "Subdivide": "Create a new sublayer of the selected component.",
        "Unsubdivide": "Delete the sublayer of the selected component.",
        "Copy": "Copy selected component(s) to paste it in another editor.",
        "Paste": "Paste copied component(s) from another editor.",
        "Transfer": "Transfer or copy operations from one component to another.",
        "Extend": "Extend selected component(s) to their subcomponents.",
        "Collapse": "Collapse the selected component(s)."
    },
    "Project": {
        "New": "Create a new architecture and optionally save the last one.",
        "Save": "Save the current architecture.",
        "Load": "Load an architecture."
    },
    "Edit": {
        "Grid": "Toggle grid.",
        "Undo": "Undo the latest action.",
        "Redo": "Redo the latest action.",
        "Panning": "Toggle panning in the workspace.",
        "Fullscreen": "Enter fullscreen mode.",
        "Exit Fullscreen": "Exit fullscreen mode."
    },
    "Operations": {
        "New": "Create a new operation.",
        "Delete": "Delete selected operation.",
        "Split": "Split operations to a new component.",
        "Set": "Attach selected operation to  component.",
        "Reset": "Detach selected operation from component."
    },
    "Hierarchy": {
        "Move To": "Move component to another layer.",
        "Toggle Tree": "Show/Hide hierarchy tree.",
        "Info": "Layer Info"
    },
    "Settings": {
        "Import": "Import settings from a config file.",
        "Export": "Export settings to a config file.",
        "Configure": "Configure text & font size.",
        "Component": "Configure component style.",
        "Operation": "Configure operation style.",
        "Link": "Configure link style.",
        "Configure Workspace": "Configure workspace style.",

    },
    "Help": {
        "Help": "Help"
    }
}

export { constantNames, buttonTooltips };