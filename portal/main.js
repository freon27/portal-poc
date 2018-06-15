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
                    //return SystemJS.import(`${application.baseHref}/static/js/main.884d7dc1.js`)
                    return loadScriptTag(`${application.baseHref}/static/js/main.884d7dc1.js`);

            }
        })(),
        () => {
            window["webpackJsonp"] = null; //FIXME: THIS IS NOT GOOD!
            return normalisePathName(window.location.pathname).startsWith(application.matchRoute);
        }
    );
}

start();
