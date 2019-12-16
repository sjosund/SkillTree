import React from 'react';
import { Navbar, Container, Nav, NavItem } from 'react-bootstrap';
import '../App.css';

const HeaderComponent = () => {
    return (
        <Container>
            <Navbar className="navbar-dark full-width">
                <Navbar.Brand href="#">Skill Tree</Navbar.Brand>
                <Nav>
                    <NavItem>
                        <Nav.Link href="#" active>Home</Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link href="#">About</Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link href="#">Settings</Nav.Link>
                    </NavItem>
                </Nav>
            </Navbar>
        </Container>
    )
};

export default HeaderComponent;