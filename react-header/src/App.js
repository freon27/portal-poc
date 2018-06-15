import React, {Component} from 'react';
import './App.css';


class App extends Component {

    //  static contextTypes = { history: React.PropTypes.history };

    constructor(props) {
        super(props);
        this.state = {pathName: this.normalisePathName(window.location.pathname)};
    }


    navigate(ev, url) {
        ev.stopPropagation();
        console.log(`navigating to ${url}`, window.history);
        window.history.pushState({}, '', url);
    }

    normalisePathName(pathname) {
        pathname = pathname.replace(/^\//, '')
        pathname = pathname.replace(/\/$/, '');
        return pathname;
    }

    getActiveClass(partialUrl) {
        return this.state.pathName.startsWith(this.normalisePathName(partialUrl)) ? 'active': ''
    }

    componentDidMount() {
        console.log('mounted');
        window.addEventListener('single-spa:app-change', () => {
           this.setState({
               pathName: this.normalisePathName(window.location.pathname)
           });
        });
    }

    render() {
        return (
            <div>
                <div class="PortalApp">
                    <h1>React Header</h1>
                    <a class={this.getActiveClass('/app1')} href="#" onClick={(ev) => {
                        this.navigate(ev, '/app1')
                    }}>Angular1</a>
                    <a class={this.getActiveClass('/app2')}  href="#" onClick={(ev) => {
                        this.navigate(ev, '/app2')
                    }}>Angular2</a>
                    <a class={this.getActiveClass('/react')}  href="#" onClick={(ev) => {
                        this.navigate(ev, '/react')
                    }}>React</a>

                </div>
                <div id="container"></div>
            </div>
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