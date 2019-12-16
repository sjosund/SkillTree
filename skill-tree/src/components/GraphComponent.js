import React from 'react';
import { Sigma, RandomizeNodePositions, EdgeShapes } from 'react-sigma';
import Dagre from 'react-sigma/lib/Dagre'


const GraphComponent = (props) => {
    if (props.graph === null) {
        return (
            <div></div>
        )
    }

    return (
        <Sigma renderer="canvas"
               graph={props.graph}
               settings={{drawEdges: true, clone: true, minArrowSize: 10, labelThreshold:0}}
               style={{height: "100vh", overflow: "auto"}}
               onClickNode={props.onClick}>
            <RandomizeNodePositions/>
            <EdgeShapes default={"arrow"}/>
            <Dagre/>
        </Sigma>
    )
}

export default GraphComponent;