import React from 'react';
import { Navbar, Container, Nav, NavItem, Col, Row, Image } from 'react-bootstrap';
import '../App.css';

const HeaderComponent = () => {
    return (
        <Container className="navbar-container" fluid>
             <Navbar className="navbar-light">
                 <Col sm={2}>
                     <button className="navbar-toggler-icon toggle-st"></button>
                 </Col>
                 <Col sm={7} className="logo-st">SKILL TREE</Col>
                 <Col sm={3} className="float-right">
                     <Row className="user-wrapper float-right">
                         {/*<Col sm={2}>*/}
                         <a href="/profile" className="profile-image">
                             <Image height={40} roundedCircle={true} src={process.env.PUBLIC_URL + "/profile.jpg"}/>
                         </a>
                         {/*<div className="d-sm-none d-md-block">*/}
                         <div className="user-rewards-gold d-none d-lg-block">
                             &#9679; <span className="user-reward">42</span>
                         </div>
                         <div className="user-rewards-silver d-none d-lg-block">
                             &#9679; <span className="user-reward">192</span>
                         </div>
                         {/*</div>*/}
                     </Row>
                 </Col>
                {/*<div className="logo-st">SKILL TREE</div>*/}
                {/*<div className="user-st">*/}
                {/*// </div>*/}
                {/*<Navbar.Brand className="full-width" href="#">SKILL TREE</Navbar.Brand>*/}
                {/*<Nav>*/}
                    {/*<NavItem>*/}
                        {/*<Nav.Link href="#" active>Home</Nav.Link>*/}
                    {/*</NavItem>*/}
                    {/*<NavItem>*/}
                        {/*<Nav.Link href="#">About</Nav.Link>*/}
                    {/*</NavItem>*/}
                    {/*<NavItem>*/}
                        {/*<Nav.Link href="#">Settings</Nav.Link>*/}
                    {/*</NavItem>*/}
                {/*</Nav>*/}
            </Navbar>
        </Container>
    )
};

export default HeaderComponent;