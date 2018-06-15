import React, {Component} from 'react';
import {BrowserRouter as Router, Route, NavLink as Link, Redirect} from "react-router-dom";
import './App.css';

class Route1Component extends Component {
    render() {
        return (
            <div>
                <h3>Route 1 React</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        );
    }
}

class Route2Component extends Component {
    render() {
        return (
            <div>
                <h3>Route 2 React</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (

            <Router basename="/react">
                <div class="ReactApp1">
                    <Link className="button" activeClassName="active" to={'/react1'}>React route 1</Link>
                    <Link className="button" activeClassName="active" to={'/react2'}>React route 2</Link>
                    <Redirect from="/" to="/react1"/>
                    <Route path="/react2" component={Route2Component}/>
                    <Route path="/react1" component={Route1Component}/>
                    <div id="container"></div>
                </div>

            </Router>


        );
    }
}

export default App;

/*

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>

 */