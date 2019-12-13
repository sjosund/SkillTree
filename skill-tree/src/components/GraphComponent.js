import React, { Component } from 'react';
import { Sigma, RandomizeNodePositions, EdgeShapes, RelativeSize } from 'react-sigma';
import Dagre from 'react-sigma/lib/Dagre'

const neo4j = require('neo4j-driver');

class GraphComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null
        };
    }

    async componentDidMount() {
        const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));
        const session = driver.session();
        const graph = await session.run('MATCH (person:Person)-[:KNOWS]-(friend) RETURN person, friend, id(person) as source, id(friend) as target').then(
            result => {
                const links = result.records.map((r, idx) => {
                    console.log(r)
                    return {
                        id: idx.toString(),
                        source: r.get('source').toNumber().toString(),
                        source_name: r.get('person').properties.name,
                        target: r.get('target').toNumber().toString(),
                        target_name: r.get('friend').properties.name,
                        type: 'arrow',
                        size: 2,
                        count: 1
                    }
                })
                session.close();
                console.log(links);

                let nodes = {};
                links.forEach(l => {
                    nodes[l.source] = {id: l.source, label: l.source_name, size: 3, color:'#008cc2'};
                    nodes[l.target] = {id: l.target, label: l.target_name, size: 3, color:'#008cc2'};
                    // n.add({id: l.source, name: l.source_name});
                    // n.add({id: l.target, name: l.target_name})
                });

                // const nodes = Array.from(n).map(nn => {
                //     return {
                //         id: nn.id,
                //         label: nn.name,
                //         size: 3,
                //         color: '#008cc2'
                //     }
                // });
                return {nodes: Object.values(nodes), edges: links};
            });
        console.log('set graph')
        console.log(this.state.graph);

        const graph2 = {
            nodes: [
                { id: "n0", label: "Counting", x: 0, y: 0, size: 3, color: '#008cc2' },
                { id: "n1", label: "Addition", x: 3, y: 1, size: 3, color: '#008cc2' },
                { id: "n2", label: "Multiplication", x: 1, y: 3, size: 3, color: '#E57821' },
                { id: "n3", label: "Subtraction", x: 1, y: 3, size: 3, color: '#E57821' },
                { id: "n4", label: "Division", x: 1, y: 3, size: 3, color: '#E57821' },
                { id: "n5", label: "Length", x: 1, y: 3, size: 3, color: '#E57821' },
                { id: "n6", label: "Area", x: 1, y: 3, size: 3, color: '#E57821' },
                { id: "n7", label: "Volume", x: 1, y: 3, size: 3, color: '#E57821' }
            ],
            edges: [
                { id: "e0", source: "n0", target: "n1", color: '#282c34', type:'arrow', count:1, size:2 },
                { id: "e1", source: "n1", target: "n2", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e2", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e3", source: "n3", target: "n4", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e4", source: "n5", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e5", source: "n6", target: "n7", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e6", source: "n0", target: "n5", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e7", source: "n2", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
                { id: "e8", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
            ]
        };


        this.setState({
            graph: graph
        });
    }

    render() {
        console.log('Render')
        console.log(this.state.graph);
        if (this.state.graph === null) {
            return (
                <div></div>
            )
        }


        return (
            <Sigma renderer="canvas"
                   graph={this.state.graph}
                   settings={{drawEdges: true, clone: false, minArrowSize: 10}}
                   style={{height: "100vh", overflow: "auto"}}>
                <RelativeSize initialSize={15}/>
                <RandomizeNodePositions/>
                <EdgeShapes default={"arrow"}/>
                <Dagre/>
            </Sigma>
        )
    }

}

export default GraphComponent;