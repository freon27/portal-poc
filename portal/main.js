import {registerApplication, start} from 'single-spa';
import {loader} from 'single-spa-angular-cli';
import 'babel-polyfill';

const applications = require('./applications.config.json');

const ApplicationType = Object.freeze({
    ANGULAR_CLI: 'ng-cli',
    REACT: 'react'
});

function normalisePathName(pathname) {
    pathname = pathname.replace(/^\//, '')
    pathname = pathname.replace(/\/$/, '');
    return pathname;
}

const xmlToAssets = (xml) => {
    var dom = document.createElement('html');
    dom.innerHTML = xml;
    const linksEls = dom.querySelectorAll('link[rel="stylesheet"]');
    const scriptsEls = dom.querySelectorAll('script[type="text/javascript"]');
    return {
        styles: Array.from(linksEls).map(el => el.getAttribute('href')),
        scripts: Array.from(scriptsEls).map(el => el.getAttribute('src')).filter(src => !src.match(/zone\.js/))
    };
}

const transformOptsWithAssets = (opts) => {
    const url = `${opts.baseHref}/index.html`;
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
    } catch (e) {}
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
    console.log(`registering ${application.name}`);
    registerApplication(
        application.name,
        (() => {

            switch (application.type) {
                case ApplicationType.ANGULAR_CLI :
                    console.log(`Loading ng CLI app ${application.name}`);

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
                    loadStyleTag(`${application.baseHref}/static/elements.css`)
                    return SystemJS.import(`${application.baseHref}/static/elements.js`);
                    //return loadScriptTag(`${application.baseHref}/static/js/${buildArtefact}`);

            }
        })(),
        () => {
             window["webpackJsonp"] = null; //FIXME: THIS IS NOT GOOD!
            return application.matchRoute === '**' || normalisePathName(window.location.pathname).startsWith(application.matchRoute); // FIXME: I need to do a full match up to next /
        }
    );
}

start();
