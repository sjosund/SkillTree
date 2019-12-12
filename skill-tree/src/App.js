import React from 'react';
import './App.css';
import GraphComponent from './components/GraphComponent';
import HeaderComponent from './components/HeaderComponent';

function App() {
    return (
        <div className="main">
            <HeaderComponent/>
            <GraphComponent className="fullSize"/>
        </div>
    );
}

export default App;
