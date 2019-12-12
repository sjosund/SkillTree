import React, { Component } from 'react';
import { Sigma, RandomizeNodePositions, EdgeShapes } from 'react-sigma';
import Dagre from 'react-sigma/lib/Dagre'

const neo4j = require('neo4j-driver');

class GraphComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null
        };
    }

    componentDidMount() {
        const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));
        const session = driver.session();
        session.run('MATCH (person:Person)-[:KNOWS]-(friend) WHERE person.name = "Emil" RETURN id(person) as source, id(friend) as target').then(
            function (result) {
                const links = result.records.map(r => {
                    return {
                        source: r.get('source').toNumber(),
                        target: r.get('target').toNumber()
                    }
                })
                session.close();
                console.log(links);

                const ids = new Set();
                links.forEach(l => {ids.add(l.source); ids.add(l.target)});
                const nodes = Array.from(ids).map(id => {return {id:id}});
                this.setState({
                    graph: {nodes: nodes, edges: links}
                });
            });
    }

    render() {

        // const graph = {
        //     nodes: [
        //         { id: "n0", label: "Counting", x: 0, y: 0, size: 3, color: '#008cc2' },
        //         { id: "n1", label: "Addition", x: 3, y: 1, size: 3, color: '#008cc2' },
        //         { id: "n2", label: "Multiplication", x: 1, y: 3, size: 3, color: '#E57821' },
        //         { id: "n3", label: "Subtraction", x: 1, y: 3, size: 3, color: '#E57821' },
        //         { id: "n4", label: "Division", x: 1, y: 3, size: 3, color: '#E57821' },
        //         { id: "n5", label: "Length", x: 1, y: 3, size: 3, color: '#E57821' },
        //         { id: "n6", label: "Area", x: 1, y: 3, size: 3, color: '#E57821' },
        //         { id: "n7", label: "Volume", x: 1, y: 3, size: 3, color: '#E57821' }
        //     ],
        //     edges: [
        //         { id: "e0", source: "n0", target: "n1", color: '#282c34', type:'arrow', count:1, size:2 },
        //         { id: "e1", source: "n1", target: "n2", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e2", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e3", source: "n3", target: "n4", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e4", source: "n5", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e5", source: "n6", target: "n7", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e6", source: "n0", target: "n5", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e7", source: "n2", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
        //         { id: "e8", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
        //     ]
        // }

        return (
            <Sigma renderer="canvas"
                   graph={this.state.graph}
                   settings={{drawEdges: true, clone: false, minArrowSize: 10}}
                   style={{height: "70%"}}
            >
                <RandomizeNodePositions/>
                <EdgeShapes default={"arrow"}/>
                <Dagre/>
            </Sigma>
        )
    }

}

export default GraphComponent;