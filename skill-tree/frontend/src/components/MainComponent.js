import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';

import GraphComponent from './GraphComponent';
import HeaderComponent from './HeaderComponent';
import NodeForm from "./FormComponent";
import NodeComponent from "./NodeComponent";
import Graph from '../models/graph';


class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null,
            newNodeName: '',
            activeNode: null,
            activeSource: null,
            targets: {},
            resources: null,
            newResource: {
                nodeId: '',
                text: '',
                url: ''
            },
            nodeStatus: null
        };

        this.handleNewNodeSubmit = this.handleNewNodeSubmit.bind(this);
        this.handleNewNodeChange = this.handleNewNodeChange.bind(this);

        this.markActive = this.markActive.bind(this);
        this.markSource = this.markSource.bind(this);
        this.submitEdges = this.submitEdges.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.handleResourseTextChange = this.handleResourseTextChange.bind(this);
        this.handleResourseURLChange = this.handleResourseURLChange.bind(this);
        this.handleResourceSubmit = this.handleResourceSubmit.bind(this);

        this.handleSetStatus = this.handleSetStatus.bind(this);
    }

    async handleNewNodeSubmit(event) {
        event.preventDefault();
        const ret = await fetch('/nodes', {
            method: 'POST',
            body: JSON.stringify({name: this.state.newNodeName}),
            headers: {
                'Content-Type': 'application/json'
            }
        }); //addNode(this.state.newNodeName);
        const newNode = await ret.json();
        let graph = this.state.graph;
        graph = graph.addNode(newNode);
        this.setState({graph: graph});
    }

    handleNewNodeChange(event) {
        const value = event.target.value;
        this.setState({newNodeName: value});
    }

    handleResourseTextChange(event) {
        const value = event.target.value;
        let newResource = this.state.newResource;
        newResource.text = value;
        this.setState({newResource: newResource});
    }

    handleResourseURLChange(event) {
        const value = event.target.value;
        let newResource = this.state.newResource;
        newResource.url = value;
        this.setState({newResource: newResource});
    }

    async handleResourceSubmit(event) {
        event.preventDefault();
        let newResource = this.state.newResource;
        newResource.nodeId = this.state.activeNode.id;
        // Validate url
        const ret = await fetch('/resources', {
            method: 'POST',
            body: JSON.stringify(newResource),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const newResourceRet = await ret.json();
        let resources = this.state.resources;
        resources.push(newResourceRet);
        this.setState({resources: resources});
    };

    handleSetStatus = (status) => async (event) => {
        const ret = await fetch('/nodeStatus', {
            method: 'POST',
            body: JSON.stringify({
                nodeId: this.state.activeNode.id,
                status: status
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    componentDidMount() {
        if (this.state.graph === null) {
            this.loadNodeStatus().then(status => this.loadGraph(status));
        }
    }

    async markActive(event) {
        let node = event.data.node;
        if (this.state.activeSource !== null) {
            let targets = this.state.targets;
            targets[node.id] = node;
            this.setState({targets: targets});
        } else {
            const resp = await fetch(`/resources/${node.id}`, { headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }); //${this.props.node.id}`); // todo only get these once for a given node
            const resources = await resp.json();

            this.setState({
                activeNode: node,
                resources: resources
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
        const body = JSON.stringify({
            source: this.state.activeSource,
            targets: Object.values(this.state.targets)});
        const ret = await fetch('/edges', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const newEdges = await ret.json();
        let graph = this.state.graph;
        graph = graph.addEdges(newEdges);
        this.setState({graph: graph, targets: {}, activeSource: null});
    }

    async loadGraph(status) {
        const cy = new Graph();
        const graph = await cy.load().then(g => g.updateStatus(status));

        this.setState({
            graph: graph
        });
    }

    async loadNodeStatus() {
        const userId = 'tmp';
        const nodeStatusResp = await fetch(`/nodeStatus/${userId}`);
        const nodeStatus = await nodeStatusResp.json();

        this.setState({
            nodeStatus: nodeStatus,
        });
        return nodeStatus;
    }

    render() {
        const graph = (this.state.graph === null) ? null : this.state.graph.toSigma();
        return (
            <Container className="full-width">
                <Row>
                    <HeaderComponent/>
                </Row>
                <Row>
                    <Col md={9}>
                        <GraphComponent graph={graph} onClick={this.markActive}/>
                    </Col>
                    <Col className="navbar-dark node-container" >
                        <NodeForm onChange={this.handleNewNodeChange}
                                  onSubmit={this.handleNewNodeSubmit}
                                  value={this.state.newNodeName}/>
                        <NodeComponent node={this.state.activeNode}
                                       onMarkSource={this.markSource}
                                       targets={this.state.targets}
                                       submitEdges={this.submitEdges}
                                       resources={this.state.resources}
                                       onTextChange={this.handleResourseTextChange}
                                       onURLChange={this.handleResourseURLChange}
                                       onResourceSubmit={this.handleResourceSubmit}
                                       resource={this.state.newResource}
                                       setGoal={this.handleSetStatus('goal')}
                                       setKnown={this.handleSetStatus('known')}
                                       setUnknown={this.handleSetStatus('unknown')}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MainComponent;