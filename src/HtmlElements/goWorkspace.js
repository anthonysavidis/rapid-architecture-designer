import { appearComponentButtons } from "../UpTab/tabAppearance/buttonsVisibility.js";
const $ = go.GraphObject.make;

function getNewWorkspace(lid) {
    return $(go.Diagram, lid, {
        padding: 20, // extra space when scrolled all the way
        grid: $(
            go.Panel,
            "Grid", // a simple 10x10 grid
            $(go.Shape, "LineH", {
                stroke: "lightgray",
                strokeWidth: 0.5,
            }),
            $(go.Shape, "LineV", {
                stroke: "lightgray",
                strokeWidth: 0.5,
            })
        ),
        "draggingTool.isGridSnapEnabled": true,
        handlesDragDropForTopLevelParts: true,
        mouseDrop: (e) => {
            // when the selection is dropped in the diagram's background,
            // make sure the selected Parts no longer belong to any Group
            console.log(e);
            var ok = e.diagram.commandHandler.addTopLevelParts(
                e.diagram.selection,
                true
            );
            if (!ok) e.diagram.currentTool.doCancel();
        },
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
    });
}

function initializeNodeTemplate() {
    return $(
        go.Node,
        "Auto",
        {
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE",
            desiredSize: new go.Size(120, 60),
            minSize: new go.Size(40, 40),
            resizable: true,
            resizeCellSize: new go.Size(20, 20),
            // click: function (e, obj) { appearComponentButtons(); },
            selectionChanged: function (node) {

                appearComponentButtons();
            }
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
        ),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
            go.Size.stringify
        ),
        $(
            go.Shape,
            {
                // the border
                name: "SHAPE",
                fill: "white",
                portId: "",
                cursor: "pointer",
                fromLinkable: true,
                toLinkable: true,
                fromLinkableDuplicates: true,
                toLinkableDuplicates: true,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
            },
            new go.Binding("figure"),
            new go.Binding("fill"),
            new go.Binding("stroke", "color"),
            new go.Binding("strokeWidth", "thickness"),
            new go.Binding("strokeDashArray", "dash")
        ),
        // this Shape prevents mouse events from reaching the middle of the port
        $(go.Shape, {
            width: 100,
            height: 40,
            strokeWidth: 0,
            fill: "transparent",
        }),
        $(
            go.TextBlock,
            {
                margin: 1,
                textAlign: "center",
                overflow: go.TextBlock.OverflowEllipsis,
                editable: true,
            },

            // this Binding is TwoWay due to the user editing the text with the TextEditingTool
            new go.Binding("text").makeTwoWay(),
            new go.Binding("stroke", "color")
        ),

    );
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
        resegmentable: true
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
        $(go.TextBlock,
            { alignmentFocus: new go.Spot(0, 1, -4, 0), editable: true },
            new go.Binding("text").makeTwoWay(),  // TwoWay due to user editing with TextEditingTool
            new go.Binding("stroke", "color"))// { segmentOffset: new go.Point(0, 10) })
    );
}
function ClickFunction(propname, value) {
    return (e, obj) => {
        e.handled = true; // don't let the click bubble up
        e.diagram.model.commit(m => {
            m.set(obj.part.adornedPart.data, propname, value);
        });
    };
}
function ArrowButton(num) {
    var geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5";
    if (num === 0) {
        geo = "M0 0 M16 16 M0 8 L16 8";
    } else if (num === 2) {
        geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5  M4 11 L0 8 L4 5";
    } else if (num === 3) {
        geo = "M0 0 M16 16 M0 8 L16 8   M4 11 L0 8 L4 5";
    }
    return $(go.Shape, {
        geometryString: geo,
        margin: 2,
        background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: ClickFunction("dir", num),
        contextClick: ClickFunction("dir", num)
    });
}

function AllSidesButton(to) {
    var setter = (e, shape) => {
        e.handled = true;
        e.diagram.model.commit(m => {
            var link = shape.part.adornedPart;
            m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(go.Spot.AllSides));
            // re-spread the connections of other links connected with the node
            (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
        });
    };
    return $(go.Shape, {
        width: 12,
        height: 12,
        fill: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: setter,
        contextClick: setter
    });
}

function SpotButton(spot, to) {
    var ang = 0;
    var side = go.Spot.RightSide;
    if (spot.equals(go.Spot.Top)) {
        ang = 270;
        side = go.Spot.TopSide;
    } else if (spot.equals(go.Spot.Left)) {
        ang = 180;
        side = go.Spot.LeftSide;
    } else if (spot.equals(go.Spot.Bottom)) {
        ang = 90;
        side = go.Spot.BottomSide;
    }
    if (!to) ang -= 180;
    var setter = (e, shape) => {
        e.handled = true;
        e.diagram.model.commit(m => {
            var link = shape.part.adornedPart;
            m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(side));
            // re-spread the connections of other links connected with the node
            (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
        });
    };
    return $(go.Shape, {
        alignment: spot,
        alignmentFocus: spot.opposite(),
        geometryString: "M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8",
        angle: ang,
        background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: setter,
        contextClick: setter
    });
}
function getLinkContext() {
    return $("ContextMenu",

        $("ContextMenuButton",
            $(go.Panel, "Horizontal",
                ArrowButton(0), ArrowButton(1), ArrowButton(2), ArrowButton(3)
            )
        ),
        $("ContextMenuButton",
            $(go.Panel, "Horizontal",
                $(go.Panel, "Spot",
                    AllSidesButton(false),
                    SpotButton(go.Spot.Top, false), SpotButton(go.Spot.Left, false), SpotButton(go.Spot.Right, false), SpotButton(go.Spot.Bottom, false)
                ),
                $(go.Panel, "Spot", {
                    margin: new go.Margin(0, 0, 0, 2)
                },
                    AllSidesButton(true),
                    SpotButton(go.Spot.Top, true), SpotButton(go.Spot.Left, true), SpotButton(go.Spot.Right, true), SpotButton(go.Spot.Bottom, true)
                )
            )
        )
    );
}

export { initializeNodeTemplate, getNewWorkspace, initializeLinkTemplate, getLinkContext }; 