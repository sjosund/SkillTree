import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Col } from 'reactstrap';

class NodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
    }

    render() {
        return (
            <div>
                <h4>Create new node</h4>
                <Form onSubmit={this.props.onSubmit}>
                    <FormGroup row>
                        <Col md={8}>
                            <Input type='text' id='name'
                                   placeholder='Node name'
                                   value={this.props.value}
                                   onChange={this.props.onChange}>
                            </Input>
                        </Col>
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
}

export default NodeForm;
