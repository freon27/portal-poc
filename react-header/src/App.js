import React, {Component} from 'react';
import './App.css';


class App extends Component {

  //  static contextTypes = { history: React.PropTypes.history };

    navigate(url) {
        window.history.pushState({}, '', url);
    }

    render() {
        return (
            <div>
                <h1>Hi There</h1>
                <a onClick={this.navigate('/app1')}>NG 1</a>
                <a onClick={this.navigate('/app2')}>NG 2</a>
                <a onClick={this.navigate('/react')}>React</a>
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