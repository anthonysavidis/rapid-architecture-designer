import { InstanceGenerator } from "../Classes/InstanceCreator.js";
import { items } from "../Classes/ItemArray.js";
import { layers } from "../Classes/LayerHolder.js";
import { functionOnDropOnComponent } from "../Item/componentEventCallbacks.js";
import { cancelSelection, getSelectedItems, handleByComponent } from "../Item/selectComponent.js";
import { cancelFunctionSelection } from "../Item/selectFunction.js";
import { appearComponentButtons, appearFunctionButtons, appearHierarchyButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
import { isByComponentChecked } from "../Workspace/functionAppearance.js";
import { measureAllLayersOperations } from "../Workspace/selectedOperationsHandler.js";
import { produceWorkspaceContextMenu } from "../Workspace/workspaceContextMenu.js";
import { produceComponentContextMenu } from "./componentContextMenu.js";
import { itemNameChangedHandler } from "./doubleClickEditing.js";
import { produceLinkContextMenu } from "./linkContextMenu.js";
const $ = go.GraphObject.make;

var lastSelectedNodeKey = null;

function getNewWorkspace(lid) {
    return $(go.Diagram, lid, {
        padding: 20, // extra space when scrolled all the way
        grid:
            $(go.Panel, "Grid",
                { gridCellSize: new go.Size(10, 10) },
                $(go.Shape, "LineH", { strokeDashArray: [1, 9] })
            ), "draggingTool.isCopyEnabled": false,
        "BackgroundSingleClicked": (e) => {
            cancelFunctionSelection();
            cancelSelection();
            appearFunctionButtons();

        },
        "SelectionMoved": function (e) {
            console.log("selectionMovedByHand");
            items.updateSelectedBoundings();
        },
        "ExternalObjectsDropped": (e) => {
        },
        // "TextEdited": (textBlock, previousText, currentText) => {
        //     console.log(textBlock.text);
        //     // setTimeout(() => {
        //     //     var delNode = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(lastSelectedNodeKey);
        //     //     itemNameChangedHandler(lastSelectedNodeKey, delNode.text);
        //     // }, 1200);
        // },
        "draggingTool.isGridSnapEnabled": true,
        handlesDragDropForTopLevelParts: true,
        mouseDrop: (e) => {
            // when the selection is dropped in the diagram's background,
            // make sure the selected Parts no longer belong to any Group
            var ok = e.diagram.commandHandler.addTopLevelParts(
                e.diagram.selection,
                true
            );
            if (!ok) e.diagram.currentTool.doCancel();
        }, contextMenu: $("ContextMenu"),
        commandHandler: $(DrawCommandHandler), // support offset copy-and-paste
        // "clickCreatingTool.archetypeNodeData": {
        //     text: "Component (New)",
        // }, // create a new node by double-clicking in background
        PartCreated: (e) => {
            var node = e.subject; // the newly inserted Node -- now need to snap its location to the grid
            node.location = node.location
                .copy()
                .snapToGridPoint(
                    e.diagram.grid.gridOrigin,
                    e.diagram.grid.gridCellSize
                );
            setTimeout(() => {
                // and have the user start editing its text
                e.diagram.commandHandler.editTextBlock();
            }, 20);
        },
        "commandHandler.archetypeGroupData": {
            isGroup: true,
            text: "NEW GROUP",
        },
        SelectionGrouped: (e) => {
            var group = e.subject;
            setTimeout(() => {
                // and have the user start editing its text
                e.diagram.commandHandler.editTextBlock();
            });
        },
        "contextMenuTool.showContextMenu": function (cm, obj) {
            go.ContextMenuTool.prototype.showContextMenu.call(this, cm, obj);
            // var data = obj.part.data; InstanceGenerator.diagramMap[layers.selectedLayer._id].lastInput.viewPoint
            var mousePt = InstanceGenerator.diagramMap[layers.selectedLayer._id].toolManager.contextMenuTool.mouseDownPoint;
            // const contextX = mousePt.x - 200;
            // const contextY = mousePt.y + 150;
            const finalPoint = InstanceGenerator.diagramMap[layers.selectedLayer._id].transformDocToView(new go.Point(mousePt.x, mousePt.y));
            if (!obj) {
                produceWorkspaceContextMenu("", "", finalPoint.x - 235, finalPoint.y + 120);
                return;
            }
            if (obj.part.data["from"]) {
                produceLinkContextMenu(obj.part.data.key, finalPoint.x - 235, finalPoint.y + 120);
            } else if (obj.part.data["key"]) {
                InstanceGenerator.clickLambda(obj.part.data.key);
                produceComponentContextMenu("", "", finalPoint.x - 235, finalPoint.y + 120);
            }
            // first clear out any existing ContextMenuButtons
            // while (cm.elements.count > 0) cm.removeAt(0);

            // // then add those menu items that you want
            // cm.add($("ContextMenuButton",
            //     $(go.TextBlock, "Do Something"),
            //     { click: function (e, but) { console.log("doSomething()"); } }));
            // cm.add($("ContextMenuButton",
            //     $(go.TextBlock, "Do Something Else"),
            //     { click: function (e, but) { console.log("doSomethingElse()"); } }));
        },
        LinkRelinked: (e) => {
            // re-spread the connections of other links connected with both old and new nodes
            var oldnode = e.parameter.part;
            oldnode.invalidateConnectedLinks();
            var link = e.subject;
            if (e.diagram.toolManager.linkingTool.isForwards) {
                link.toNode.invalidateConnectedLinks();
            } else {
                link.fromNode.invalidateConnectedLinks();
            }
        },
        "undoManager.isEnabled": true,
        "ViewportBoundsChanged": (e) => {
            items.updateAllWorkspaceBoundings();
        }
    });
}

var r = document.querySelector(':root');
var rs = getComputedStyle(r);
var nodeTemplate;
function initializeNodeTemplate() {
    // function MaybeCopyableNode() {
    //     go.Node.call(this);
    // }
    // go.Diagram.inherit(MaybeCopyableNode, go.Node);

    // MaybeCopyableNode.prototype.canCopy = function () {
    //     var diagram = this.diagram;
    //     if (diagram !== null && diagram.currentTool instanceof go.DraggingTool && this.data.text === "Beta") return false;
    //     return go.Node.prototype.canCopy.call(this);
    // }
    nodeTemplate = $(
        go.Node,
        "Auto",
        {
            name: "COMPONENT",
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE",
            desiredSize: new go.Size(120, 60),
            minSize: new go.Size(40, 40),
            resizable: true,
            resizeCellSize: new go.Size(10, 10),
            // click: function (e, obj) { appearComponentButtons(); },

            selectionChanged: function (node) {
                console.log(getSelectedItems());
                appearComponentButtons();
                appearFunctionButtons();
                appearHierarchyButtons();
                (isByComponentChecked()) ? handleByComponent() : 1;
                lastSelectedNodeKey = node.key;


            },

            contextMenu: $("ContextMenu"),
            mouseDragEnter: (e, nodeKey) => {
                // const node = InstanceGenerator.diagramMap[layers.selectedLayer._id].findNodeForKey(nodeKey);
                // node.fill = "#cce6ff";
            },
            mouseDragLeave: (e, node) => node.isHighlighted = false,

            // on a mouse-drop add a link from the dropped-upon node to the new node
            mouseDrop: (e, nodeKey) => {
                functionOnDropOnComponent(e, nodeKey);
                // const newnode = e.diagram.selection.first();
                // const incoming = newnode.findLinksInto().first();
                // if (incoming) e.diagram.remove(incoming);
                // e.diagram.model.addLinkData({ from: node.key, to: newnode.key });
                measureAllLayersOperations();
                (isByComponentChecked()) ? handleByComponent() : 1;
            }
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
            go.Size.stringify
        ),
        new go.Binding("resizable", "resizable"),
        $(
            go.Shape, "RoundedRectangle",
            {
                // the border
                name: "SHAPE",
                fill: "white",
                portId: "",
                cursor: "pointer",
                // fromLinkable: true,
                // toLinkable: true,
                fromLinkableDuplicates: true,
                toLinkableDuplicates: true,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                // mouseEnter: function (e, obj) {
                //     obj.part.findObject("SHAPE").fill = "red";
                // },
                // mouseLeave: function (e, obj) {
                //     obj.part.findObject("SHAPE").fill = "white";
                // }
            },
            new go.Binding("figure"),
            new go.Binding("fill", "componentBackgroundColor"),
            new go.Binding("stroke", "componentBorderColor"),
            new go.Binding("strokeWidth", "componentBorderWidth"),
            new go.Binding("strokeDashArray", "dash"),
        ),
        // this Shape prevents mouse events from reaching the middle of the port
        $(go.Shape, {
            width: 100,
            height: 40,
            strokeWidth: 0,
            fill: "transparent",
        },
            new go.Binding("strokeDashArray", "dash"),
            new go.Binding("height", "componentHeight"),
            new go.Binding("width", "componentWidth"),
        ),
        $(
            go.TextBlock,
            {
                name: "COMPONENT_TEXT_BLOCK",
                margin: 1,
                textAlign: "center",
                overflow: go.TextBlock.OverflowEllipsis,
                // editable: true,
                contextMenu: $("ContextMenu"),
                isUnderline: false
            },
            // this Binding is TwoWay due to the user editing the text with the TextEditingTool
            new go.Binding("text").makeTwoWay(),
            new go.Binding("stroke", "componentTextColor"),
            new go.Binding("font", "font"),
            new go.Binding("background", "componentTextBackgroundColor"),
            new go.Binding("isUnderline", "componentTextUnderlined"),
            new go.Binding("alignment", "textblockPosition"),
            new go.Binding("margin", "textblockMargin"),
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),

        ),
        {
            selectionAdornmentTemplate:
                $(go.Adornment, "Auto",
                    $(go.Shape, "Rectangle",
                        { fill: null, stroke: "blue", strokeWidth: 2 },
                        new go.Binding("stroke", "componentSelectedBorderColor")
                    ),
                    $(go.Placeholder),
                ),  // end Adornment

            toolTip:  // define a tooltip for each node that displays the color as text
                $("ToolTip",
                    $(go.TextBlock, { margin: 4 },
                        new go.Binding("text", "key", function (s) { return items.itemList[items.itemList.findIndex(el => el._id === s)]._description; }))
                )  // end of Adornment
        }
    );
    return nodeTemplate;
}

function alterFocusedColor(color) {
    return;
    const changedSelectionAdornmentTemplate = $(go.Adornment, "Auto",
        $(go.Shape, "Rectangle",
            { fill: null, stroke: color, strokeWidth: 4 }),
        $(go.Placeholder),
    );  // e
    for (var l in layers.layerList) {
        console.log('the:' + color)
        InstanceGenerator.diagramMap[layers.layerList[l]._id].nodeTemplate.selectionAdornmentTemplate = changedSelectionAdornmentTemplate;
    }
    return;
}


function initializeLinkTemplate() {
    return $(go.Link, {
        layerName: "Foreground",
        // routing: go.Link.AvoidsNodes,
        corner: 10,
        toShortLength: 4, // assume arrowhead at "to" end, need to avoid bad appearance when path is thick
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        contextMenu: $("ContextMenu"),
    },
        new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
        new go.Binding("toSpot", "toSpot", go.Spot.parse),
        new go.Binding("fromShortLength", "dir", dir => dir === 2 ? 4 : 0),
        new go.Binding("toShortLength", "dir", dir => dir >= 1 ? 4 : 0),
        new go.Binding("points").makeTwoWay(), // TwoWay due to user reshaping with LinkReshapingTool
        $(go.Shape, {
            strokeWidth: 1
        },
            new go.Binding("stroke", "color"),
            new go.Binding("strokeWidth", "thickness"),
            new go.Binding("strokeDashArray", "dash")),
        $(go.Shape, {
            fromArrow: "Backward",
            strokeWidth: 0,
            scale: 4 / 3,
            visible: false
        },
            new go.Binding("visible", "dir", dir => dir === 2),
            new go.Binding("fill", "color"),
            new go.Binding("scale", "thickness", t => (2 + t) / 3)),
        $(go.Shape, {
            toArrow: "Standard",
            strokeWidth: 0,
            scale: 4 / 3
        },
            new go.Binding("visible", "dir", dir => dir >= 1),
            new go.Binding("fill", "color"),
            new go.Binding("scale", "thickness", t => (2 + t) / 3)),
        $(go.TextBlock, "right",
            {
                segmentOffset: new go.Point(0, 10),
                segmentOrientation: go.Link.OrientUpright
            },
            new go.Binding("text").makeTwoWay(),  // TwoWay due to user editing with TextEditingTool
            new go.Binding("stroke", "color")),// { segmentOffset: new go.Point(0, 10) })
        {
            toolTip:  // define a tooltip for each node that displays the color as text
                $("ToolTip",
                    $(go.TextBlock, { margin: 4 },
                        new go.Binding("text", "key", function (s) { return items.itemList[items.itemList.findIndex(el => el._id === s)]._description; }))
                )  // end of Adornment
        }
    );
}
function ClickFunction(propname, value) {
    if (propname === "dir") {
    }
    return (e, obj) => {
        e.handled = true; // don't let the click bubble up
        e.diagram.model.commit(m => {
            m.set(obj.part.adornedPart.data, propname, value);
        });
    };
}


function getLinkContext() {
    // return $("ContextMenu",

    //     $("ContextMenuButton",
    //         $(go.Panel, "Horizontal",
    //             ArrowButton(0), ArrowButton(1), ArrowButton(2), ArrowButton(3)
    //         )
    //     ),
    //     $("ContextMenuButton",
    //         $(go.Panel, "Horizontal",
    //             $(go.Panel, "Spot",
    //                 AllSidesButton(false),
    //                 SpotButton(go.Spot.Top, false), SpotButton(go.Spot.Left, false), SpotButton(go.Spot.Right, false), SpotButton(go.Spot.Bottom, false)
    //             ),
    //             $(go.Panel, "Spot", {
    //                 margin: new go.Margin(0, 0, 0, 2)
    //             },
    //                 AllSidesButton(true),
    //                 SpotButton(go.Spot.Top, true), SpotButton(go.Spot.Left, true), SpotButton(go.Spot.Right, true), SpotButton(go.Spot.Bottom, true)
    //             )
    //         )
    //     )
    // );
}


function setWorkspaceDropListeners(workspaceID) {
    const div = document.getElementById(workspaceID);
    const myDiagram = InstanceGenerator.diagramMap[workspaceID];
    function onHighlight(part) {  // may be null
        const oldskips = myDiagram.skipsUndoManager;
        myDiagram.skipsUndoManager = true;
        myDiagram.startTransaction("highlight");
        if (part !== null) {
            myDiagram.highlight(part);
        } else {
            myDiagram.clearHighlighteds();
        }
        myDiagram.commitTransaction("highlight");
        myDiagram.skipsUndoManager = oldskips;
    }

    // this is called upon an external drop in this diagram
    function onDrop(event, point) {
        const it = myDiagram.findPartsAt(point).iterator;
        while (it.next()) {
            const part = it.value;
            // the drop happened on some Part -- call its mouseDrop handler
            if (part && part.mouseDrop) {
                // should be running in a transaction already
                part.mouseDrop(event, part.key);
                break;
            }
        }
    }
    div.addEventListener("dragenter", event => {
        // Here you could also set effects on the Diagram,
        // such as changing the background color to indicate an acceptable drop zone

        // Requirement in some browsers, such as Internet Explorer
        event.preventDefault();
    }, false);

    div.addEventListener("dragover", event => {
        // We call preventDefault to allow a drop
        // But on divs that already contain an element,
        // we want to disallow dropping

        if (div === myDiagram.div) {
            const can = event.target;
            const pixelratio = myDiagram.computePixelRatio();

            // if the target is not the canvas, we may have trouble, so just quit:
            if (!(can instanceof HTMLCanvasElement)) return;

            const bbox = can.getBoundingClientRect();
            let bbw = bbox.width;
            if (bbw === 0) bbw = 0.001;
            let bbh = bbox.height;
            if (bbh === 0) bbh = 0.001;
            const mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
            const my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
            const point = myDiagram.transformViewToDoc(new go.Point(mx, my));
            const part = myDiagram.findPartAt(point, true);
            if (part && part.node) {
                part.mouseDragEnter(event, part.node);
            }
        }

        if (event.target.className === "dropzone") {
            // Disallow a drop by returning before a call to preventDefault:
            return;
        }

        // Allow a drop on everything else
        event.preventDefault();
    }, false);

    div.addEventListener("dragleave", event => {
        // reset background of potential drop target
        if (event.target.className == "dropzone") {
            event.target.style.background = "";
        }
        onHighlight(null);
    }, false);
    div.addEventListener("drop", event => {
        // prevent default action
        // (open as link for some elements in some browsers)
        event.preventDefault();

        // Dragging onto a Diagram
        if (div === myDiagram.div) {
            const can = event.target;
            const pixelratio = myDiagram.computePixelRatio();

            // if the target is not the canvas, we may have trouble, so just quit:
            if (!(can instanceof HTMLCanvasElement)) return;

            const bbox = can.getBoundingClientRect();
            let bbw = bbox.width;
            if (bbw === 0) bbw = 0.001;
            let bbh = bbox.height;
            if (bbh === 0) bbh = 0.001;
            const mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
            const my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
            const point = myDiagram.transformViewToDoc(new go.Point(mx, my));
            onDrop(event, point);

            // remove dragged element from its old location, if checkbox is checked
            // if (document.getElementById('removeCheckBox').checked) dragged.parentNode.removeChild(dragged);

        }

        // If we were using drag data, we could get it here, ie:
        // const data = event.dataTransfer.getData('text');
    }, false);
}


function addDiagramListener(diagram) {
    diagram.addDiagramListener("ViewportBoundsChanged", function (e) {
        e.diagram.commit(function (dia) {
            // only iterates through simple Parts in the diagram, not Nodes or Links
            dia.nodes.each(function (part) {
                // and only on those that have the "_viewPosition" property set to a Point
                if (part._viewPosition) {
                    part.position = dia.transformViewToDoc(part._viewPosition);
                    part.scale = 1 / dia.scale;  // counteract any zooming
                }
            })
        }, null);  // set skipsUndoManager to true, to avoid recording these changes
    });
}

function keyDownWorkpaceHandler(myDiagram) {
    var e = myDiagram.lastInput;
    // The meta (Command) key substitutes for "control" for Mac commands
    var control = e.control || e.meta;
    var deleteKey = e.delete;
    var key = e.key;
    // Quit on any undo/redo key combination:
    if ((control && (key === 'Z' || key === 'Y')) || deleteKey)
        return;

    // call base method with no arguments (default functionality)
    // go.CommandHandler.prototype.doKeyDown.call(this);
};

export { initializeNodeTemplate, setWorkspaceDropListeners, addDiagramListener, getNewWorkspace, initializeLinkTemplate, getLinkContext, keyDownWorkpaceHandler, alterFocusedColor }; 