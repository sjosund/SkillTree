import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GraphComponent from './components/GraphComponent';
import HeaderComponent from './components/HeaderComponent';
import NodeForm from "./components/FormComponent";

function App() {
    return (
        <Container className="full-width">
            <Row>
                <HeaderComponent/>
            </Row>
            <Row>
                <Col md={9}>
                    <GraphComponent/>
                </Col>
                <Col style={{backgroundColor: '#333333', color: '#FFFFFF'}}>
                    <NodeForm/>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
