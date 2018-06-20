import {registerApplication, start} from 'single-spa';
import {loader} from 'single-spa-angular-cli';
import 'babel-polyfill';
import {PortalRouter} from "./PortalRouter";

const applications = require('./applications.config.json');

const ApplicationType = Object.freeze({
    ANGULAR_CLI: 'ng-cli',
    REACT: 'react'
});

let router;
window.$portalRouter = router = new PortalRouter(applications);

// Monkeypath pushState to fire a custom event
const pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    console.log('push state monkeypatch', arguments);
    const pushEvent = new CustomEvent('portal:pushState', {detail: arguments[2]});
    document.dispatchEvent(pushEvent);
};

const xmlToAssets = (xml) => {
    var dom = document.createElement('html');
    dom.innerHTML = xml;
    const linksEls = dom.querySelectorAll('link[rel="stylesheet"]');
    const scriptsEls = dom.querySelectorAll('script[type="text/javascript"]');
    console.log(linksEls, scriptsEls);
    return {
        styles: Array.from(linksEls).map(el => el.getAttribute('href')),
        scripts: Array.from(scriptsEls).map(el => el.getAttribute('src')).filter(src => !src.match(/zone\.js/))
    };
}

const transformOptsWithAssets = (opts) => {
    const url = `${opts.baseHref}/`;
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onreadystatechange = (event) => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status >= 200 && req.status < 400) {
                    const res = xmlToAssets(req.responseText);
                    opts.styles = res.styles;
                    opts.scripts = res.scripts;
                    resolve(null);
                } else {
                    reject(`Try to load ${url}, status : ${this.status} => ${this.statusText}`);
                }
            }
        };
        req.open('GET', url, true);
        req.send(null);
    });
};

const loadLinkTag = (url) => {
    return () => {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.onload = function () {
                resolve();
            };
            link.onerror = err => {
                reject(err);
            };
            link.href = url;
            link.rel = 'stylesheet';
            link.id = hashCode(url);
            document.head.appendChild(link);
        });
    };
};

const loadAllAssets = (opts) => {
    return new Promise((resolve, reject) => {
        transformOptsWithAssets(opts).then(() => {
            const scriptsPromise = opts.scripts.reduce(
                (prev, fileName) => prev.then(loadScriptTag(`${opts.baseHref}/${fileName}`)),
                Promise.resolve(undefined)
            );
            const stylesPromise = opts.styles.reduce(
                (prev, fileName) => prev.then(loadLinkTag(`${opts.baseHref}/${fileName}`)),
                Promise.resolve(undefined)
            )
            Promise.all([scriptsPromise, stylesPromise]).then(resolve, reject);
        }, reject);
    });
};

const hashCode = (str) => {
    var hash = 0;
    if (str.length == 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = hash >>> 1;
    }
    return hash.toString();
};

const loadScriptTag = (url) => {
    return () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = function () {
                resolve();
            };
            script.onerror = err => {
                reject(err);
            };
            script.src = url;
            script.id = hashCode(url);
            document.head.appendChild(script);
        });
    };
};

const loadStyleTag = (url) => {

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = url;
    document.head.appendChild(style);

};

const displayLoader = () => {
    try {
        document.getElementById('loader').style.display = 'none';
    } catch (e) {
    }
}

const hideLoader = () => {
    try {
        document.getElementById('loader').style.display = 'block';
    } catch (e) {
    }
}


window.addEventListener('', () => {

});

for (const application of applications) {
    registerApplication(
        application.name,
        (() => {

            switch (application.type) {
                case ApplicationType.ANGULAR_CLI :
                    const lifecycles = loader({
                        name: application.name,
                        selector: application.selector,
                        baseHref: application.baseHref
                    });
                    return {
                        bootstrap: [lifecycles.bootstrap],
                        mount: [lifecycles.mount],
                        unmount: [lifecycles.unmount],
                        unload: [lifecycles.unload],
                    };

                    break;
                case ApplicationType.REACT:
                    console.log(`Loading react app ${application.name}`);

                    return () => {
                        loadStyleTag(`${application.baseHref}/static/elements.css`);
                        return SystemJS.import(`${application.baseHref}/static/elements.js`);
                    }
                //return loadScriptTag(`${application.baseHref}/static/js/${buildArtefact}`);
                // loadAllAssets(application);

            }
        })(),
        (location) => {
            window["webpackJsonp"] = null; //FIXME: THIS IS NOT GOOD!
            //console.log('location', location.pathname, router.match(location.pathname));

            const match = router.match(application.name, location.pathname);

            if (match) {
                if (application.matchRoute !== '**') { // TODO: still needed?
                    application.baseHref = location.pathname;
                }
                console.log('MATCHED', application);
            }


            return match;
        }
    );
}

start();
