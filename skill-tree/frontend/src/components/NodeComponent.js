import React, { Component } from 'react';
import { Row, Button, Form, FormGroup, Input, Col } from 'reactstrap';
// import getResources from '../db/resourceDb'


class NodeComponent extends Component {
    constructor(props) {
        super(props);
    }

    resourceForm() {
        return (
            <div>
                <h4>Create new resource</h4>
                <Form onSubmit={this.props.onResourceSubmit}>
                    <FormGroup row>
                        <Row>
                            <Col md={8}>
                                <Input type='text' id='text'
                                       placeholder='Resource Text'
                                       value={this.props.resource.text}
                                       onChange={this.props.onTextChange}>
                                </Input>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Input type='text' id='url'
                                       placeholder='Resource URL'
                                       value={this.props.resource.url}
                                       onChange={this.props.onURLChange}>
                                </Input>
                            </Col>
                        </Row>
                        <Col>
                            <Button type='submit' color='primary'>
                                Create
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }

    empty() {
        return (
            <div>
                <Row className="node-label"></Row>
                <h4>Resources</h4>
                <Row>
                    <h5></h5>
                </Row>

            </div>
        )
    }

    render() {
        if (this.props.node === null) {
            return this.empty();
        }

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
        console.log(this.props);

        const resources = this.props.resources.map(resource => {
            return (
                <li key={resource._id}><a href={resource.url}>{resource.text}</a></li>
            )
        });


        return (
            <div>
                <Row className="justify-content-center align-content-center node-label">
                    <h4>{this.props.node.label}</h4>
                </Row>
                <h4>Resources</h4>
                <Row>
                    <ul>
                        {resources}
                    </ul>
                </Row>
                <Row>
                    Add new resource
                </Row>
                <Row>
                    {this.resourceForm()}
                </Row>
                <Row>
                    <Button onClick={this.props.setGoal}>Mark as goal</Button>
                </Row>
                <Row>
                    <Button onClick={this.props.setKnown}>Mark as known</Button>
                </Row>
                <Row>
                    <Button onClick={this.props.setUnknown}>Mark as unknown</Button>
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
