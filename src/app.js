import React from 'react';
import ReactDOM from 'react-dom';
import './styles/dark-theme.css';
import Navbar from './components/Navbar';

function App() {
    return (
        <div>
            <Navbar />
            <h1>Bem-vindo ao Animes CG</h1>
            <p>Explore o mundo dos animes!</p>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));