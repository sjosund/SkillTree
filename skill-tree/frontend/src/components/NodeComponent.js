import React, { Component } from 'react';
import { Row, Button } from 'reactstrap';
// import getResources from '../db/resourceDb'

class NodeComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.node === null) {
            return (
                <div>
                    <h4>Resources</h4>
                    <Row>
                        <h5></h5>
                    </Row>

                </div>
            )
        }

        // const resources = getResources(this.props.node.id); // todo only get these once for a given node


        const targets = Object.values(this.props.targets).map(target => {
            return (
                <li key={target.id}>{target.label}</li>
            )
        });

        let submit;
        if (Object.keys(this.props.targets).length > 0) {
            submit = (
                <div>
                    <Button onClick={this.props.submitEdges}>Submit new prerequisits</Button>
                </div>
            )
        } else {
            submit = (<div></div>)
        }


        return (
            <div>
                <h4>Resources</h4>
                <Row>
                    <h5>{this.props.node.label}</h5>
                </Row>
                <Row>
                    Add new resource
                </Row>
                <Row>
                    <Button onClick={this.props.onMarkSource}>Mark prerequisites</Button>
                </Row>
                <Row>
                    <ul>
                        {targets}
                    </ul>
                </Row>
                <Row>
                    {submit}
                </Row>
            </div>
        )
    }
}

export default NodeComponent;
