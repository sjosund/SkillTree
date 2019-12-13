import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Col } from 'reactstrap';

class NodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        console.log(this.state);
        const value = event.target.value;

        this.setState({name: value});
    }

    handleSubmit(event) {
        console.log(this.state);
        alert(this.state.name);
    }

    render() {
        return (
            <div>
                <h4>Create new node</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                        <Col md={8}>
                            <Input type='text' id='name'
                                   placeholder='Node name'
                                   value={this.state.name}
                                   onChange={this.handleChange}>
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
