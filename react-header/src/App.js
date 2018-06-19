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
        ev.preventDefault();
        ev.nativeEvent.stopImmediatePropagation();
        console.log(`navigating to ${url}`, window.history);
        window.history.pushState({}, '', url);
    }

    normalisePathName(pathname) {
        pathname = pathname.replace(/^\//, '')
        pathname = pathname.replace(/\/$/, '');
        return pathname;
    }

    getActiveClass(partialUrl) {
        return this.state.pathName.startsWith(this.normalisePathName(partialUrl)) ? 'active' : ''
    }

    componentDidMount() {
        console.log('mounted');
        document.addEventListener('portal:pushState', () => {
            this.setState({
                pathName: this.normalisePathName(window.location.pathname)
            });
        });
    }

    /*getBreadcrumbs() {
        console.log('bread', this.state.pathName);

        let path = '';

        return this.state.pathName.split('/').map((pathNamePart, index) => {
            console.log('part', pathNamePart);
            const currentPath = path;
            console.log('paths', currentPath, path);
            path += pathNamePart;
            return <span>{ index > 0 ? '/ ': ''}<a onClick={(ev) => this.navigate(ev, currentPath)} href={currentPath}>{pathNamePart}</a></span>
        });
    }*/


    render() {
        console.log('ren', window);

        const portalRouter = window.$portalRouter;

        console.log(portalRouter);

        const app1Link = portalRouter.portalLink('app1', '');
        const app2Link = portalRouter.portalLink('app2', '');
        const reactChildLink = portalRouter.portalLink('reactchild', '');

        return (
            <div class="PortalApp">
                <div class="PortalApp-navigation">
                    <h1>React Header</h1>
                    <a class={this.getActiveClass('/app1')} href={app1Link} onClick={(ev) => {
                        this.navigate(ev, app1Link)
                    }}>Angular1</a>
                    <a class={this.getActiveClass('/app2')} href={app2Link} onClick={(ev) => {
                        this.navigate(ev, app2Link)
                    }}>Angular2</a>
                    <a class={this.getActiveClass('/react')} href={reactChildLink} onClick={(ev) => {
                        this.navigate(ev, reactChildLink)
                    }}>React</a>

                </div>
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