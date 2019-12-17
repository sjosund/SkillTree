import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';

import GraphComponent from './GraphComponent';
import HeaderComponent from './HeaderComponent';
import NodeForm from "./FormComponent";
import {addEdge, addEdges, addNode, fullGraph} from '../db/graphDb';
import NodeComponent from "./NodeComponent";


class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null,
            formName: '',
            activeNode: null,
            activeSource: null,
            targets: {}
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.markActive = this.markActive.bind(this);
        this.markSource = this.markSource.bind(this);
        this.submitEdges = this.submitEdges.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const newNode = await addNode(this.state.formName);
        let graph = this.state.graph;
        graph.nodes[newNode.source] = newNode;
        console.log(graph);
        this.setState({graph: graph});
    }

    handleFormChange(event) {
        const value = event.target.value;
        this.setState({formName: value});
    }

    componentDidMount() {
        console.log('In component did mount');
        console.log(this.state.graph);
        if (this.state.graph === null) {
            console.log('Loading the full graph');
            this.loadGraph();
        }
    }

    markActive(event) {
        let node = event.data.node;
        if (this.state.activeSource !== null) {
            let targets = this.state.targets;
            targets[node.id] = node;
            this.setState({targets: targets});
        } else {
            this.setState({
                activeNode: node
            });
        }
    }

    markSource(event) {
        let node = this.state.activeNode;
        this.setState({
            activeSource: node
        });
    }

    async submitEdges(event) {
        const newEdges = await addEdges(this.state.activeSource, Object.values(this.state.targets));
        let graph = this.state.graph;
        graph.edges = graph.edges.concat(newEdges);
        this.setState({graph: graph, targets: {}, activeSource: null});
    }

    async loadGraph() {
        const graph = await fullGraph();

        const graph2 = {
            nodes: [
                { id: "n0", label: "Counting", x: 0, y: 0, size: 100, color: '#008cc2' },
                { id: "n1", label: "Addition", x: 3, y: 1, size: 100, color: '#008cc2' },
                { id: "n2", label: "Multiplication", x: 1, y: 3, size: 100, color: '#E57821' },
                { id: "n3", label: "Subtraction", x: 1, y: 3, size: 100, color: '#E57821' },
                { id: "n4", label: "Division", x: 1, y: 3, size: 100, color: '#E57821' },
                { id: "n5", label: "Length", x: 1, y: 3, size: 100, color: '#E57821' },
                { id: "n6", label: "Area", x: 1, y: 3, size: 100, color: '#E57821' },
                { id: "n7", label: "Volume", x: 1, y: 3, size: 100, color: '#E57821' }
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
            graph: graph2
        });
    }

    render() {
        // console.log('Rendering');
        // console.log(this.state.graph);
        return (
            <Container className="full-width">
                <Row>
                    <HeaderComponent/>
                </Row>
                <Row>
                    <Col md={9}>
                        <GraphComponent graph={this.state.graph} onClick={this.markActive}/>
                    </Col>
                    <Col className="navbar-dark node-container" >
                        <NodeForm onChange={this.handleFormChange}
                                  onSubmit={this.handleFormSubmit}
                                  value={this.state.formName}/>
                        <NodeComponent node={this.state.activeNode}
                                       onMarkSource={this.markSource}
                                       targets={this.state.targets}
                                       submitEdges={this.submitEdges}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MainComponent;